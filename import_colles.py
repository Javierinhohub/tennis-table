"""
import_colles.py — Import des colles de tennis de table dans Supabase TT-Kip
=============================================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_colles.py
"""

import os, re, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ─── Liste complète des colles ────────────────────────────────────────────────
# Source : misterping.com, shop-ping.be, nes-sport.com, tennis2table.com forums

COLLES = [

    # ── BUTTERFLY ──────────────────────────────────────────────────────────
    {"marque": "Butterfly", "nom": "Free Chack"},
    {"marque": "Butterfly", "nom": "Free Chack II"},
    {"marque": "Butterfly", "nom": "Free Chack Pro"},
    {"marque": "Butterfly", "nom": "Free Chack Pro II"},
    {"marque": "Butterfly", "nom": "Chack"},
    {"marque": "Butterfly", "nom": "Chack II"},

    # ── DONIC ──────────────────────────────────────────────────────────────
    {"marque": "Donic", "nom": "Vario Clean"},
    {"marque": "Donic", "nom": "Blue Contact"},
    {"marque": "Donic", "nom": "Blue Contact 1000 ml"},
    {"marque": "Donic", "nom": "Contact Pro"},
    {"marque": "Donic", "nom": "Formula Pro"},
    {"marque": "Donic", "nom": "Vario"},

    # ── TIBHAR ─────────────────────────────────────────────────────────────
    {"marque": "Tibhar", "nom": "Power Clue"},
    {"marque": "Tibhar", "nom": "Power Glue"},
    {"marque": "Tibhar", "nom": "VS Top Glue"},

    # ── ANDRO ──────────────────────────────────────────────────────────────
    {"marque": "Andro", "nom": "Pro Glu"},
    {"marque": "Andro", "nom": "Turbo Fix"},
    {"marque": "Andro", "nom": "Turbo Fix 1L"},

    # ── GEWO ───────────────────────────────────────────────────────────────
    {"marque": "Gewo", "nom": "Hydrotec"},
    {"marque": "Gewo", "nom": "Hydrotec Speed"},
    {"marque": "Gewo", "nom": "Hydrotec 15"},
    {"marque": "Gewo", "nom": "Glue One"},

    # ── REVOLUTION (marque indépendante) ───────────────────────────────────
    {"marque": "Revolution", "nom": "N°3 Normal Viscosity"},
    {"marque": "Revolution", "nom": "N°3 Medium Viscosity"},
    {"marque": "Revolution", "nom": "N°3 High Viscosity"},

    # ── FALCO ──────────────────────────────────────────────────────────────
    {"marque": "Falco", "nom": "Optimum Premium Glue"},
    {"marque": "Falco", "nom": "Water Glue Optimum"},
    {"marque": "Falco", "nom": "Rapid"},
    {"marque": "Falco", "nom": "Tempo Booster"},
    {"marque": "Falco", "nom": "Tempo Booster Long"},
    {"marque": "Falco", "nom": "Tempo Booster Platinum"},

    # ── NITTAKU ────────────────────────────────────────────────────────────
    {"marque": "Nittaku", "nom": "Finezip"},
    {"marque": "Nittaku", "nom": "Finezip Pro"},
    {"marque": "Nittaku", "nom": "Nori Plus"},

    # ── YASAKA ─────────────────────────────────────────────────────────────
    {"marque": "Yasaka", "nom": "Norisuke-san"},
    {"marque": "Yasaka", "nom": "Mu Glue"},

    # ── JOOLA ──────────────────────────────────────────────────────────────
    {"marque": "Joola", "nom": "LEX Green"},
    {"marque": "Joola", "nom": "X-Glue"},
    {"marque": "Joola", "nom": "Aqua Glue"},

    # ── DHS ────────────────────────────────────────────────────────────────
    {"marque": "DHS", "nom": "Aqua N°15"},
    {"marque": "DHS", "nom": "N°15"},

    # ── VICTAS ─────────────────────────────────────────────────────────────
    {"marque": "Victas", "nom": "Bio Fix"},
    {"marque": "Victas", "nom": "Bio Fix Pro"},

    # ── STIGA ──────────────────────────────────────────────────────────────
    {"marque": "Stiga", "nom": "Tube Glue"},
    {"marque": "Stiga", "nom": "No-foul Glue"},

    # ── HAIFU ──────────────────────────────────────────────────────────────
    {"marque": "Haifu", "nom": "Seamoon"},
    {"marque": "Haifu", "nom": "Booster Seamoon"},

    # ── SPINLORD ───────────────────────────────────────────────────────────
    {"marque": "Spinlord", "nom": "Colle Water Based"},

    # ── IMPERIAL ───────────────────────────────────────────────────────────
    {"marque": "Imperial", "nom": "Rapide"},

    # ── NEOTTEC ────────────────────────────────────────────────────────────
    {"marque": "Neottec", "nom": "Glue"},
    {"marque": "Neottec", "nom": "Fix Pro"},

    # ── HALLMARK ───────────────────────────────────────────────────────────
    {"marque": "Hallmark", "nom": "Water Glue"},
    {"marque": "Hallmark", "nom": "Speed Glue"},

    # ── DER MATERIALSPEZIALIST ─────────────────────────────────────────────
    {"marque": "Der Materialspezialist", "nom": "Power Glue"},

    # ── DIANCHI ────────────────────────────────────────────────────────────
    {"marque": "Dianchi", "nom": "Booster Pro"},

    # ── CORNILLEAU ─────────────────────────────────────────────────────────
    {"marque": "Cornilleau", "nom": "Stick Fast"},
    {"marque": "Cornilleau", "nom": "Colle TT Mounting"},

    # ── XIOM ───────────────────────────────────────────────────────────────
    {"marque": "Xiom", "nom": "Glue"},
    {"marque": "Xiom", "nom": "Omega Glue"},

    # ── TSP ────────────────────────────────────────────────────────────────
    {"marque": "TSP", "nom": "Super Glue"},
    {"marque": "TSP", "nom": "Table Tennis Glue"},

    # ── SANWEI ─────────────────────────────────────────────────────────────
    {"marque": "Sanwei", "nom": "Water Based Glue"},

    # ── OSP ────────────────────────────────────────────────────────────────
    {"marque": "OSP", "nom": "Booster One"},
]

