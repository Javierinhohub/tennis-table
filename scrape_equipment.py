"""
scrape_equipment.py — Récupération automatique des équipements des joueurs pro
===============================================================================
Sources : tabletennis11.com (profils joueurs avec équipement détaillé)

Ce script tourne sur GitHub Actions (pas de restriction proxy).
Il ne met à jour QUE les joueurs dont les champs équipement sont NULL.
Il ne touche jamais aux classements ni aux données existantes.

Lancement manuel (depuis GitHub Actions) :
    SUPABASE_URL=... SUPABASE_KEY=... python3 scrape_equipment.py

Option :
    --dry-run   Affiche les données trouvées sans écrire en base
    --force     Écrase même les champs déjà renseignés
"""

import os, sys, re, time, json
import argparse
import requests
from bs4 import BeautifulSoup
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}

# ─── Normalisation ────────────────────────────────────────────────────────────

def normalize(s):
    s = (s or "").upper().strip()
    s = re.sub(r"[ÀÁÂÃÄ]", "A", s)
    s = re.sub(r"[ÈÉÊË]", "E", s)
    s = re.sub(r"[ÌÍÎÏ]", "I", s)
    s = re.sub(r"[ÒÓÔÕÖ]", "O", s)
    s = re.sub(r"[ÙÚÛÜ]", "U", s)
    s = re.sub(r"[^A-Z0-9 \-]", "", s)
    return re.sub(r"\s+", " ", s).strip()

# ─── TT11 : recherche + profil ────────────────────────────────────────────────

def tt11_search(nom):
    """Recherche un joueur sur tabletennis11.com, retourne l'URL de son profil."""
    query = nom.replace(" ", "+")
    url = f"https://www.tabletennis11.com/search?q={query}&type=player"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, "html.parser")
        # Premier résultat joueur
        link = soup.select_one("a[href*='/player/']")
        if link:
            href = link.get("href", "")
            if not href.startswith("http"):
                href = "https://www.tabletennis11.com" + href
            return href
    except Exception as e:
        print(f"    ⚠️  Recherche TT11 échouée pour {nom}: {e}")
    return None

def tt11_parse_equipment(url):
    """
    Parse un profil TT11 et retourne un dict avec :
      blade, rubber_cd, rubber_rv (noms bruts)
    """
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, "html.parser")

        result = {}

        # TT11 affiche l'équipement dans des sections avec labels
        # Chercher "Blade", "Forehand rubber", "Backhand rubber"
        for section in soup.find_all(["div", "section", "li"]):
            text = section.get_text(separator=" ", strip=True)

            # Blade / Bois
            m = re.search(r"Blade[:\s]+([A-Za-z0-9][^|\n]{3,60})", text, re.IGNORECASE)
            if m and "blade" not in result:
                result["blade"] = m.group(1).strip().rstrip("|").strip()

            # Forehand rubber
            m = re.search(r"Forehand(?:\s+rubber)?[:\s]+([A-Za-z0-9][^|\n]{3,60})", text, re.IGNORECASE)
            if m and "rubber_cd" not in result:
                result["rubber_cd"] = m.group(1).strip().rstrip("|").strip()

            # Backhand rubber
            m = re.search(r"Backhand(?:\s+rubber)?[:\s]+([A-Za-z0-9][^|\n]{3,60})", text, re.IGNORECASE)
            if m and "rubber_rv" not in result:
                result["rubber_rv"] = m.group(1).strip().rstrip("|").strip()

        # Fallback : chercher dans les meta ou structured data
        if not result:
            # Chercher dans les éléments avec class contenant "equipment" ou "gear"
            for el in soup.find_all(class_=re.compile(r"equip|gear|blade|rubber", re.I)):
                text = el.get_text(separator=" ", strip=True)
                if len(text) > 5 and len(text) < 100:
                    print(f"    [debug] {el.get('class')} → {text}")

        return result if result else None

    except Exception as e:
        print(f"    ⚠️  Parse TT11 échoué pour {url}: {e}")
        return None

# ─── Recherche dans la DB TT-Kip (pour matcher le nom exact) ─────────────────

