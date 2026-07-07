-- ══════════════════════════════════════════════════════════════════
-- Table perfometre_submissions — Perf-o-mètre TT-Kip
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS perfometre_submissions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  cree_le     TIMESTAMPTZ DEFAULT NOW(),
  prenom      TEXT        NOT NULL,
  nom         TEXT        NOT NULL,
  instagram   TEXT,
  age         INT         NOT NULL CHECK (age >= 8 AND age <= 99),
  points_debut INT        NOT NULL CHECK (points_debut >= 1000),
  points_fin   INT        NOT NULL CHECK (points_fin >= 1000),
  score        DECIMAL(8,1) NOT NULL,
  token        TEXT        UNIQUE DEFAULT gen_random_uuid()::TEXT,
  publie       BOOLEAN     DEFAULT TRUE
);

-- Index pour accélérer les lookups par token
CREATE INDEX IF NOT EXISTS idx_perfometre_token ON perfometre_submissions(token);

-- RLS
ALTER TABLE perfometre_submissions ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut insérer (pas d'auth requise pour participer)
CREATE POLICY "perfometre_public_insert" ON perfometre_submissions
  FOR INSERT WITH CHECK (true);

-- Seul le service_role (API server-side) peut lire et mettre à jour
-- Les requêtes passent toutes par supabaseAdmin côté serveur

-- Vérification
SELECT 'Table perfometre_submissions créée' AS statut;
