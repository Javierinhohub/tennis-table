"""
update_rankings.py — Mise à jour automatique du classement mondial WTT/ITTF
============================================================================
Source : API WTT interne (SEN_SINGLES.json) — 100 H + 100 F en JSON direct.
Fallback : scraping HTML results.ittf.link (top 50 seulement).

Lancement manuel :
    SUPABASE_URL=... SUPABASE_KEY=... python3 update_rankings.py

Automatique : chaque mardi à 12h via GitHub Actions.
"""

import os, sys, time
import requests
from bs4 import BeautifulSoup
from supabase import create_client

# ─── Config ───────────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html, */*",
    "Origin": "https://www.worldtabletennis.com",
    "Referer": "https://www.worldtabletennis.com/",
}

# ─── Traduction pays ──────────────────────────────────────────────────────────

PAYS_FR = {
    "China": "Chine", "Japan": "Japon", "Korea Republic": "Corée du Sud",
    "Germany": "Allemagne", "France": "France", "Sweden": "Suède",
    "Brazil": "Brésil", "Egypt": "Égypte", "India": "Inde",
    "USA": "États-Unis", "United States": "États-Unis", "Australia": "Australie",
    "Chinese Taipei": "Taipei", "Hong Kong, China": "Hong Kong",
    "Singapore": "Singapour", "Portugal": "Portugal", "Poland": "Pologne",
    "Romania": "Roumanie", "Slovenia": "Slovénie", "Denmark": "Danemark",
    "Croatia": "Croatie", "Czech Republic": "Tchéquie", "Czechia": "Tchéquie",
    "Kazakhstan": "Kazakhstan", "Nigeria": "Nigeria", "Belgium": "Belgique",
    "Argentina": "Argentine", "Chile": "Chili", "Moldova": "Moldavie",
    "Hungary": "Hongrie", "Luxembourg": "Luxembourg", "Cameroon": "Cameroun",
    "Iran": "Iran", "Russia": "Russie", "Ukraine": "Ukraine",
    "Austria": "Autriche", "Spain": "Espagne", "England": "Angleterre",
    "Wales": "Pays de Galles", "Puerto Rico": "Porto Rico",
    "Macao, China": "Macao", "Macao": "Macao", "Monaco": "Monaco",
    "Netherlands": "Pays-Bas", "Serbia": "Serbie", "Thailand": "Thaïlande",
    "Italy": "Italie", "Turkey": "Turquie", "Türkiye": "Turquie",
    "Canada": "Canada", "Algeria": "Algérie",
    "Slovak Republic": "Slovaquie", "Slovakia": "Slovaquie",
    "AIN": "Neutre",
}

def translate_country(pays_raw):
    return PAYS_FR.get(pays_raw.strip(), pays_raw.strip()) if pays_raw else ""

# ─── Récupération des classements ─────────────────────────────────────────────

WTT_API_URL = "https://wtt-web-frontdoor-withoutcache-cqakg0andqf5hchn.a01.azurefd.net/ranking/SEN_SINGLES.json"

def fetch_rankings_wtt(genre="H"):
    """
    Appel direct à l'API WTT interne.
    Renvoie 100 joueurs (SubEventCode='MS' pour H, 'WS' pour F).
    """
    sub_event = "MS" if genre == "H" else "WS"
    label = "Hommes" if genre == "H" else "Femmes"
    try:
        r = requests.get(WTT_API_URL, headers=HEADERS, timeout=20)
        if r.status_code != 200:
            print(f"  ⚠️  [{label}] WTT API HTTP {r.status_code}")
            return []
        all_players = r.json().get("Result", [])
        players = []
        for p in all_players:
            if p.get("SubEventCode") != sub_event:
                continue
            rang = p.get("RankingPosition") or p.get("CurrentRank")
            nom  = (p.get("PlayerName") or "").strip()
            pays = (p.get("CountryName") or "").strip()
            if rang and nom:
                players.append({"rang": int(rang), "nom": nom, "pays": pays})
        players.sort(key=lambda x: x["rang"])
        print(f"  ✅ [{label}] WTT API : {len(players)} joueurs")
        return players
    except Exception as e:
        print(f"  ⚠️  [{label}] WTT API échouée : {e}")
        return []

def fetch_rankings_html(genre="H"):
    """Fallback : scraping HTML results.ittf.link (top 50 seulement)."""
    label = "Hommes" if genre == "H" else "Femmes"
    url = (
        "https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-men-singles"
        if genre == "H" else
        "https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-women-singles"
    )
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code != 200:
            return []
        soup = BeautifulSoup(r.text, "html.parser")
        players = []
        for table in soup.find_all("table"):
            for row in table.find_all("tr"):
                cells = [td.get_text(strip=True) for td in row.find_all("td")]
                if len(cells) < 7:
                    continue
                try:
                    rang = int(cells[0])
                    nom  = cells[4]
                    pays = cells[6]
                    if 1 <= rang <= 200 and nom:
                        players.append({"rang": rang, "nom": nom, "pays": pays})
                except (ValueError, IndexError):
                    pass
        players.sort(key=lambda x: x["rang"])
        if players:
            print(f"  ✅ [{label}] HTML fallback : {len(players)} joueurs")
        return players
    except Exception as e:
        print(f"  ⚠️  [{label}] HTML fallback échoué : {e}")
        return []

