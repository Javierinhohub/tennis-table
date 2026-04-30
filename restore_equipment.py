"""
restore_equipment.py — Restauration des équipements depuis equipment_backup.json
=================================================================================
Lit le fichier JSON de backup et réécrit les champs équipement dans Supabase,
EN NE TOUCHANT PAS aux champs classement_mondial / actif / pays.

Le matching se fait par ID Supabase (priorité) puis par nom normalisé (fallback).

Lancement :
    SUPABASE_URL=... SUPABASE_KEY=... python3 restore_equipment.py

Options :
    --dry-run   Affiche ce qui serait restauré sans écrire en base
    --force     Écrase les champs équipement même s'ils sont déjà renseignés
"""

import os, sys, json, re, time
import argparse
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

BACKUP_FILE = "equipment_backup.json"

EQUIPMENT_FIELDS = [
    "style", "main", "age", "prise",
    "bois_nom", "revetement_cd", "revetement_cd_type",
    "revetement_rv", "revetement_rv_type",
]

def normalize(s):
    s = (s or "").upper().strip()
    s = re.sub(r"[ÀÁÂÃÄ]", "A", s)
    s = re.sub(r"[ÈÉÊË]", "E", s)
    s = re.sub(r"[ÌÍÎÏ]", "I", s)
    s = re.sub(r"[ÒÓÔÕÖ]", "O", s)
    s = re.sub(r"[ÙÚÛÜ]", "U", s)
    s = re.sub(r"[^A-Z0-9 ]", "", s)
    return re.sub(r"\s+", " ", s).strip()

def run(dry_run=False, force=False):
    print("\n" + "=" * 60)
    print("  Restauration équipements — TT-Kip")
    print("  " + ("DRY RUN — aucune écriture" if dry_run else "MODE RÉEL"))
    print("=" * 60)

    if not os.path.exists(BACKUP_FILE):
        print(f"❌  Fichier {BACKUP_FILE} introuvable.")
        sys.exit(1)

    with open(BACKUP_FILE) as f:
        backup = json.load(f)

    print(f"  {len(backup)} entrées dans le backup")

    # Charger tous les joueurs actuels
    res_h = sb.table("joueurs_pro").select("id, nom, genre, bois_nom, revetement_cd").eq("genre", "H").limit(500).execute()
    res_f = sb.table("joueurs_pro").select("id, nom, genre, bois_nom, revetement_cd").eq("genre", "F").limit(500).execute()
    joueurs_db = (res_h.data or []) + (res_f.data or [])

    # Index par ID et par nom normalisé
    by_id   = {j["id"]: j for j in joueurs_db}
    by_nom  = {normalize(j["nom"]): j for j in joueurs_db}

    restored = skipped = not_found = 0

    for entry in backup:
        # Vérifier s'il y a un équipement à restaurer
        has_equip = any(entry.get(f) for f in EQUIPMENT_FIELDS)
        if not has_equip:
            continue

        # Trouver le joueur en base
        joueur = by_id.get(entry.get("id"))
        if not joueur:
            joueur = by_nom.get(normalize(entry.get("nom", "")))

        if not joueur:
            print(f"  ⚠️  Introuvable : {entry.get('nom')} (ID: {entry.get('id')})")
            not_found += 1
            continue

        # En mode non-force : ne restaurer que si bois_nom est null
        if not force and joueur.get("bois_nom"):
            skipped += 1
            continue

        payload = {f: entry.get(f) for f in EQUIPMENT_FIELDS if entry.get(f) is not None}
        if not payload:
            continue

        if dry_run:
            print(f"  [DRY] {joueur['nom']} → {payload.get('bois_nom','?')} | {payload.get('revetement_cd','?')} | {payload.get('revetement_rv','?')}")
        else:
            sb.table("joueurs_pro").update(payload).eq("id", joueur["id"]).execute()
            print(f"  ✅  {joueur['nom']} → {payload.get('bois_nom','?')} | {payload.get('revetement_cd','?')}")
            time.sleep(0.05)

        restored += 1

    print(f"\n  {restored} restaurés · {skipped} ignorés (déjà renseignés) · {not_found} introuvables\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run, force=args.force)
