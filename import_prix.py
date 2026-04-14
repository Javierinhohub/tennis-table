"""
import_prix.py — Remplissage des prix indicatifs (revêtements + bois) pour TT-Kip
====================================================================================
Prix moyens constatés sur le marché européen (début 2025).
Sources : tabletennis11.com, misterping.com, tennis-de-table.com, revspin.net

Prérequis : ajouter la colonne prix à la table revetements dans Supabase :
    ALTER TABLE revetements ADD COLUMN IF NOT EXISTS prix numeric(6,2);

Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=service_role_key python3 import_prix.py
"""

import os, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY avant de lancer le script.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Prix des revêtements (nom_produit: prix_eur) ─────────────────────────────
# Prix indicatifs moyens constatés en Europe début 2025
PRIX_REVETEMENTS = {
    # ── Butterfly ──────────────────────────────────────────────────────────────
    "Tenergy 05":             54.0,
    "Tenergy 05 FX":          54.0,
    "Tenergy 05 Hard":        54.0,
    "Tenergy 64":             54.0,
    "Tenergy 64 FX":          54.0,
    "Tenergy 80":             54.0,
    "Tenergy 80 FX":          54.0,
    "Tenergy 19":             54.0,
    "Dignics 05":             78.0,
    "Dignics 09C":            82.0,
    "Dignics 64":             78.0,
    "Dignics 80":             78.0,
    "Zyre03":                 80.0,
    "Rozena":                 40.0,
    "Glayzer":                50.0,
    "Glayzer 09C":            52.0,
    "Impartial XS":           36.0,
    "Impartial XB":           36.0,
    "Bryce Speed FX":         40.0,
    "Addoy":                  15.0,
    "Sriver":                 25.0,
    "Sriver G2 FX":           26.0,

    # ── DHS ───────────────────────────────────────────────────────────────────
    "Hurricane 3":            22.0,
    "Hurricane 3 Neo":        24.0,
    "Hurricane 3 National":   85.0,
    "Hurricane 8":            38.0,
    "Hurricane 8-80":         40.0,
    "Skyline TG3":            22.0,
    "Dipper":                 20.0,

    # ── Tibhar ────────────────────────────────────────────────────────────────
    "Evolution MX-P":         40.0,
    "Evolution MX-P 50":      42.0,
    "Evolution MX-S":         40.0,
    "Evolution MX-D":         40.0,
    "Evolution FX-P":         38.0,
    "Evolution FX-S":         38.0,
    "Evolution EL-P":         36.0,
    "Evolution EL-S":         36.0,
    "Hybrid K3":              65.0,
    "Hybrid K1J":             58.0,
    "Hybrid K1 Pro":          62.0,
    "Hybrid K2 Pro":          58.0,
    "Nimbus":                 28.0,
    "Nimbus Soft":            28.0,
    "Genius +":               22.0,
    "Speedy Soft":            18.0,

    # ── Andro ─────────────────────────────────────────────────────────────────
    "Rasanter R47":           38.0,
    "Rasanter R42":           38.0,
    "Rasanter R37":           38.0,
    "Rasanter V47":           40.0,
    "Rasanter V42":           40.0,
    "Rasanter C48":           40.0,
    "NUZN 55":                80.0,
    "NUZN 47.5":              78.0,
    "Hexer":                  28.0,
    "Hexer HD":               30.0,
    "Hexer Powergrip":        32.0,
    "Hexer Grip":             30.0,

    # ── Joola ─────────────────────────────────────────────────────────────────
    "Dynaryz Inferno":        90.0,
    "Dynaryz AGR":            85.0,
    "Dynaryz ZGR":            85.0,
    "Dynaryz CMD":            80.0,
    "Dynaryz ACC":            70.0,
    "Golden Tango":           42.0,
    "Golden Tango PS":        42.0,
    "Rhyzm":                  30.0,
    "Rhyzm-P":                32.0,
    "Rhyzm Tech":             28.0,
    "Rhyzer 43":              34.0,
    "Rhyzer 48":              34.0,
    "Rhyzer Pro 45":          36.0,
    "Rhyzer Pro 50":          36.0,

    # ── Nittaku ───────────────────────────────────────────────────────────────
    "Fastarc G-1":            38.0,
    "Fastarc C-1":            38.0,
    "Fastarc P-1":            36.0,
    "Fastarc S-1":            36.0,
    "Moristo SP":             30.0,
    "Moristo SP AX":          32.0,
    "Hurricane Pro III Turbo Blue": 90.0,

    # ── Stiga ─────────────────────────────────────────────────────────────────
    "Mantra H":               32.0,
    "Mantra M":               30.0,
    "Mantra S":               28.0,
    "Helix Platinum XH":      75.0,
    "Helix Platinum H":       72.0,
    "Calibra LT":             25.0,
    "Calibra LT Spin":        26.0,
    "DNA Dragon Grip":        48.0,
    "DNA Platinum XH":        70.0,
    "DNA Platinum H":         68.0,
    "DNA Platinum M":         65.0,
    "DNA Platinum S":         62.0,

    # ── Xiom ──────────────────────────────────────────────────────────────────
    "Vega Pro":               32.0,
    "Vega Asia":              30.0,
    "Vega Europe":            28.0,
    "Vega X":                 36.0,
    "Omega VII Tour":         55.0,
    "Omega VII Hyper":        58.0,
    "Omega VII Pro":          52.0,
    "Omega VII Asia":         50.0,
    "Omega VII China Ying":   42.0,
    "Omega VII Euro":         48.0,

    # ── Donic ─────────────────────────────────────────────────────────────────
    "Bluestar A1":            38.0,
    "Bluestar A2":            36.0,
    "Bluestar A3":            34.0,
    "Baracuda":               30.0,
    "Baracuda Big Slam":      32.0,
    "Acuda S1":               36.0,
    "Acuda S2":               34.0,
    "Acuda S3":               32.0,
    "Acuda Blue P1":          36.0,
    "Acuda Blue P2":          34.0,

    # ── Victas ────────────────────────────────────────────────────────────────
    "V>15 Sticky":            38.0,
    "V>15 Extra":             36.0,
    "V>20 Double Extra":      42.0,
    "V>11 Extra":             32.0,
    "Ventus Stiff":           28.0,
    "Ventus Limber":          26.0,
    "Ventus Regular":         24.0,

    # ── TSP ───────────────────────────────────────────────────────────────────
    "Curl P-1R":              28.0,
    "Curl P-4":               26.0,
    "Spinpips Red":           22.0,

    # ── 729 ───────────────────────────────────────────────────────────────────
    "Friendship 729 FX":      12.0,
    "Super FX":               14.0,

    # ── Mizuno ────────────────────────────────────────────────────────────────
    "Rifle":                  30.0,
    "Booster SA":             32.0,
    "Booster EV":             32.0,

    # ── Yasaka ────────────────────────────────────────────────────────────────
    "Rakza 7":                32.0,
    "Rakza 7 Soft":           32.0,
    "Rakza X":                36.0,
    "Rakza Z":                40.0,
    "Rakza Z Extra Hard":     42.0,
    "Mark V":                 22.0,
    "Mark V HPS":             24.0,
}

