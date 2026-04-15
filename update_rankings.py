"""
update_rankings.py — Mise à jour automatique du classement mondial ITTF/WTT
===========================================================================
Met à jour UNIQUEMENT le champ classement_mondial dans joueurs_pro.
Ne touche pas au matériel, style, âge ou tout autre donnée.

Stratégie :
  1. Tente de récupérer les classements depuis l'API WTT
  2. Fallback sur le scraping de la page ITTF
  3. Met à jour la base par correspondance de nom (insensible à la casse)

Lancement manuel :
    SUPABASE_URL=... SUPABASE_KEY=... python3 update_rankings.py

En production : exécuté automatiquement chaque mardi à 12h via GitHub Actions.
"""

import os, sys, re, time
import urllib.request
import urllib.error
import json

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

# ─── Helpers HTTP (sans dépendances externes) ─────────────────────────────────

def http_get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    req.add_header("User-Agent", "TT-Kip Rankings Bot/1.0")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8")
    except Exception as e:
        return None

def supabase_select(table, select="*", filters=None):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if filters:
        url += "&" + "&".join(f"{k}=eq.{v}" for k, v in filters.items())
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }
    data = http_get(url, headers)
    return json.loads(data) if data else []

def supabase_update(table, row_id, payload):
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{row_id}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header("apikey", SUPABASE_KEY)
    req.add_header("Authorization", f"Bearer {SUPABASE_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Prefer", "return=minimal")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status in (200, 204)
    except Exception as e:
        print(f"    Erreur update: {e}")
        return False

# ─── Récupération du classement WTT ──────────────────────────────────────────

def fetch_wtt_rankings(genre="H"):
    """
    Essaie de récupérer le classement WTT via leur API publique.
    Retourne une liste de dict {rang, nom, pays}
    """
    tab = "MEN'S SINGLES" if genre == "H" else "WOMEN'S SINGLES"
    tab_encoded = tab.replace("'", "%27").replace(" ", "+")

    # Tentative 1 : API JSON WTT
    endpoints = [
        f"https://www.worldtabletennis.com/api/v1/rankings?ageGroup=SENIOR&tab={tab_encoded}",
        f"https://ranking.ittf.com/api/rankings?category=MS" if genre == "H" else
        f"https://ranking.ittf.com/api/rankings?category=WS",
    ]

    for endpoint in endpoints:
        raw = http_get(endpoint)
        if raw:
            try:
                data = json.loads(raw)
                # Normaliser selon la structure retournée
                if isinstance(data, list) and len(data) > 0:
                    result = []
                    for item in data[:100]:
                        rang = item.get("rank") or item.get("position") or item.get("ranking")
                        nom = item.get("name") or item.get("playerName") or item.get("fullName")
                        pays = item.get("country") or item.get("nationality") or item.get("association")
                        if rang and nom:
                            result.append({"rang": int(rang), "nom": nom, "pays": pays or ""})
                    if result:
                        print(f"  ✅ API WTT/ITTF : {len(result)} joueurs récupérés")
                        return result
            except Exception:
                pass

    # Tentative 2 : scraping page HTML ITTF
    pages = [
        ("https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-men-singles" if genre == "H"
         else "https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-women-singles"),
    ]
    for page_url in pages:
        html = http_get(page_url)
        if html:
            # Chercher pattern : rang + nom dans le HTML
            # Pattern typique : <td>1</td><td>WANG Chuqin</td><td>CHN</td>
            rows = re.findall(r'<tr[^>]*>.*?</tr>', html, re.DOTALL)
            result = []
            for row in rows:
                cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
                cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
                cells = [c for c in cells if c]
                if len(cells) >= 2:
                    try:
                        rang = int(cells[0])
                        nom = cells[1] if len(cells) > 1 else ""
                        pays = cells[2] if len(cells) > 2 else ""
                        if 1 <= rang <= 200 and nom:
                            result.append({"rang": rang, "nom": nom, "pays": pays})
                    except ValueError:
                        pass
            if result:
                print(f"  ✅ Scraping HTML : {len(result)} joueurs récupérés")
                return result

    print("  ⚠️  Impossible de récupérer le classement en ligne.")
    return []

