"""
import_mima_ito.py — Ajout du Nittaku Mima Ito Carbon dans Supabase TT-Kip
============================================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_mima_ito.py
"""

import os, re, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text)[:100]

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis")
        sys.exit(1)

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    marque_nom = "Nittaku"
    nom        = "Mima Ito Carbon"
    slug       = slugify(f"{marque_nom}-{nom}")   # nittaku-mima-ito-carbon

    # 1. Vérifier si déjà présent
    existing = sb.table("produits").select("id").eq("slug", slug).execute()
    if existing.data:
        print(f"⏭️  Déjà présent en base : {nom}")
        sys.exit(0)

    # 2. Trouver la marque Nittaku
    marques_res = sb.table("marques").select("id, nom").execute()
    marque_id = None
    for m in marques_res.data:
        if m["nom"].lower() == marque_nom.lower():
            marque_id = m["id"]
            break
    if not marque_id:
        print(f"❌ Marque '{marque_nom}' introuvable en base")
        sys.exit(1)

    # 3. Insérer le produit
    prod_res = sb.table("produits").insert({
        "nom":       nom,
        "slug":      slug,
        "marque_id": marque_id,
        "actif":     True,
    }).execute()

    if not prod_res.data:
        print("❌ Erreur lors de l'insertion du produit")
        sys.exit(1)

    produit_id = prod_res.data[0]["id"]

    # 4. Insérer les données bois
    # Sources : Megaspin, Nittaku official shop, TTGearLab
    # - 7 plis : Limba (outer) - FE Carbon - Limba - Tung (core) - Limba - FE Carbon - Limba
    # - Même construction que l'Acoustic Carbon
    # - Épaisseur : 5,5 mm | Poids : ~90 g | Style : OFF | Dimensions : 157 x 150 mm
    sb.table("bois").insert({
        "produit_id":    produit_id,
        "nb_plis":       7,
        "poids_g":       90,
        "epaisseur_mm":  "5.5",
        "style":         "OFF",
        "composition":   "Limba-FE Carbon-Limba-Tung-Limba-FE Carbon-Limba",
        "pli1":          "Limba",
        "pli2":          "FE Carbon",
        "pli3":          "Limba",
        "pli4":          "Tung",
        "pli5":          "Limba",
        "pli6":          "FE Carbon",
        "pli7":          "Limba",
        "note_vitesse":  8,
        "note_controle": 7,
    }).execute()

    print(f"✅ {marque_nom} — {nom} ajouté avec succès !")
    print(f"   Slug    : {slug}")
    print(f"   Plis    : 7 (Limba - FE Carbon - Limba - Tung - Limba - FE Carbon - Limba)")
    print(f"   Poids   : 90 g")
    print(f"   Ép.     : 5,5 mm")
    print(f"   Style   : OFF")

if __name__ == "__main__":
    main()