# ─── Prix des bois (nom_produit: prix_eur) ────────────────────────────────────
PRIX_BOIS = {
    # ── Butterfly ──────────────────────────────────────────────────────────────
    "Viscaria":                        135.0,
    "Timo Boll ALC":                   145.0,
    "Timo Boll ZLC":                   160.0,
    "Timo Boll ZLF":                   150.0,
    "Timo Boll W7":                    90.0,
    "Timo Boll W5":                    85.0,
    "Zhang Jike Super ZLC":            160.0,
    "Harimoto Tomokazu Inner Force ALC": 145.0,
    "Innerforce Layer ALC":            130.0,
    "Innerforce Layer ZLC":            150.0,
    "Innerforce Layer ZLF":            140.0,
    "Innerforce Layer ALC.S":          135.0,
    "Primorac Carbon":                 75.0,
    "Primorac":                        60.0,
    "Balsa Carbo X5 Pro":              80.0,
    "Petr Korbel":                     75.0,
    "Korbel":                          65.0,

    # ── Stiga ──────────────────────────────────────────────────────────────────
    "Clipper WRB":                     90.0,
    "Clipper CR WRB":                  95.0,
    "Carbonado 145":                   130.0,
    "Carbonado 190":                   145.0,
    "Carbonado 245":                   150.0,
    "Carbonado 290":                   155.0,
    "Cybershape Carbon":               145.0,
    "Cybershape Wood":                 110.0,
    "Dynasty Carbon":                  130.0,
    "Legacy Carbon 12k":               125.0,
    "Allround Classic":                75.0,
    "Allround Evolution":              80.0,
    "Allround NCT":                    85.0,
    "Offensive Classic":               70.0,
    "Defensive Classic":               70.0,
    "Pure":                            90.0,
    "Pure Cybershape":                 110.0,
    "Inspira CCF":                     75.0,
    "Inspira Hybrid Carbon":           85.0,
    "Inspira Plus":                    80.0,
    "Intensity NCT":                   95.0,
    "Ebenholz NCT VII":                95.0,
    "Rosewood NCT V":                  80.0,
    "Eternity VPS V":                  100.0,

    # ── Nittaku ────────────────────────────────────────────────────────────────
    "Acoustic":                        95.0,
    "Acoustic Carbon":                 115.0,
    "Violin":                          90.0,
    "Flyatt Carbon":                   110.0,
    "Flyatt Spin":                     90.0,
    "Hammond Carbon Power":            120.0,
    "Hammond FA Carbon":               110.0,
    "Septear":                         85.0,
    "Gembler":                         80.0,

    # ── Tibhar ────────────────────────────────────────────────────────────────
    "Stratus Power Wood":              55.0,
    "Stratus Power Carbon":            65.0,
    "Samsonov Alpha":                  60.0,
    "Samsonov Force Pro":              80.0,
    "Samsonov Force Pro Black Edition": 85.0,
    "Hybrid MK":                       85.0,
    "Hybrid Szocs":                    90.0,
    "Fortino Pro":                     75.0,
    "Fortino L":                       70.0,

    # ── Andro ──────────────────────────────────────────────────────────────────
    "Novacell Offensive":              65.0,
    "Dynaplast":                       70.0,
    "Treiber K":                       60.0,
    "Treiber C":                       65.0,
    "Core Cell OFF":                   60.0,
    "Core Cell ALL+":                  55.0,

    # ── Donic ──────────────────────────────────────────────────────────────────
    "Persson Powerplay":               60.0,
    "Waldner Legend Carbon":           80.0,
    "Waldner Senso Carbon":            75.0,
    "Waldner Senso Ultra Carbon":      80.0,
    "Appelgren Exclusive Carbon":      65.0,
    "Original Senso Carbon":           70.0,
    "Ovtcharov Carbon":                75.0,

    # ── Joola ──────────────────────────────────────────────────────────────────
    "Fever":                           26.0,
    "Rosskopf Attack":                 55.0,
    "Rosskopf Classic":                50.0,
    "Express Ultra":                   60.0,
    "X-Plode":                         65.0,
    "Carbon Force Pro":                70.0,

    # ── Xiom ───────────────────────────────────────────────────────────────────
    "Stradivarius":                    135.0,
    "Vega Tour":                       100.0,
    "Solo":                            60.0,
    "ICE Cream AZX":                   120.0,

    # ── Yasaka ────────────────────────────────────────────────────────────────
    "Ma Lin Carbon":                   80.0,
    "Ma Lin Extra Offensive":          75.0,
    "Ma Lin Extra Special":            70.0,
    "Sweden Carbo":                    85.0,
    "Extra Offensive":                 65.0,
}

