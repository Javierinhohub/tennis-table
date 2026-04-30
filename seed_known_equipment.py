"""
seed_known_equipment.py — Données équipements connues pour les top joueurs
==========================================================================
Pré-remplit les équipements des joueurs bien connus depuis une base de données
intégrée (mise à jour manuelle). Ne touche QUE les joueurs avec bois_nom NULL
sauf si --force est passé.

Lancement :
    SUPABASE_URL=... SUPABASE_KEY=... python3 seed_known_equipment.py
    SUPABASE_URL=... SUPABASE_KEY=... python3 seed_known_equipment.py --dry-run
    SUPABASE_URL=... SUPABASE_KEY=... python3 seed_known_equipment.py --force
"""

import os, sys, re, time, argparse
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Base de données équipements (source : ITTF / WTT / presse spécialisée) ──
# Format : "Nom joueur": { "bois_nom", "revetement_cd", "revetement_cd_type",
#                          "revetement_rv", "revetement_rv_type",
#                          "style", "main", "prise" }

KNOWN_EQUIPMENT = {

    # ── Hommes ─────────────────────────────────────────────────────────────────

    "Fan Zhendong": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Wang Chuqin": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Dignics 09C",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Ma Long": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Lin Gaoyuan": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Truls Moregard": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Dignics 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Gaucher", "prise": "Classique",
    },
    "Liang Jingkun": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Tomokazu Harimoto": {
        "bois_nom": "Butterfly Harimoto Tomokazu Inner Force ZLC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Dignics 80",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Felix Lebrun": {
        "bois_nom": "Butterfly Harimoto Tomokazu Inner Force ZLC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Dignics 09C",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Gaucher", "prise": "Classique",
    },
    "Alexis Lebrun": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Tenergy 05-FX",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05-FX",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Hugo Calderano": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05-FX",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Dang Qiu": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Timo Boll": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Tout-jeu", "main": "Gaucher", "prise": "Classique",
    },
    "Xu Xin": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Gaucher", "prise": "Classique",
    },
    "Darko Jorgic": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Qiu Dang": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Lin Yun-Ju": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05-FX",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Mattias Falck": {
        "bois_nom": "Stiga Clipper CR WRB",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Simon Gauzy": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Patrick Franziska": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Dimitrij Ovtcharov": {
        "bois_nom": "Butterfly Dimitrij Ovtcharov Inner Force ZLC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Dignics 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Wong Chun Ting": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Koki Niwa": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05-FX",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Benedikt Duda": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Joao Monteiro": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Défenseur", "main": "Droitier", "prise": "Classique",
    },

    # ── Femmes ─────────────────────────────────────────────────────────────────

    "Sun Yingsha": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Chen Meng": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Wang Manyu": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Mima Ito": {
        "bois_nom": "Butterfly Ito Mima ZLC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Rozena",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Hina Hayata": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Wang Yidi": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Chen Xingtong": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Qian Tianyi": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Bernadette Szocs": {
        "bois_nom": "Tibhar Stratus Power Wood",
        "revetement_cd": "Tibhar Evolution MX-P",
        "revetement_cd_type": "In",
        "revetement_rv": "Tibhar Evolution MX-P",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Xiaona Shan": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Gaucher", "prise": "Classique",
    },
    "Sofia Polcanova": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Miyu Kihara": {
        "bois_nom": "Butterfly Viscaria",
        "revetement_cd": "Butterfly Dignics 09C",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Sabine Winter": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
    "Nina Mittelham": {
        "bois_nom": "Butterfly Timo Boll ALC",
        "revetement_cd": "Butterfly Tenergy 05",
        "revetement_cd_type": "In",
        "revetement_rv": "Butterfly Tenergy 05",
        "revetement_rv_type": "In",
        "style": "Tout-jeu", "main": "Droitier", "prise": "Classique",
    },
    "Joo Yubin": {
        "bois_nom": "DHS Hurricane Long 5X",
        "revetement_cd": "DHS Hurricane 3 National",
        "revetement_cd_type": "In",
        "revetement_rv": "DHS Hurricane 3 National",
        "revetement_rv_type": "In",
        "style": "Attaquant", "main": "Droitier", "prise": "Classique",
    },
}

