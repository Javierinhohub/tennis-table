"""
import_nouveaux_bois.py — Tibhar gamme Lebrun + Joola gamme Calderano
=====================================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_nouveaux_bois.py
"""

import os, re, sys
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ─── Données enrichies ────────────────────────────────────────────────────────

BOIS = [

    # ── TIBHAR — Gamme Alexis Lebrun ────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Alexis Lebrun ALL+",
        "nb_plis": 5,
        "poids_g": 85,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois pur",
    },
    {
        "marque": "Tibhar",
        "nom": "Alexis Lebrun OFF",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois + 2 Soft Carbon Inner",
    },
    {
        "marque": "Tibhar",
        "nom": "Alexis Lebrun OFF-",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF-",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 plis bois + 2 Soft Carbon Inner",
    },
    {
        "marque": "Tibhar",
        "nom": "Alexis Lebrun Krypto Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 plis bois + 2 Krypto Carbon Outer",
        "pli1": "Koto", "pli2": "Krypto Carbon", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Krypto Carbon", "pli7": "Koto",
    },

    # ── TIBHAR — Gamme Félix Lebrun ──────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Felix Lebrun ALL",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "ALL",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "7 plis bois pur",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous",
        "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Felix Lebrun ALL+",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "7 plis bois pur",
    },
    {
        "marque": "Tibhar",
        "nom": "Felix Lebrun OFF-",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF-",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 plis bois + 2 fibres hybrides Carbon Inner",
    },
    {
        "marque": "Tibhar",
        "nom": "Felix Lebrun OFF",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 plis bois + 2 fibres hybrides Carbon Inner",
    },
    {
        "marque": "Tibhar",
        "nom": "Felix Lebrun Hyper Carbon Inner",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois + 2 Hyper Carbon Inner (fibres synthétiques + carbone autour du placage central)",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Hyper Carbon",
        "pli4": "Ayous", "pli5": "Hyper Carbon", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── JOOLA — Gamme Hugo Calderano ─────────────────────────────────────────
    {
        "marque": "Joola",
        "nom": "Hugo Calderano AW-7",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "7 plis bois pur — Limba extérieur, Ayous intermédiaire et central",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous",
        "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Joola",
        "nom": "Hugo Calderano KL-c Inner",
        "nb_plis": 7,
        "poids_g": 87,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois + 2 KL-c Inner (Aramide-Carbone) — Limba extérieur, Ayous + KL-c inner",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "KL-c",
        "pli4": "Ayous", "pli5": "KL-c", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── JOOLA — Autres bois récents ──────────────────────────────────────────
    {
        "marque": "Joola",
        "nom": "BASEline Carbon",
        "nb_plis": 7,
        "poids_g": 83,
        "style": "OFF-",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois + 2 Soft Carbon Inner — Limba extérieur",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Soft Carbon",
        "pli4": "Ayous", "pli5": "Soft Carbon", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Joola",
        "nom": "Vyzaryz Freeze HRD",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Limba-ALC-Limba-Kiri-Limba-ALC-Limba",
        "pli1": "Limba", "pli2": "ALC", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "ALC", "pli7": "Limba",
    },
    {
        "marque": "Joola",
        "nom": "ZeLeBRO PBO-c",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Limba-PBO-c-Koto-Kiri-Koto-PBO-c-Limba",
        "pli1": "Limba", "pli2": "PBO-c", "pli3": "Koto",
        "pli4": "Kiri", "pli5": "Koto", "pli6": "PBO-c", "pli7": "Limba",
    },
    {
        "marque": "Joola",
        "nom": "Energon Super PBO-c",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Koto-Super PBO-c-Limba-Kiri-Limba-Super PBO-c-Koto",
        "pli1": "Koto", "pli2": "Super PBO-c", "pli3": "Limba",
        "pli4": "Kiri", "pli5": "Limba", "pli6": "Super PBO-c", "pli7": "Koto",
    },

    # ── TIBHAR — Autres bois récents ─────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Fortino Pro DC Inside",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "5 plis bois + 2 Dyneema Carbon Inside",
    },
    {
        "marque": "Tibhar",
        "nom": "Rapid Carbon Light",
        "nb_plis": 7,
        "poids_g": 75,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "Balsa + 2 carbone haute technologie — ultra léger",
        "pli1": "Koto", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Balsa", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Koto",
    },
    {
        "marque": "Tibhar",
        "nom": "Drinkhall Power Spin Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Koto-ALC-Ayous-Kiri-Ayous-ALC-Koto",
        "pli1": "Koto", "pli2": "ALC", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "ALC", "pli7": "Koto",
    },
    {
        "marque": "Tibhar",
        "nom": "Zodiac Libra ZAC",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Limba-Ayous-ZAC-Ayous-ZAC-Ayous-Limba",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "ZAC",
        "pli4": "Ayous", "pli5": "ZAC", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Ikarus ALX",
        "nb_plis": 9,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Ayous-Ayous-Ayous-Texalium-Kiri-Texalium-Ayous-Ayous-Ayous",
        "pli1": "Ayous", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Texalium™", "pli5": "Kiri", "pli6": "Texalium™",
        "pli7": "Ayous",
    },
]

# ─── Utilitaires ──────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text)[:100]

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis")
        sys.exit(1)

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Charger marques
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map = {m["nom"].lower(): m["id"] for m in marques_res.data}

    # Charger slugs existants
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs = {r["slug"] for r in existing_res.data}

    inserted = 0
    skipped = 0
    errors = []

    for bois in BOIS:
        marque_nom = bois["marque"]
        nom = bois["nom"]
        slug = slugify(f"{marque_nom}-{nom}")

        if slug in existing_slugs:
            print(f"⏭️  Déjà présent : {nom}")
            skipped += 1
            continue

        # Trouver la marque
        marque_id = marques_map.get(marque_nom.lower())
        if not marque_id:
            # Correspondance partielle
            for k, v in marques_map.items():
                if marque_nom.lower() in k or k in marque_nom.lower():
                    marque_id = v
                    break
        if not marque_id:
            # Créer la marque
            try:
                res = sb.table("marques").insert({"nom": marque_nom}).execute()
                marque_id = res.data[0]["id"]
                marques_map[marque_nom.lower()] = marque_id
                print(f"   ➕ Marque créée : {marque_nom}")
            except Exception as e:
                errors.append(f"Marque '{marque_nom}' introuvable : {e}")
                continue

        try:
            # Insérer produit
            prod_res = sb.table("produits").insert({
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }).execute()
            produit_id = prod_res.data[0]["id"]
            existing_slugs.add(slug)

            # Construire ligne bois
            bois_row = {"produit_id": produit_id}
            for field in ["nb_plis", "poids_g", "epaisseur_mm", "style", "prix",
                          "composition", "note_vitesse", "note_controle",
                          "note_flexibilite", "note_durete", "note_qualite_prix",
                          "pli1", "pli2", "pli3", "pli4", "pli5", "pli6", "pli7"]:
                if field in bois:
                    bois_row[field] = bois[field]

            sb.table("bois").insert(bois_row).execute()
            print(f"✅ {marque_nom} — {nom}")
            inserted += 1

        except Exception as e:
            errors.append(f"Erreur '{nom}' : {e}")

    print("\n" + "="*50)
    print(f"✅ Insérés   : {inserted}")
    print(f"⏭️  Skippés   : {skipped}")
    print(f"❌ Erreurs   : {len(errors)}")
    for e in errors:
        print(f"  - {e}")
    print("="*50)

if __name__ == "__main__":
    main()
