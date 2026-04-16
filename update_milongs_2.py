"""
update_milongs_2.py — Passe une liste de revêtements supplémentaires en type "Mid" (picots mi-longs)
"""
import os, sys, re
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

NOMS = [
    "Keiler",
    "Gipfelsturm",
    "Keiler 2",
    "Keiler II",
    "Half Long",
    "P2V",
    "Minotaur",
    "Minautor",
    "Do Knuckle",
    "Orkan",
    "Orkan 2",
    "Orkan II",
    "Hipster",
    "Lion Rebirth",
    "Armstrong Rosin",
    "Kokutaku 110",
    "Globe 888",
    "388 C-1",
    "388 C1",
    "Hallmark Panther",
    "563",
    "Mystery",
]

def normalize(s):
    return re.sub(r'\s+', ' ', s.strip().lower())

def main():
    print("\n" + "=" * 60)
    print("  Mise à jour type → Mid (picots mi-longs) — lot 2")
    print("=" * 60 + "\n")

    res = sb.table("produits").select("id, nom").eq("actif", True).limit(5000).execute()
    tous = res.data or []

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

    # Supprimer doublons
    noms_vus: dict = {}
    doublons = []
    for p in sorted(a_traiter, key=lambda x: x["id"]):
        key = normalize(p["nom"])
        if key in noms_vus:
            doublons.append(p["id"])
            print(f"  Doublon supprimé : {p['nom']}")
        else:
            noms_vus[key] = p["id"]

    for dup_id in doublons:
        sb.table("revetements").delete().eq("produit_id", dup_id).execute()
        sb.table("produits").delete().eq("id", dup_id).execute()

    # Passer en Mid
    ids = [p["id"] for p in a_traiter if p["id"] not in doublons]
    updated = 0
    for pid in ids:
        sb.table("revetements").update({"type_revetement": "Mid"}).eq("produit_id", pid).execute()
        updated += 1

    print(f"\n  ✅  {updated} revêtement(s) passé(s) en picots mi-longs (Mid)")
    print(f"  🗑️   {len(doublons)} doublon(s) supprimé(s)")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
