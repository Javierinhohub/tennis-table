"""
update_type_milongs.py — Passe une liste de revêtements en type "Out" (picots mi-longs)
et supprime les doublons.

Lancement :
    SUPABASE_URL=... SUPABASE_KEY=... python3 update_type_milongs.py
"""
import os, sys, re
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Liste des noms à chercher (nettoyés) ────────────────────────────────────
NOMS = [
    # Dawei / 388
    "388 C-1",
    "388 C-1 Color",
    "388 C-3",
    "Dawei 388",
    # Der Materialspezialist
    "Wildfire",
    "Turbulent",
    "Flashback",
    "Power Pipes",
    "Hellcat",
    "Shockwave",
    # Nittaku
    "Do Knuckle",
    # Spinlord
    "Keiler",
    "Keiler 2",
    "Keiler II",
    "Minotaur",
    "Minautor",
    "Orkan",
    "Orkan 2",
    "Orkan II",
    # Dr Neubauer
    "K.O. Extreme",
    "KO Extreme",
    "K.O. Pro",
    "KO Pro",
    "Aggressor",
    "Aggressor Evo",
    "Aggressor Pro",
    "Diamant",
    "Dr Neubauer KO",
    # Barna
    "Half Long",
    # Sauer
    "Hipster",
    # Lion
    "Lion Rebirth",
    # Armstrong
    "Attack 3",
    "Armstrong Rosin",
    # Hallmark
    "Panther",
    # Kokutaku
    "Kokutaku 110",
    "110 Chinese",
    # Globe
    "Globe 888",
    "888",
    # Friendship
    "Friendship 563",
    "563-1",
    "563 Mystery",
    "563 SP Legend",
    "563 Legend",
]

def normalize(s):
    return re.sub(r'\s+', ' ', s.strip().lower())

def main():
    print("\n" + "=" * 60)
    print("  Mise à jour type → Out (picots mi-longs)")
    print("=" * 60 + "\n")

    # Charger tous les produits avec revêtement
    res = sb.table("produits").select("id, nom, slug").eq("actif", True).limit(5000).execute()
    tous = res.data or []

    # Chercher les correspondances
    a_traiter = []
    for nom_recherche in NOMS:
        norm = normalize(nom_recherche)
        matches = [p for p in tous if norm in normalize(p["nom"])]
        for p in matches:
            if not any(x["id"] == p["id"] for x in a_traiter):
                a_traiter.append(p)

    if not a_traiter:
        print("  Aucun produit trouvé.\n")
        return

    print(f"  {len(a_traiter)} produit(s) trouvé(s) :\n")
    for p in sorted(a_traiter, key=lambda x: x["nom"]):
        print(f"    • {p['nom']}")

    # ── Supprimer les doublons ────────────────────────────────────────────────
    print("\n  Recherche de doublons...")
    noms_vus: dict[str, str] = {}  # nom_normalisé → premier id
    doublons: list[str] = []       # ids à supprimer

    for p in sorted(a_traiter, key=lambda x: x["id"]):
        key = normalize(p["nom"])
        if key in noms_vus:
            doublons.append(p["id"])
            print(f"  Doublon : '{p['nom']}' (id {p['id']}) — suppression")
        else:
            noms_vus[key] = p["id"]

    for dup_id in doublons:
        # Supprimer d'abord le revêtement lié
        sb.table("revetements").delete().eq("produit_id", dup_id).execute()
        sb.table("produits").delete().eq("id", dup_id).execute()

    print(f"  {len(doublons)} doublon(s) supprimé(s)")

    # ── Passer en type "Out" ──────────────────────────────────────────────────
    print("\n  Mise à jour type → Out...")
    updated = 0
    ids_a_conserver = [p["id"] for p in a_traiter if p["id"] not in doublons]

    for pid in ids_a_conserver:
        sb.table("revetements").update({"type_revetement": "Mid"}).eq("produit_id", pid).execute()
        updated += 1

    print(f"\n  ✅  {updated} revêtement(s) passé(s) en picots mi-longs (Mid)")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
