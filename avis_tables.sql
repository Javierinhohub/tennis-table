-- ══════════════════════════════════════════════════════════════════
-- Avis sur les tables de tennis de table
-- Exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- 1. Ajouter la colonne table_id (nullable) dans avis
ALTER TABLE avis ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES tables_tt(id) ON DELETE CASCADE;

-- 2. Index unique : un seul avis par utilisateur par table
CREATE UNIQUE INDEX IF NOT EXISTS un_avis_par_table
  ON avis (table_id, user_id)
  WHERE table_id IS NOT NULL;

-- 3. Vérification
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'avis' ORDER BY ordinal_position;