# ─── Normalisation des noms ───────────────────────────────────────────────────

def normalize_name(name):
    """Normalise un nom pour la comparaison."""
    name = name.upper().strip()
    # Supprimer les caractères spéciaux
    name = re.sub(r'[^\w\s]', '', name)
    # Normaliser les espaces multiples
    name = re.sub(r'\s+', ' ', name)
    return name

def find_joueur(joueurs_db, nom_ranking):
    """
    Trouve le joueur en DB correspondant au nom du classement.
    Stratégies :
      1. Correspondance exacte normalisée
      2. Tous les tokens du nom ranking sont dans le nom DB
      3. Correspondance partielle (au moins 80% des tokens)
    """
    nom_norm = normalize_name(nom_ranking)
    tokens_ranking = set(nom_norm.split())

    best_match = None
    best_score = 0

    for j in joueurs_db:
        j_norm = normalize_name(j["nom"])
        tokens_db = set(j_norm.split())

        # Correspondance exacte
        if nom_norm == j_norm:
            return j

        # Tokens communs
        commun = tokens_ranking & tokens_db
        if not commun:
            continue

        score = len(commun) / max(len(tokens_ranking), len(tokens_db))
        if score > best_score and score >= 0.6:
            best_score = score
            best_match = j

    return best_match

# ─── Mise à jour principale ───────────────────────────────────────────────────

def update_rankings():
    print("\n" + "=" * 60)
    print("  Mise à jour classement ITTF/WTT — TT-Kip")
    print("=" * 60)

    # Récupérer tous les joueurs en DB (actifs)
    joueurs_db = supabase_select("joueurs_pro", "id,nom,genre,classement_mondial", {"actif": "true"})
    if not joueurs_db:
        print("❌  Impossible de charger les joueurs depuis la DB.")
        sys.exit(1)
    print(f"\n  {len(joueurs_db)} joueurs actifs en base")

    hommes_db = [j for j in joueurs_db if j.get("genre") == "H"]
    femmes_db = [j for j in joueurs_db if j.get("genre") == "F"]

    total_updated = 0
    total_not_found = 0

    for genre, label, joueurs_genre in [("H", "Hommes", hommes_db), ("F", "Femmes", femmes_db)]:
        print(f"\n  ── Classement {label} ──")
        rankings = fetch_wtt_rankings(genre)

        if not rankings:
            print(f"  ⚠️  Pas de données pour {label}, on passe.")
            continue

        updated = 0
        not_found = 0

        for entry in rankings:
            rang = entry["rang"]
            nom = entry["nom"]

            joueur = find_joueur(joueurs_genre, nom)
            if not joueur:
                print(f"  ? Non trouvé : #{rang} {nom}")
                not_found += 1
                continue

            ancien = joueur.get("classement_mondial")
            if ancien == rang:
                continue  # Pas de changement

            ok = supabase_update("joueurs_pro", joueur["id"], {"classement_mondial": rang})
            if ok:
                evolution = ""
                if ancien:
                    diff = ancien - rang
                    evolution = f" ({"+" if diff > 0 else ""}{diff})" if diff != 0 else " (=)"
                print(f"  ✅ #{rang} {joueur['nom']}{evolution}")
                updated += 1
            else:
                print(f"  ❌ Erreur update : {joueur['nom']}")

            time.sleep(0.05)  # éviter le rate limiting

        print(f"     {updated} mis à jour, {not_found} non trouvés")
        total_updated += updated
        total_not_found += not_found

    print(f"\n{'=' * 60}")
    print(f"  Total : {total_updated} classements mis à jour, {total_not_found} joueurs non trouvés")
    print(f"{'=' * 60}\n")

if __name__ == "__main__":
    update_rankings()
