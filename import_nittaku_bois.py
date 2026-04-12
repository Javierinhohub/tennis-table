"""
import_nittaku_bois.py — Import bois Nittaku manquants dans Supabase TT-Kip
============================================================================
Sources : nittaku.tt, megaspin.net, tabletennis11.com, revspin.net, TTGearLab
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_nittaku_bois.py
"""

import os, re, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

BOIS = [

    # ── GAMME GORIKI ───────────────────────────────────────────────────────
    {
        "nom": "Goriki",
        "nb_plis": 7, "poids_g": 106, "style": "ALL+", "epaisseur_mm": "4.9",
        "composition": "Noyer-Noyer-Noyer-Noyer-Noyer-Noyer-Noyer",
        "pli1": "Noyer", "pli2": "Noyer", "pli3": "Noyer",
        "pli4": "Noyer", "pli5": "Noyer", "pli6": "Noyer", "pli7": "Noyer",
        "note_vitesse": 6, "note_controle": 10,
    },
    {
        "nom": "Goriki Danshi",
        "nb_plis": 7, "poids_g": 105, "style": "OFF-", "epaisseur_mm": "5.0",
        "composition": "Noyer-Noyer-Noyer-Noyer-Noyer-Noyer-Noyer",
        "pli1": "Noyer", "pli2": "Noyer", "pli3": "Noyer",
        "pli4": "Noyer", "pli5": "Noyer", "pli6": "Noyer", "pli7": "Noyer",
        "note_vitesse": 7, "note_controle": 9,
    },
    {
        "nom": "Goriki Super Cut",
        "nb_plis": 7, "poids_g": 106, "style": "ALL+",
        "composition": "Noyer-Noyer-Noyer-Noyer-Noyer-Noyer-Noyer (palette agrandie 165x156mm)",
        "pli1": "Noyer", "pli2": "Noyer", "pli3": "Noyer",
        "pli4": "Noyer", "pli5": "Noyer", "pli6": "Noyer", "pli7": "Noyer",
        "note_vitesse": 6, "note_controle": 10,
    },
    {
        "nom": "Goriki Super Drive",
        "nb_plis": 6, "poids_g": 100, "style": "OFF-", "epaisseur_mm": "7.0",
        "composition": "Noyer-Hinoki-Hinoki-Hinoki-Hinoki-Noyer",
        "pli1": "Noyer", "pli2": "Hinoki", "pli3": "Hinoki",
        "pli4": "Hinoki", "pli5": "Hinoki", "pli6": "Noyer",
        "note_vitesse": 7, "note_controle": 9,
    },

    # ── GAMME ACOUSTIC ─────────────────────────────────────────────────────
    {
        "nom": "Acoustic Carbon G-Revision",
        "nb_plis": 7, "poids_g": 90, "style": "OFF+",
        "composition": "Limba-FE Carbon-Limba-Tung-Limba-FE Carbon-Limba",
        "pli1": "Limba", "pli2": "FE Carbon", "pli3": "Limba",
        "pli4": "Tung", "pli5": "Limba", "pli6": "FE Carbon", "pli7": "Limba",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Acoustic Carbon Large Grip",
        "nb_plis": 7, "poids_g": 90, "style": "OFF+",
        "composition": "Limba-FE Carbon-Limba-Tung-Limba-FE Carbon-Limba",
        "pli1": "Limba", "pli2": "FE Carbon", "pli3": "Limba",
        "pli4": "Tung", "pli5": "Limba", "pli6": "FE Carbon", "pli7": "Limba",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Acoustic Carbon Inner",
        "nb_plis": 7, "poids_g": 88, "style": "OFF",
        "composition": "Limba-Limba-FE Carbon-Tung-FE Carbon-Limba-Limba",
        "pli1": "Limba", "pli2": "Limba", "pli3": "FE Carbon",
        "pli4": "Tung", "pli5": "FE Carbon", "pli6": "Limba", "pli7": "Limba",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Tenaly Acoustic",
        "nb_plis": 5, "poids_g": 86, "style": "ALL+",
        "composition": "Limba-Ayous-Tung-Ayous-Limba",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Tung",
        "pli4": "Ayous", "pli5": "Limba",
        "note_vitesse": 7, "note_controle": 9,
    },

    # ── GAMME S-SERIES ─────────────────────────────────────────────────────
    {
        "nom": "S-Series S-CZ",
        "nb_plis": 7, "poids_g": 85, "style": "OFF",
        "composition": "Epicéa-Carbone Fleece Zylon®-Ayous-Kiri-Ayous-Carbone Fleece Zylon®-Epicéa",
        "pli1": "Epicéa", "pli2": "Carbone Fleece Zylon®", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone Fleece Zylon®", "pli7": "Epicéa",
        "note_vitesse": 8, "note_controle": 9,
    },

    # ── SIGNATURE / RÉCENTS ────────────────────────────────────────────────
    {
        "nom": "Hina Hayata H2",
        "nb_plis": 7, "poids_g": 86, "style": "OFF",
        "composition": "Koto-PKC Carbon-Limba-Kiri-Limba-PKC Carbon-Koto",
        "pli1": "Koto", "pli2": "PKC Carbon", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "PKC Carbon", "pli7": "Koto",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Gyo-En",
        "nb_plis": 7, "poids_g": 82, "style": "OFF+",
        "composition": "Koto-KVC3-Limba-Kiri-Limba-KVC3-Koto",
        "pli1": "Koto", "pli2": "KVC3", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "KVC3", "pli7": "Koto",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "So-Ten",
        "nb_plis": 7, "poids_g": 88, "style": "OFF+",
        "composition": "Koto-ALC-Limba-Kiri-Limba-ALC-Koto",
        "pli1": "Koto", "pli2": "ALC", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "ALC", "pli7": "Koto",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "H301 NXD",
        "nb_plis": 7, "poids_g": 90, "style": "OFF+",
        "composition": "Koto-NXD Carbon-Ayous-Kiri-Ayous-NXD Carbon-Koto",
        "pli1": "Koto", "pli2": "NXD Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "NXD Carbon", "pli7": "Koto",
        "note_vitesse": 9, "note_controle": 8,
    },

    # ── GAMME HINO ─────────────────────────────────────────────────────────
    {
        "nom": "Hino Blade 5.22",
        "nb_plis": 9, "poids_g": 88, "style": "OFF+",
        "composition": "Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki",
        "pli1": "Hinoki", "pli2": "AD Carbon", "pli3": "Hinoki",
        "pli4": "AD Carbon", "pli5": "Hinoki", "pli6": "AD Carbon", "pli7": "Hinoki",
        "note_vitesse": 8, "note_controle": 8,
    },
    {
        "nom": "Hino Blade 7.22",
        "nb_plis": 11, "poids_g": 92, "style": "OFF",
        "composition": "Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki-AD Carbon-Hinoki",
        "pli1": "Hinoki", "pli2": "AD Carbon", "pli3": "Hinoki",
        "pli4": "AD Carbon", "pli5": "Hinoki", "pli6": "AD Carbon", "pli7": "Hinoki",
        "note_vitesse": 8, "note_controle": 8,
    },

    # ── GAMME NORDLINGER ────────────────────────────────────────────────────
    {
        "nom": "Nordlinger AC",
        "nb_plis": 7, "poids_g": 85, "style": "OFF+",
        "composition": "Limba-AC Carbon-Ayous-Kiri-Ayous-AC Carbon-Limba",
        "pli1": "Limba", "pli2": "AC Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "AC Carbon", "pli7": "Limba",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Nordlinger DY",
        "nb_plis": 7, "poids_g": 85, "style": "OFF+",
        "composition": "Limba-DY Carbon-Ayous-Kiri-Ayous-DY Carbon-Limba",
        "pli1": "Limba", "pli2": "DY Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "DY Carbon", "pli7": "Limba",
        "note_vitesse": 9, "note_controle": 8,
    },

    # ── GAMME TORNADO ──────────────────────────────────────────────────────
    {
        "nom": "Tornado King Speed",
        "nb_plis": 7, "poids_g": 90, "style": "OFF+",
        "composition": "Limba-Carbone Kevlar™-Ayous-Kiri-Ayous-Carbone Kevlar™-Limba",
        "pli1": "Limba", "pli2": "Carbone Kevlar™", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone Kevlar™", "pli7": "Limba",
        "note_vitesse": 9, "note_controle": 8,
    },

    # ── DIVERS NITTAKU ─────────────────────────────────────────────────────
    {
        "nom": "Tribus Carbon",
        "nb_plis": 7, "poids_g": 82, "style": "OFF+",
        "composition": "Ayous-Carbone-Ayous-Kiri-Ayous-Carbone-Ayous",
        "pli1": "Ayous", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Ayous",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Violin Carbon",
        "nb_plis": 7, "poids_g": 90, "style": "OFF+",
        "composition": "White Ash-Carbone-White Ash-Kiri-White Ash-Carbone-White Ash",
        "pli1": "White Ash", "pli2": "Carbone", "pli3": "White Ash",
        "pli4": "Kiri", "pli5": "White Ash", "pli6": "Carbone", "pli7": "White Ash",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Tenaly Carbon",
        "nb_plis": 7, "poids_g": 85, "style": "OFF+",
        "composition": "Carbone-Ayous-Ayous-Kiri-Ayous-Ayous-Carbone",
        "pli1": "Ayous", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Ayous",
        "note_vitesse": 9, "note_controle": 8,
    },
    {
        "nom": "Winglight",
        "nb_plis": 5, "poids_g": 70, "style": "ALL+",
        "composition": "Ayous-Ayous-Balsa-Ayous-Ayous",
        "pli1": "Ayous", "pli2": "Ayous", "pli3": "Balsa",
        "pli4": "Ayous", "pli5": "Ayous",
        "note_vitesse": 7, "note_controle": 9,
    },
    {
        "nom": "Miyabi",
        "nb_plis": 5, "poids_g": 85, "style": "ALL+",
        "composition": "Hinoki-Ayous-Kiri-Ayous-Hinoki",
        "pli1": "Hinoki", "pli2": "Ayous", "pli3": "Kiri",
        "pli4": "Ayous", "pli5": "Hinoki",
        "note_vitesse": 7, "note_controle": 9,
    },
    {
        "nom": "Latika Light",
        "nb_plis": 5, "poids_g": 82, "style": "ALL+",
        "composition": "Limba-Epicéa-Ayous-Epicéa-Limba",
        "pli1": "Limba", "pli2": "Epicéa", "pli3": "Ayous",
        "pli4": "Epicéa", "pli5": "Limba",
        "note_vitesse": 7, "note_controle": 9,
    },
    {
        "nom": "Septear Feel Inner",
        "nb_plis": 9, "poids_g": 85, "style": "OFF",
        "composition": "Hinoki-Hinoki-Carbone Inner-Hinoki-Kiri-Hinoki-Carbone Inner-Hinoki-Hinoki",
        "pli1": "Hinoki", "pli2": "Hinoki", "pli3": "Carbone",
        "pli4": "Hinoki", "pli5": "Kiri", "pli6": "Hinoki",
        "pli7": "Carbone",
        "note_vitesse": 8, "note_controle": 8,
    },
    {
        "nom": "Eto Blade 2024 Dragon",
        "nb_plis": 7, "poids_g": 85, "style": "OFF",
        "composition": "Koto-ALC-Limba-Kiri-Limba-ALC-Koto",
        "pli1": "Koto", "pli2": "ALC", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "ALC", "pli7": "Koto",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Ludeack Fleet",
        "nb_plis": 7, "poids_g": 85, "style": "OFF",
        "composition": "Limba-Ayous-Ayous-Ayous-Ayous-Ayous-Limba",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Barwell Fleet",
        "nb_plis": 7, "poids_g": 88, "style": "OFF",
        "composition": "Noyer-Limba-Ayous-Ayous-Ayous-Limba-Noyer",
        "pli1": "Noyer", "pli2": "Limba", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Limba", "pli7": "Noyer",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Ma Long Five",
        "nb_plis": 5, "poids_g": 89, "style": "OFF",
        "composition": "Koto-Pin-Ayous-Pin-Koto",
        "pli1": "Koto", "pli2": "Pin", "pli3": "Ayous",
        "pli4": "Pin", "pli5": "Koto",
        "note_vitesse": 8, "note_controle": 9,
    },
    {
        "nom": "Redshank",
        "nb_plis": 5, "poids_g": 80, "style": "ALL",
        "composition": "Ayous-Ayous-Ayous-Ayous-Ayous",
        "pli1": "Ayous", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous",
        "note_vitesse": 6, "note_controle": 10,
    },
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

    # Trouver la marque Nittaku
    marques_res = sb.table("marques").select("id, nom").execute()
    marque_id = None
    for m in marques_res.data:
        if m["nom"].lower() == "nittaku":
            marque_id = m["id"]
            break
    if not marque_id:
        print("❌ Marque 'Nittaku' introuvable en base")
        sys.exit(1)
    print(f"✅ Marque Nittaku trouvée : {marque_id}")

    # Slugs existants
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs = {r["slug"] for r in existing_res.data}
    print(f"📋 {len(existing_slugs)} produits existants\n")

    inserted = 0
    skipped = 0
    errors = []

    for bois in BOIS:
        nom = bois["nom"]
        slug = slugify(f"nittaku-{nom}")

        if slug in existing_slugs:
            print(f"⏭️  Déjà présent : {nom}")
            skipped += 1
            continue

        try:
            prod_res = sb.table("produits").insert({
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }).execute()
            produit_id = prod_res.data[0]["id"]
            existing_slugs.add(slug)

            bois_row = {"produit_id": produit_id}
            for field in ["nb_plis", "poids_g", "epaisseur_mm", "style", "composition",
                          "note_vitesse", "note_controle", "note_flexibilite",
                          "pli1", "pli2", "pli3", "pli4", "pli5", "pli6", "pli7"]:
                if field in bois:
                    bois_row[field] = bois[field]

            sb.table("bois").insert(bois_row).execute()
            print(f"✅ Nittaku — {nom}")
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