def find_produit(nom_brut, table="revetements"):
    """
    Cherche le produit dans la base TT-Kip et retourne (nom_complet, type).
    nom_brut : ex "Tenergy 05" ou "Dignics 09C"
    """
    if not nom_brut or len(nom_brut) < 3:
        return None, None

    # Cherche dans produits via revetements
    res = sb.table("produits").select("id, nom, marques(nom), revetements!inner(type_revetement)") \
        .ilike("nom", f"%{nom_brut.strip()}%").limit(3).execute()

    if res.data:
        p = res.data[0]
        marque = (p.get("marques") or {}).get("nom", "")
        nom_complet = f"{marque} {p['nom']}".strip() if marque else p["nom"]
        rev = p.get("revetements")
        type_rev = None
        if isinstance(rev, list) and rev:
            type_rev = rev[0].get("type_revetement")
        elif isinstance(rev, dict):
            type_rev = rev.get("type_revetement")
        return nom_complet, type_rev

    return None, None

def find_bois(nom_brut):
    """Cherche un bois dans la base TT-Kip."""
    if not nom_brut or len(nom_brut) < 3:
        return None

    res = sb.table("produits").select("id, nom, marques(nom), bois!inner(nb_plis)") \
        .ilike("nom", f"%{nom_brut.strip()}%").limit(3).execute()

    if res.data:
        p = res.data[0]
        marque = (p.get("marques") or {}).get("nom", "")
        return f"{marque} {p['nom']}".strip() if marque else p["nom"]

    return None

# ─── Main ─────────────────────────────────────────────────────────────────────

def run(dry_run=False, force=False):
    print("\n" + "=" * 60)
    print("  Scraping équipements — TT-Kip")
    print("  " + ("DRY RUN" if dry_run else "MODE RÉEL"))
    print("=" * 60)

    # Charger les joueurs sans équipement (ou tous si --force)
    res_h = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial, bois_nom") \
        .eq("actif", True).eq("genre", "H").order("classement_mondial").limit(100).execute()
    res_f = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial, bois_nom") \
        .eq("actif", True).eq("genre", "F").order("classement_mondial").limit(100).execute()

    joueurs = (res_h.data or []) + (res_f.data or [])

    if not force:
        joueurs = [j for j in joueurs if not j.get("bois_nom")]

    print(f"  {len(joueurs)} joueurs à traiter\n")

    updated = 0
    not_found = 0

    for j in joueurs:
        nom = j["nom"]
        print(f"  ── {nom} (#{j.get('classement_mondial')}) ──")

        # 1. Recherche sur TT11
        profile_url = tt11_search(nom)
        if not profile_url:
            print(f"     ⚠️  Profil TT11 introuvable")
            not_found += 1
            time.sleep(0.5)
            continue

        print(f"     🔗 {profile_url}")
        equipment = tt11_parse_equipment(profile_url)

        if not equipment:
            print(f"     ⚠️  Pas d'équipement trouvé sur TT11")
            not_found += 1
            time.sleep(1)
            continue

        # 2. Matcher avec la DB TT-Kip
        payload = {}

        if equipment.get("blade"):
            bois_nom = find_bois(equipment["blade"])
            payload["bois_nom"] = bois_nom or equipment["blade"]
            print(f"     Bois : {payload['bois_nom']}")

        if equipment.get("rubber_cd"):
            nom_complet, type_rev = find_produit(equipment["rubber_cd"])
            payload["revetement_cd"] = nom_complet or equipment["rubber_cd"]
            if type_rev:
                payload["revetement_cd_type"] = type_rev
            print(f"     CD   : {payload['revetement_cd']} ({payload.get('revetement_cd_type', '?')})")

        if equipment.get("rubber_rv"):
            nom_complet, type_rev = find_produit(equipment["rubber_rv"])
            payload["revetement_rv"] = nom_complet or equipment["rubber_rv"]
            if type_rev:
                payload["revetement_rv_type"] = type_rev
            print(f"     RV   : {payload['revetement_rv']} ({payload.get('revetement_rv_type', '?')})")

        if not payload:
            print(f"     ⚠️  Aucun champ à mettre à jour")
            time.sleep(1)
            continue

        if dry_run:
            print(f"     [DRY] Pas d'écriture")
        else:
            sb.table("joueurs_pro").update(payload).eq("id", j["id"]).execute()
            print(f"     ✅ Enregistré")
            updated += 1

        time.sleep(1.5)  # Éviter le rate-limiting

    print(f"\n  Total : {updated} mis à jour · {not_found} introuvables\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Test sans écriture")
    parser.add_argument("--force",   action="store_true", help="Écraser les données existantes")
    args = parser.parse_args()
    run(dry_run=args.dry_run, force=args.force)