# ─── Mise à jour des prix ─────────────────────────────────────────────────────

def update_prix_revetements():
    print("\n📦 Mise à jour des prix revêtements...")
    updated, skipped, not_found = 0, 0, 0

    for nom, prix in PRIX_REVETEMENTS.items():
        # Trouver le produit par nom
        res = sb.table("produits").select("id").ilike("nom", nom).limit(1).execute()
        if not res.data:
            print(f"  ⚠  Produit non trouvé : {nom}")
            not_found += 1
            continue

        produit_id = res.data[0]["id"]

        # Vérifier si un revêtement est lié
        rev = sb.table("revetements").select("id, prix").eq("produit_id", produit_id).limit(1).execute()
        if not rev.data:
            not_found += 1
            continue

        # Ne pas écraser un prix déjà renseigné
        if rev.data[0].get("prix") is not None:
            skipped += 1
            continue

        sb.table("revetements").update({"prix": prix}).eq("produit_id", produit_id).execute()
        print(f"  ✅ {nom} → {prix} €")
        updated += 1

    print(f"\n  Revêtements : {updated} mis à jour, {skipped} déjà renseignés, {not_found} non trouvés")


def update_prix_bois():
    print("\n🏏 Mise à jour des prix bois...")
    updated, skipped, not_found = 0, 0, 0

    for nom, prix in PRIX_BOIS.items():
        res = sb.table("produits").select("id").ilike("nom", nom).limit(1).execute()
        if not res.data:
            print(f"  ⚠  Produit non trouvé : {nom}")
            not_found += 1
            continue

        produit_id = res.data[0]["id"]

        bois = sb.table("bois").select("id, prix").eq("produit_id", produit_id).limit(1).execute()
        if not bois.data:
            not_found += 1
            continue

        if bois.data[0].get("prix") is not None:
            skipped += 1
            continue

        sb.table("bois").update({"prix": prix}).eq("produit_id", produit_id).execute()
        print(f"  ✅ {nom} → {prix} €")
        updated += 1

    print(f"\n  Bois : {updated} mis à jour, {skipped} déjà renseignés, {not_found} non trouvés")


if __name__ == "__main__":
    print("=" * 60)
    print("  Import des prix indicatifs — TT-Kip 2025")
    print("=" * 60)
    update_prix_revetements()
    update_prix_bois()
    print("\n✅  Terminé.")
