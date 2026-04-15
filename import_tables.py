"""
import_tables.py — Import des tables de tennis de table pour TT-Kip
====================================================================
Prix moyens constatés sur le marché européen (2024-2025).
Sources : cornilleau.com, joola.de, stiga.com, decathlon.fr,
          sponeta.de, donic.com, butterfly-world.com, kettler.de

Prérequis — exécuter ce SQL dans Supabase avant de lancer le script :

    CREATE TABLE IF NOT EXISTS tables_tt (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      marque text NOT NULL,
      nom text NOT NULL,
      slug text UNIQUE NOT NULL,
      type text NOT NULL CHECK (type IN ('intérieur', 'extérieur')),
      niveau text NOT NULL DEFAULT 'loisir'
             CHECK (niveau IN ('loisir', 'club', 'compétition')),
      prix numeric(8,2),
      actif boolean DEFAULT true,
      cree_le timestamptz DEFAULT now()
    );
    ALTER TABLE tables_tt ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "tables_tt_public_read" ON tables_tt
      FOR SELECT USING (actif = true);
    CREATE POLICY "tables_tt_service_all" ON tables_tt
      FOR ALL USING (true);

Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=service_role_key python3 import_tables.py
"""

import os, re, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

def slugify(s):
    s = s.lower()
    s = re.sub(r"[àáâãäå]", "a", s)
    s = re.sub(r"[èéêë]", "e", s)
    s = re.sub(r"[ìíîï]", "i", s)
    s = re.sub(r"[òóôõö]", "o", s)
    s = re.sub(r"[ùúûü]", "u", s)
    s = re.sub(r"[ç]", "c", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

# ─── Référentiel tables (marque, nom, type, niveau, prix) ─────────────────────
# (marque, nom, 'intérieur'/'extérieur', 'loisir'/'club'/'compétition', prix)

TABLES = [

    # ══════════════════════════════════════════════════════════════════════════
    # CORNILLEAU — leader européen
    # ══════════════════════════════════════════════════════════════════════════
    # Intérieur
    ("Cornilleau", "Sport 100",               "intérieur", "loisir",      129.0),
    ("Cornilleau", "Sport 200",               "intérieur", "loisir",      199.0),
    ("Cornilleau", "Sport 300",               "intérieur", "loisir",      279.0),
    ("Cornilleau", "Sport 400",               "intérieur", "club",        379.0),
    ("Cornilleau", "Sport 500M",              "intérieur", "club",        479.0),
    ("Cornilleau", "Sport 600",               "intérieur", "club",        649.0),
    ("Cornilleau", "ITTF Pro 640",            "intérieur", "compétition", 899.0),
    ("Cornilleau", "ITTF Compact Expert",     "intérieur", "compétition", 999.0),
    ("Cornilleau", "One",                     "intérieur", "loisir",      499.0),
    ("Cornilleau", "Free 100",                "intérieur", "loisir",       99.0),
    # Extérieur
    ("Cornilleau", "Outdoor 100 Crossover",   "extérieur", "loisir",      199.0),
    ("Cornilleau", "Outdoor 200 Crossover",   "extérieur", "loisir",      299.0),
    ("Cornilleau", "Outdoor 300X",            "extérieur", "loisir",      399.0),
    ("Cornilleau", "Outdoor 400X",            "extérieur", "club",        499.0),
    ("Cornilleau", "Outdoor 500X",            "extérieur", "club",        649.0),
    ("Cornilleau", "Park",                    "extérieur", "loisir",      349.0),
    ("Cornilleau", "Game",                    "extérieur", "loisir",      249.0),
    ("Cornilleau", "Urban Crossover",         "extérieur", "loisir",      549.0),

    # ══════════════════════════════════════════════════════════════════════════
    # JOOLA — marque allemande de référence
    # ══════════════════════════════════════════════════════════════════════════
    # Intérieur
    ("Joola", "Midsize",       "intérieur", "loisir",      149.0),
    ("Joola", "Inside 15",     "intérieur", "loisir",      199.0),
    ("Joola", "Inside 16",     "intérieur", "loisir",      249.0),
    ("Joola", "Inside 18",     "intérieur", "club",        299.0),
    ("Joola", "Inside 22",     "intérieur", "club",        449.0),
    ("Joola", "Nova 100A",     "intérieur", "club",        499.0),
    ("Joola", "Nova 200A",     "intérieur", "club",        579.0),
    ("Joola", "Nova 500A",     "intérieur", "compétition", 629.0),
    ("Joola", "Nova Pro",      "intérieur", "compétition", 699.0),
    ("Joola", "Rapid Play 900","intérieur", "club",        349.0),
    # Extérieur
    ("Joola", "Weekend",           "extérieur", "loisir", 299.0),
    ("Joola", "City Outdoor",      "extérieur", "loisir", 399.0),
    ("Joola", "Nova DX Outdoor",   "extérieur", "club",   499.0),
    ("Joola", "Outdoor J500X",     "extérieur", "club",   669.0),

    # ══════════════════════════════════════════════════════════════════════════
    # STIGA — marque suédoise
    # ══════════════════════════════════════════════════════════════════════════
    # Intérieur
    ("Stiga", "Hobby",            "intérieur", "loisir",      149.0),
    ("Stiga", "Compact Expert",   "intérieur", "loisir",      249.0),
    ("Stiga", "Expert Roller",    "intérieur", "club",        299.0),
    ("Stiga", "Supreme",          "intérieur", "club",        499.0),
    ("Stiga", "Optimum 30",       "intérieur", "compétition", 799.0),
    ("Stiga", "Premium Compact",  "intérieur", "compétition", 699.0),
    # Extérieur
    ("Stiga", "Expert Outdoor",   "extérieur", "club",   349.0),
    ("Stiga", "Advance Outdoor",  "extérieur", "loisir", 249.0),

    # ══════════════════════════════════════════════════════════════════════════
    # SPONETA — marque allemande
    # ══════════════════════════════════════════════════════════════════════════
    # Intérieur
    ("Sponeta", "S1-72i",   "intérieur", "loisir",      199.0),
    ("Sponeta", "S1-73i",   "intérieur", "loisir",      249.0),
    ("Sponeta", "S2-72i",   "intérieur", "loisir",      299.0),
    ("Sponeta", "S3-46i",   "intérieur", "club",        399.0),
    ("Sponeta", "S4-72i",   "intérieur", "club",        499.0),
    ("Sponeta", "S5-72i",   "intérieur", "club",        649.0),
    ("Sponeta", "S6-87i",   "intérieur", "compétition", 849.0),
    ("Sponeta", "S7-63i",   "intérieur", "compétition", 699.0),
    # Extérieur
    ("Sponeta", "S1-73e",   "extérieur", "loisir", 299.0),
    ("Sponeta", "S3-47e",   "extérieur", "club",   349.0),
    ("Sponeta", "S5-73e",   "extérieur", "club",   449.0),
    ("Sponeta", "S7-93e",   "extérieur", "club",   549.0),

    # ══════════════════════════════════════════════════════════════════════════
    # DONIC — marque allemande
    # ══════════════════════════════════════════════════════════════════════════
    ("Donic", "Persson 700",         "intérieur", "loisir",      199.0),
    ("Donic", "Persson 800",         "intérieur", "club",        299.0),
    ("Donic", "Waldner 700",         "intérieur", "loisir",      199.0),
    ("Donic", "Waldner 800",         "intérieur", "club",        299.0),
    ("Donic", "Waldner 900",         "intérieur", "club",        399.0),
    ("Donic", "Waldner Classic 25",  "intérieur", "compétition", 749.0),
    ("Donic", "Waldner Premium 30",  "intérieur", "compétition", 849.0),
    ("Donic", "Delhi 25",            "intérieur", "compétition", 1149.0),

    # ══════════════════════════════════════════════════════════════════════════
    # TIBHAR — marque allemande
    # ══════════════════════════════════════════════════════════════════════════
    ("Tibhar", "D6",   "intérieur", "loisir",      249.0),
    ("Tibhar", "D9",   "intérieur", "loisir",      299.0),
    ("Tibhar", "D12",  "intérieur", "club",        399.0),
    ("Tibhar", "D15",  "intérieur", "club",        499.0),
    ("Tibhar", "D21",  "intérieur", "compétition", 699.0),

    # ══════════════════════════════════════════════════════════════════════════
    # BUTTERFLY — marque japonaise
    # ══════════════════════════════════════════════════════════════════════════
    ("Butterfly", "Octet 25",          "intérieur", "club",        499.0),
    ("Butterfly", "Centrefold 25",     "intérieur", "compétition", 699.0),
    ("Butterfly", "Centrefold 25 Blue","intérieur", "compétition", 799.0),
    ("Butterfly", "Playback Rollaway", "intérieur", "club",        749.0),
    ("Butterfly", "Space Rollaway",    "intérieur", "loisir",      349.0),

    # ══════════════════════════════════════════════════════════════════════════
    # PONGORI / ARTENGO (Decathlon)
    # ══════════════════════════════════════════════════════════════════════════
    # Intérieur
    ("Pongori", "PPT 100",     "intérieur", "loisir",  99.0),
    ("Pongori", "PPT 130",     "intérieur", "loisir", 129.0),
    ("Pongori", "PPT 230",     "intérieur", "loisir", 169.0),
    ("Pongori", "PPT 330",     "intérieur", "loisir", 229.0),
    ("Pongori", "PPT 500",     "intérieur", "club",   329.0),
    ("Pongori", "PPT 500.2",   "intérieur", "club",   399.0),
    ("Pongori", "PPT 530",     "intérieur", "club",   449.0),
    ("Pongori", "PPT 530.2",   "intérieur", "club",   499.0),
    ("Pongori", "FTT 900",     "intérieur", "compétition", 799.0),
    # Extérieur
    ("Pongori", "PPT 730 Outdoor",  "extérieur", "club",   399.0),
    ("Pongori", "FTT 500 Outdoor",  "extérieur", "club",   499.0),

    # ══════════════════════════════════════════════════════════════════════════
    # KETTLER — marque allemande
    # ══════════════════════════════════════════════════════════════════════════
    ("Kettler", "Campus",            "intérieur", "loisir",      199.0),
    ("Kettler", "Champ 3.0",         "intérieur", "loisir",      299.0),
    ("Kettler", "Champ 5.0",         "intérieur", "club",        399.0),
    ("Kettler", "Champ 7.0",         "intérieur", "club",        499.0),
    ("Kettler", "Stockholm Indoor",  "intérieur", "compétition", 699.0),
    # Extérieur
    ("Kettler", "Champ 7.0 Outdoor", "extérieur", "club",   599.0),
    ("Kettler", "Stockholm Outdoor", "extérieur", "club",   499.0),
    ("Kettler", "Palma Outdoor",     "extérieur", "loisir", 349.0),

    # ══════════════════════════════════════════════════════════════════════════
    # GEWO — marque allemande
    # ══════════════════════════════════════════════════════════════════════════
    ("Gewo", "Club Pro",            "intérieur", "club",        499.0),
    ("Gewo", "Competition Pro",     "intérieur", "compétition", 699.0),
    ("Gewo", "Premium Outdoor",     "extérieur", "club",        549.0),

    # ══════════════════════════════════════════════════════════════════════════
    # NITTAKU — marque japonaise
    # ══════════════════════════════════════════════════════════════════════════
    ("Nittaku", "Playback 22",  "intérieur", "club",        399.0),
    ("Nittaku", "Playback 25",  "intérieur", "compétition", 549.0),

    # ══════════════════════════════════════════════════════════════════════════
    # XIOM — marque coréenne
    # ══════════════════════════════════════════════════════════════════════════
    ("Xiom", "Centro S",   "intérieur", "club",        449.0),
    ("Xiom", "Centro L",   "intérieur", "compétition", 649.0),

    # ══════════════════════════════════════════════════════════════════════════
    # TORNEO — entrée de gamme
    # ══════════════════════════════════════════════════════════════════════════
    ("Torneo", "Smash",   "intérieur", "loisir", 79.0),
    ("Torneo", "Club",    "intérieur", "loisir", 129.0),
    ("Torneo", "Pro",     "intérieur", "club",   199.0),
]

# ─── Import ───────────────────────────────────────────────────────────────────

def main():
    print(f"\n🏓  Import de {len(TABLES)} tables de tennis de table...\n")
    inserted, updated, errors = 0, 0, 0

    for marque, nom, type_table, niveau, prix in TABLES:
        slug = slugify(f"{marque}-{nom}")
        payload = {
            "marque": marque,
            "nom": nom,
            "slug": slug,
            "type": type_table,
            "niveau": niveau,
            "prix": prix,
            "actif": True,
        }

        # Vérifier si la table existe déjà
        existing = sb.table("tables_tt").select("id").eq("slug", slug).execute()
        if existing.data:
            sb.table("tables_tt").update(payload).eq("slug", slug).execute()
            print(f"  🔄 Mis à jour : {marque} {nom} ({type_table}, {prix} €)")
            updated += 1
        else:
            res = sb.table("tables_tt").insert(payload).execute()
            if res.data:
                print(f"  ✅ Inséré    : {marque} {nom} ({type_table}, {prix} €)")
                inserted += 1
            else:
                print(f"  ❌ Erreur    : {marque} {nom}")
                errors += 1

    print(f"\n{'='*55}")
    print(f"  Résultat : {inserted} insérées, {updated} mises à jour, {errors} erreurs")
    print(f"{'='*55}\n")

if __name__ == "__main__":
    main()
