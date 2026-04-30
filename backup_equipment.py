"""
backup_equipment.py — Sauvegarde des équipements joueurs dans equipment_backup.json
====================================================================================
Exporte depuis Supabase tous les champs non-classement de joueurs_pro
vers un fichier JSON versionné dans le repo Git.

Lancement manuel :
    SUPABASE_URL=... SUPABASE_KEY=... python3 backup_equipment.py

Automatique : chaque mardi via GitHub Actions (après la mise à jour classement).
"""

import os, sys, json
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

BACKUP_FILE = "equipment_backup.json"

EQUIPMENT_FIELDS = [
    "id", "nom", "genre",
    "style", "main", "age", "prise",
    "bois_nom", "revetement_cd", "revetement_cd_type",
    "revetement_rv", "revetement_rv_type",
]

def run():
    print("\n" + "=" * 60)
    print("  Backup équipements — TT-Kip")
    print("=" * 60)

    # Récupérer TOUS les joueurs (actifs et archivés) en deux requêtes
    # pour éviter la limite Supabase de 1000 lignes
    res_h = sb.table("joueurs_pro").select(", ".join(EQUIPMENT_FIELDS)).eq("genre", "H").limit(500).execute()
    res_f = sb.table("joueurs_pro").select(", ".join(EQUIPMENT_FIELDS)).eq("genre", "F").limit(500).execute()

    joueurs = (res_h.data or []) + (res_f.data or [])

    if not joueurs:
        print("❌  Aucun joueur trouvé.")
        sys.exit(1)

    # Ne conserver que les joueurs ayant au moins un champ équipement renseigné
    avec_equip = [
        j for j in joueurs
        if any(j.get(f) for f in EQUIPMENT_FIELDS if f not in ("id", "nom", "genre"))
    ]

    print(f"  {len(joueurs)} joueurs en base, {len(avec_equip)} avec équipement renseigné")

    # Charger le backup existant pour merge (conserver les données de joueurs supprimés)
    existing = {}
    if os.path.exists(BACKUP_FILE):
        with open(BACKUP_FILE) as f:
            try:
                existing = {entry["id"]: entry for entry in json.load(f)}
            except Exception:
                existing = {}

    # Merge : mettre à jour les entrées existantes, ajouter les nouvelles
    for j in joueurs:
        jid = j["id"]
        if jid in existing:
            # Mettre à jour uniquement les champs non-null (ne pas écraser avec null)
            for field in EQUIPMENT_FIELDS:
                if j.get(field) is not None:
                    existing[jid][field] = j[field]
        else:
            existing[jid] = j

    result = sorted(existing.values(), key=lambda x: (x.get("genre", ""), x.get("nom", "")))

    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Backup sauvegardé : {BACKUP_FILE} ({len(result)} entrées)")
    print(f"     Dont {len(avec_equip)} avec équipement renseigné\n")

if __name__ == "__main__":
    run()
