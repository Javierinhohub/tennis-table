"""
update_rankings.py — Mise à jour automatique du classement mondial ITTF/WTT
===========================================================================
Met à jour UNIQUEMENT le champ classement_mondial dans joueurs_pro.
Ne touche pas au matériel, style, âge ou tout autre donnée.

Dépendances : pip install supabase requests beautifulsoup4

Lancement manuel :
    SUPABASE_URL=... SUPABASE_KEY=... python3 update_rankings.py

Automatique : chaque mardi à 12h via GitHub Actions.
"""

import os, sys, re, time
import requests
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; TT-Kip Rankings Bot/1.0)",
    "Accept": "application/json, text/html, */*",
}

# ─── Récupération du classement ───────────────────────────────────────────────

def fetch_rankings_wtt(genre="H"):
    """Tente l'API WTT (JSON)."""
    tab = "MEN'S+SINGLES" if genre == "H" else "WOMEN'S+SINGLES"
    urls = [
        f"https://www.worldtabletennis.com/allplayersranking?Age=SENIOR&selectedTab={tab}",
        f"https://ranking.ittf.com/api/v1/ranking?type={'ms' if genre == 'H' else 'ws'}&limit=200",
    ]
    for url in urls:
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200:
                data = r.json()
                result = parse_json_rankings(data)
                if result:
                    print(f"  ✅ API JSON ({url[:50]}…) : {len(result)} joueurs")
                    return result
        except Exception:
            pass
    return []

def parse_json_rankings(data):
    """Normalise différentes structures JSON de classement."""
    result = []
    items = data if isinstance(data, list) else data.get("data") or data.get("results") or data.get("rankings") or []
    for item in items[:200]:
        rang = (item.get("rank") or item.get("position") or item.get("ranking") or
                item.get("worldRanking") or item.get("world_ranking"))
        nom  = (item.get("name") or item.get("playerName") or item.get("fullName") or
                item.get("player_name") or
                f"{item.get('lastName', '')} {item.get('firstName', '')}".strip())
        pays = (item.get("country") or item.get("nationality") or item.get("association") or
                item.get("countryCode") or "")
        if rang and nom and str(rang).isdigit():
            result.append({"rang": int(rang), "nom": nom.strip(), "pays": pays.strip()})
    return sorted(result, key=lambda x: x["rang"])

def fetch_rankings_html(genre="H"):
    """Scrape la page ITTF en HTML."""
    url = (
        "https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-men-singles"
        if genre == "H" else
        "https://results.ittf.link/index.php/ittf-rankings/ittf-ranking-women-singles"
    )
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code != 200:
            return []
        html = r.text
        # Chercher les lignes de tableau
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        result = []
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells if c.strip()]
            if len(cells) >= 2:
                try:
                    rang = int(cells[0])
                    nom  = cells[1]
                    pays = cells[2] if len(cells) > 2 else ""
                    if 1 <= rang <= 500 and nom:
                        result.append({"rang": rang, "nom": nom, "pays": pays})
                except ValueError:
                    pass
        if result:
            print(f"  ✅ Scraping HTML ITTF : {len(result)} joueurs")
        return result
    except Exception as e:
        print(f"  ⚠️  Scraping HTML échoué : {e}")
        return []

def fetch_rankings(genre="H"):
    """Essaie WTT API, puis scraping HTML."""
    r = fetch_rankings_wtt(genre)
    if r:
        return r
    r = fetch_rankings_html(genre)
    if r:
        return r
    print(f"  ⚠️  Aucune source disponible pour les {'hommes' if genre == 'H' else 'femmes'}.")
    return []

# ─── Correspondance de noms ───────────────────────────────────────────────────

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
    print("  Mise à jour classement ITTF/WTT — TT-Kip")
    print("=" * 60)

    res = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial").eq("actif", True).execute()
    joueurs_db = res.data or []

    if not joueurs_db:
        print("❌  Aucun joueur trouvé en base.")
        sys.exit(1)

    print(f"\n  {len(joueurs_db)} joueurs actifs en base")
    hommes = [j for j in joueurs_db if j.get("genre") == "H"]
    femmes = [j for j in joueurs_db if j.get("genre") == "F"]

    total_updated = 0

    for genre, label, pool in [("H", "Hommes", hommes), ("F", "Femmes", femmes)]:
        print(f"\n  ── {label} ({len(pool)} en base) ──")
        rankings = fetch_rankings(genre)
        if not rankings:
            continue

        updated = 0
        for entry in rankings:
            rang, nom = entry["rang"], entry["nom"]
            joueur = match_joueur(pool, nom)
            if not joueur:
                continue
            if joueur.get("classement_mondial") == rang:
                continue

            ancien = joueur.get("classement_mondial") or "—"
            sb.table("joueurs_pro").update({"classement_mondial": rang}).eq("id", joueur["id"]).execute()
            diff = (joueur.get("classement_mondial") or rang) - rang
            sign = "+" if diff > 0 else ""
            evo = f" ({sign}{diff})" if diff != 0 else " (=)"
            print(f"  OK  #{rang} {joueur['nom']}{evo}  (etait {ancien})")
            updated += 1
            time.sleep(0.03)

        print(f"     {updated} classements mis à jour")
        total_updated += updated

    print(f"\n  Total : {total_updated} mis à jour\n")

if __name__ == "__main__":
    run()