# ─── Normalisation pour matching flexible ─────────────────────────────────────

def normalize(s):
    s = (s or "").upper().strip()
    s = re.sub(r"[ÀÁÂÃÄÅÆ]", "A", s)
    s = re.sub(r"[ÈÉÊËĘ]", "E", s)
    s = re.sub(r"[ÌÍÎÏI]", "I", s)
    s = re.sub(r"[ÒÓÔÕÖØ]", "O", s)
    s = re.sub(r"[ÙÚÛÜU]", "U", s)
    s = re.sub(r"[ÝY]", "Y", s)
    s = re.sub(r"[ÑN]", "N", s)
    s = re.sub(r"[^A-Z0-9 \-]", "", s)
    return re.sub(r"\s+", " ", s).strip()

def fuzzy_match(db_name, known_names):
    """Trouve le meilleur match dans les noms connus."""
    db_n = normalize(db_name)
    db_tokens = set(db_n.split())

    best, best_score = None, 0
    for kn in known_names:
        kn_n = normalize(kn)
        if db_n == kn_n:
            return kn  # Match exact
        kn_tokens = set(kn_n.split())
        commun = db_tokens & kn_tokens
        if not commun:
            continue
        score = len(commun) / max(len(db_tokens), len(kn_tokens))
        if score >= 0.6 and score > best_score:
            best_score = score
            best = kn

    return best

# ─── Main ─────────────────────────────────────────────────────────────────────

def run(dry_run=False, force=False):
    print("\n" + "=" * 60)
    print("  Seed équipements connus — TT-Kip")
    print("  " + ("DRY RUN" if dry_run else "MODE RÉEL"))
    print("=" * 60)

    # Charger tous les joueurs
    res_h = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial, bois_nom") \
        .eq("actif", True).eq("genre", "H").order("classement_mondial").limit(200).execute()
    res_f = sb.table("joueurs_pro").select("id, nom, genre, classement_mondial, bois_nom") \
        .eq("actif", True).eq("genre", "F").order("classement_mondial").limit(200).execute()

    joueurs = (res_h.data or []) + (res_f.data or [])
    known_names = list(KNOWN_EQUIPMENT.keys())

    updated = skipped = not_found = 0

    for j in joueurs:
        if not force and j.get("bois_nom"):
            skipped += 1
            continue

        match = fuzzy_match(j["nom"], known_names)
        if not match:
            not_found += 1
            continue

        payload = KNOWN_EQUIPMENT[match].copy()
        # Ne pas écraser genre/classement/pays
        for key in ["genre", "classement_mondial", "pays", "actif"]:
            payload.pop(key, None)

        if dry_run:
            print(f"  [DRY] #{j.get('classement_mondial'):>3} {j['nom']}")
            print(f"        → Bois: {payload.get('bois_nom')}")
            print(f"        → CD:   {payload.get('revetement_cd')} ({payload.get('revetement_cd_type')})")
            print(f"        → RV:   {payload.get('revetement_rv')} ({payload.get('revetement_rv_type')})")
        else:
            sb.table("joueurs_pro").update(payload).eq("id", j["id"]).execute()
            print(f"  ✅ #{j.get('classement_mondial'):>3} {j['nom']} → {payload.get('bois_nom')}")
            time.sleep(0.05)

        updated += 1

    print(f"\n  {updated} mis à jour · {skipped} ignorés (déjà renseignés) · {not_found} non trouvés")
    print(f"  ({len(KNOWN_EQUIPMENT)} joueurs dans la base de données intégrée)\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run, force=args.force)