# ─── Utilitaires ─────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text)[:100]

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis")
        sys.exit(1)

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1. Charger les marques existantes
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map = {m["nom"].lower(): m["id"] for m in marques_res.data}
    print(f"📋 {len(marques_map)} marques en base")

    # 2. Chercher ou créer la sous-catégorie "Colles"
    subcats_res = sb.table("sous_categories").select("id, nom, slug").execute()
    subcat_colles = None
    for sc in subcats_res.data:
        if "colle" in sc["nom"].lower() or "colle" in sc.get("slug", "").lower():
            subcat_colles = sc["id"]
            print(f"✅ Sous-catégorie trouvée : {sc['nom']} ({sc['id']})")
            break

    if not subcat_colles:
        print("⚠️  Sous-catégorie 'Colles' non trouvée — création...")
        try:
            res = sb.table("sous_categories").insert({
                "nom": "Colles & Boosters",
                "slug": "colles-boosters"
            }).execute()
            subcat_colles = res.data[0]["id"]
            print(f"✅ Sous-catégorie créée : {subcat_colles}")
        except Exception as e:
            print(f"❌ Impossible de créer la sous-catégorie : {e}")
            print("   → Vérifiez votre table sous_categories et relancez")
            sys.exit(1)

    # 3. Slugs existants
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs = {r["slug"] for r in existing_res.data}
    print(f"📋 {len(existing_slugs)} produits existants\n")

    inserted = 0
    skipped = 0
    errors = []

    for colle in COLLES:
        marque_nom = colle["marque"]
        nom = colle["nom"]
        slug = slugify(f"{marque_nom}-{nom}")

        if slug in existing_slugs:
            print(f"⏭️  Déjà présent : {marque_nom} {nom}")
            skipped += 1
            continue

        # Trouver / créer la marque
        marque_id = marques_map.get(marque_nom.lower())
        if not marque_id:
            for k, v in marques_map.items():
                if marque_nom.lower() in k or k in marque_nom.lower():
                    marque_id = v
                    break
        if not marque_id:
            try:
                res = sb.table("marques").insert({"nom": marque_nom}).execute()
                marque_id = res.data[0]["id"]
                marques_map[marque_nom.lower()] = marque_id
                print(f"   ➕ Marque créée : {marque_nom}")
            except Exception as e:
                errors.append(f"Marque '{marque_nom}' : {e}")
                continue

        # Insérer dans produits
        try:
            payload = {
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }
            if subcat_colles:
                payload["subcategory_id"] = subcat_colles

            sb.table("produits").insert(payload).execute()
            existing_slugs.add(slug)
            print(f"✅ {marque_nom} — {nom}")
            inserted += 1

        except Exception as e:
            errors.append(f"'{nom}' : {e}")

    print("\n" + "="*50)
    print(f"✅ Insérés   : {inserted}")
    print(f"⏭️  Skippés   : {skipped}")
    print(f"❌ Erreurs   : {len(errors)}")
    for e in errors:
        print(f"  - {e}")
    print("="*50)

if __name__ == "__main__":
    main()