def fetch_rankings(genre="H"):
    """Essaie l'API WTT, puis le scraping HTML en fallback."""
    r = fetch_rankings_wtt(genre)
    if len(r) >= 80:
        return r
    print(f"  ℹ️  API insuffisante ({len(r)} joueurs), essai HTML fallback…")
    r2 = fetch_rankings_html(genre)
    # Garder le meilleur résultat
    return r if len(r) >= len(r2) else r2

# ─── Correspondance de noms ───────────────────────────────────────────────────

import re

def normalize(name):
    name = name.upper().strip()
    name = re.sub(r"[ÀÁÂÃÄ]", "A", name)
    name = re.sub(r"[ÈÉÊË]", "E", name)
    name = re.sub(r"[ÌÍÎÏ]", "I", name)
    name = re.sub(r"[ÒÓÔÕÖ]", "O", name)
    name = re.sub(r"[ÙÚÛÜ]", "U", name)
    name = re.sub(r"[^A-Z0-9 ]", "", name)
    return re.sub(r"\s+", " ", name).strip()

def match_joueur(joueurs_db, nom_ranking):
    nom_n = normalize(nom_ranking)
    tokens = set(nom_n.split())
    best, best_score = None, 0
    for j in joueurs_db:
        j_n = normalize(j["nom"])
        if nom_n == j_n:
            return j
        j_tokens = set(j_n.split())
        commun = tokens & j_tokens
        if not commun:
            continue
        score = len(commun) / max(len(tokens), len(j_tokens))
        if score > best_score and score >= 0.6:
            best_score = score
            best = j
    return best

# ─── Mise à jour ──────────────────────────────────────────────────────────────

def run():
    print("\n" + "=" * 60)
    print("  Mise à jour classement WTT — TT-Kip")
    print("=" * 60)

    res = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial").eq("actif", True).execute()
    joueurs_db = res.data or []

    if not joueurs_db:
        print("❌  Aucun joueur en base.")
        sys.exit(1)

    print(f"\n  {len(joueurs_db)} joueurs actifs en base")
    hommes_db = [j for j in joueurs_db if j.get("genre") == "H"]
    femmes_db = [j for j in joueurs_db if j.get("genre") == "F"]

    total_updated = total_inserted = total_archived = 0

    for genre, label, pool in [("H", "Hommes", hommes_db), ("F", "Femmes", femmes_db)]:
        print(f"\n  ── {label} ({len(pool)} en base) ──")
        rankings = fetch_rankings(genre)
        if not rankings:
            print(f"  ⚠️  Pas de données — {label} ignorés.")
            continue

        top100 = [r for r in rankings if r["rang"] <= 100]
        safe_to_archive = len(top100) >= 80
        if not safe_to_archive:
            print(f"  ⚠️  Seulement {len(top100)} joueurs reçus (<80) — archivage désactivé.")

        matched_db_ids = set()
        updated = inserted = archived = 0

        for entry in top100:
            rang = entry["rang"]
            nom  = entry["nom"]
            pays = translate_country(entry.get("pays", ""))
            joueur = match_joueur(pool, nom)

            if joueur:
                matched_db_ids.add(joueur["id"])
                if joueur.get("classement_mondial") != rang:
                    ancien = joueur.get("classement_mondial") or "N/A"
                    sb.table("joueurs_pro").update({"classement_mondial": rang}).eq("id", joueur["id"]).execute()
                    diff = (joueur.get("classement_mondial") or rang) - rang
                    sign = "+" if diff > 0 else ""
                    print(f"  ↕️   #{rang} {joueur['nom']} ({sign}{diff})  était #{ancien}")
                    updated += 1
                    time.sleep(0.03)
            else:
                sb.table("joueurs_pro").insert({
                    "nom": nom, "pays": pays,
                    "classement_mondial": rang,
                    "genre": genre, "actif": True,
                }).execute()
                print(f"  ➕  Nouveau #{rang} : {nom} ({pays})")
                inserted += 1
                time.sleep(0.05)

        if safe_to_archive:
            for joueur in pool:
                if joueur["id"] not in matched_db_ids:
                    sb.table("joueurs_pro").update({"actif": False}).eq("id", joueur["id"]).execute()
                    print(f"  📦  Archivé : {joueur['nom']} (était #{joueur.get('classement_mondial')})")
                    archived += 1
                    time.sleep(0.03)

        print(f"     {updated} mis à jour · {inserted} insérés · {archived} archivés")
        total_updated  += updated
        total_inserted += inserted
        total_archived += archived

    print(f"\n  Total : {total_updated} mis à jour · {total_inserted} insérés · {total_archived} archivés\n")

if __name__ == "__main__":
    run()
