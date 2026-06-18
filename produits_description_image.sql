-- ══════════════════════════════════════════════════════════════════
-- Description éditoriale + image URL sur les produits
-- Exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- La colonne description existe peut-être déjà (admin/ajouter l'utilise)
ALTER TABLE produits ADD COLUMN IF NOT EXISTS description TEXT;

-- Image produit (URL externe)
ALTER TABLE produits ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Vérification
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'produits' ORDER BY ordinal_position;
