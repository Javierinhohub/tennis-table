"""
import_chaussures.py — Import des chaussures de tennis de table dans Supabase TT-Kip
=====================================================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_chaussures.py
"""

import os, re, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ─── Liste complète ───────────────────────────────────────────────────────────

CHAUSSURES = [

    # ── BUTTERFLY — Gamme Lezoline ─────────────────────────────────────────
    {"marque": "Butterfly", "nom": "Lezoline Rifones"},
    {"marque": "Butterfly", "nom": "Lezoline Rifones II"},
    {"marque": "Butterfly", "nom": "Lezoline Mach"},
    {"marque": "Butterfly", "nom": "Lezoline Gigu"},
    {"marque": "Butterfly", "nom": "Lezoline Nine"},
    {"marque": "Butterfly", "nom": "Lezoline Vilight"},
    {"marque": "Butterfly", "nom": "Lezoline Vilight II"},
    {"marque": "Butterfly", "nom": "Lezoline Reiss"},
    {"marque": "Butterfly", "nom": "Lezoline Levalis"},
    {"marque": "Butterfly", "nom": "Lezoline TR"},
    {"marque": "Butterfly", "nom": "Lezoline Vilata"},
    {"marque": "Butterfly", "nom": "Lezoline Zero"},
    {"marque": "Butterfly", "nom": "Lezoline Sal"},
    {"marque": "Butterfly", "nom": "Lezoline Trynex"},

    # ── MIZUNO — Chaussures tennis de table ────────────────────────────────
    {"marque": "Mizuno", "nom": "Wave Medal 6"},
    {"marque": "Mizuno", "nom": "Wave Medal 7"},
    {"marque": "Mizuno", "nom": "Wave Medal 7 Neo"},
    {"marque": "Mizuno", "nom": "Wave Medal 8"},
    {"marque": "Mizuno", "nom": "Wave Medal Neo"},
    {"marque": "Mizuno", "nom": "Wave Drive 8"},
    {"marque": "Mizuno", "nom": "Wave Drive 9"},
    {"marque": "Mizuno", "nom": "Wave Drive Neo"},
    {"marque": "Mizuno", "nom": "Wave Drive Neo4"},
    {"marque": "Mizuno", "nom": "Crossmatch Smash"},
    {"marque": "Mizuno", "nom": "Crossmatch Sword"},
    {"marque": "Mizuno", "nom": "Crossmatch Plio RX4"},

    # ── YONEX — Chaussures tennis de table / indoor (utilisées par Félix Lebrun) ──
    {"marque": "Yonex", "nom": "Power Cushion Infinity 2"},        # Félix Lebrun
    {"marque": "Yonex", "nom": "Power Cushion Aerus Z"},           # Félix Lebrun (ancienne)
    {"marque": "Yonex", "nom": "Power Cushion 65 Z3"},             # Alexis Lebrun
    {"marque": "Yonex", "nom": "Power Cushion 65 X4"},
    {"marque": "Yonex", "nom": "Power Cushion 65 Z2"},
    {"marque": "Yonex", "nom": "Power Cushion 65 X3"},
    {"marque": "Yonex", "nom": "Power Cushion 37"},
    {"marque": "Yonex", "nom": "Power Cushion 39"},
    {"marque": "Yonex", "nom": "Power Cushion Fusionrev 5"},
    {"marque": "Yonex", "nom": "Power Cushion Eclipsion 5"},
    {"marque": "Yonex", "nom": "Power Cushion Sonicage 3"},

    # ── TIBHAR ─────────────────────────────────────────────────────────────
    {"marque": "Tibhar", "nom": "Progress"},
    {"marque": "Tibhar", "nom": "Progress Soft"},
    {"marque": "Tibhar", "nom": "Defence"},
    {"marque": "Tibhar", "nom": "Blizzard"},

    # ── DONIC ──────────────────────────────────────────────────────────────
    {"marque": "Donic", "nom": "Waldner Flex III"},
    {"marque": "Donic", "nom": "Waldner Flex V"},
    {"marque": "Donic", "nom": "Waldner Flex VII"},
    {"marque": "Donic", "nom": "Ultra Carbon 2"},

    # ── YASAKA ─────────────────────────────────────────────────────────────
    {"marque": "Yasaka", "nom": "Cyber Force"},
    {"marque": "Yasaka", "nom": "Cyber Force Plus"},
    {"marque": "Yasaka", "nom": "Move R"},

    # ── ANDRO ──────────────────────────────────────────────────────────────
    {"marque": "Andro", "nom": "Talla"},
    {"marque": "Andro", "nom": "Kai"},
    {"marque": "Andro", "nom": "Kai 2"},
    {"marque": "Andro", "nom": "Vapour"},

    # ── JOOLA ──────────────────────────────────────────────────────────────
    {"marque": "Joola", "nom": "Rally Blue"},
    {"marque": "Joola", "nom": "Swerve"},
    {"marque": "Joola", "nom": "Speed"},
    {"marque": "Joola", "nom": "Vivid"},

    # ── GEWO ───────────────────────────────────────────────────────────────
    {"marque": "Gewo", "nom": "Strut Carbon Pro"},
    {"marque": "Gewo", "nom": "Strut Carbon One"},

    # ── XIOM ───────────────────────────────────────────────────────────────
    {"marque": "Xiom", "nom": "Quest"},
    {"marque": "Xiom", "nom": "Move S"},

    # ── NITTAKU ────────────────────────────────────────────────────────────
    {"marque": "Nittaku", "nom": "Reginare S"},

    # ── STIGA ──────────────────────────────────────────────────────────────
    {"marque": "Stiga", "nom": "Guard X"},

    # ── LI-NING ────────────────────────────────────────────────────────────
    {"marque": "Li-Ning", "nom": "Ultra III Speed"},
    {"marque": "Li-Ning", "nom": "Ultra III Flex"},
    {"marque": "Li-Ning", "nom": "APSS017"},
    {"marque": "Li-Ning", "nom": "APSS009"},
    {"marque": "Li-Ning", "nom": "Ultra IV"},
    {"marque": "Li-Ning", "nom": "Ultra V"},

    # ── ASICS (polyvalentes, très utilisées en ping) ────────────────────────
    {"marque": "Asics", "nom": "Gel Blade 8"},
    {"marque": "Asics", "nom": "Gel Blade 7"},
    {"marque": "Asics", "nom": "Gel Rocket 11"},
    {"marque": "Asics", "nom": "Gel Rocket 10"},
    {"marque": "Asics", "nom": "Upcourt 5"},

    # ── VICTAS ─────────────────────────────────────────────────────────────
    {"marque": "Victas", "nom": "V-GS"},

    # ── DECATHLON / PONGORI ────────────────────────────────────────────────
    {"marque": "Decathlon Pongori", "nom": "TTS 900"},
    {"marque": "Decathlon Pongori", "nom": "TTS 500"},
    {"marque": "Decathlon Pongori", "nom": "TTS 100"},
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

    # 1. Marques existantes
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map = {m["nom"].lower(): m["id"] for m in marques_res.data}

    # 2. Chercher ou créer la sous-catégorie "Chaussures"
    subcats_res = sb.table("sous_categories").select("id, nom, slug").execute()
    subcat_id = None
    for sc in subcats_res.data:
        if "chaussure" in sc["nom"].lower() or "chaussure" in sc.get("slug", "").lower():
            subcat_id = sc["id"]
            print(f"✅ Sous-catégorie trouvée : {sc['nom']}")
            break
    if not subcat_id:
        print("⚠️  Sous-catégorie 'Chaussures' non trouvée — création...")
        try:
            res = sb.table("sous_categories").insert({"nom": "Chaussures", "slug": "chaussures"}).execute()
            subcat_id = res.data[0]["id"]
            print(f"✅ Sous-catégorie créée : {subcat_id}")
        except Exception as e:
            print(f"❌ Impossible de créer : {e}")
            sys.exit(1)

    # 3. Slugs existants
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs = {r["slug"] for r in existing_res.data}
    print(f"📋 {len(existing_slugs)} produits existants\n")

    inserted = 0
    skipped = 0
    errors = []

    for ch in CHAUSSURES:
        marque_nom = ch["marque"]
        nom = ch["nom"]
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

        try:
            sb.table("produits").insert({
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "subcategory_id": subcat_id,
                "actif": True,
            }).execute()
            existing_slugs.add(slug)
            print(f"✅ {marque_nom} — {nom}")
            inserted += 1
        except Exception as e:
            errors.append(f"'{nom}' : {e}")

    print("\n" + "="*55)
    print(f"✅ Insérés   : {inserted}")
    print(f"⏭️  Skippés   : {skipped}")
    print(f"❌ Erreurs   : {len(errors)}")
    for e in errors:
        print(f"  - {e}")
    print("="*55)

if __name__ == "__main__":
    main()
