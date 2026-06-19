-- ══════════════════════════════════════════════════════════════════
-- FAQ produits — questions/réponses éditables depuis l'admin
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS faq_produits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produit_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  reponse    TEXT NOT NULL,
  ordre      INT  DEFAULT 0,
  cree_le    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_produit ON faq_produits(produit_id);
CREATE INDEX IF NOT EXISTS idx_faq_ordre   ON faq_produits(produit_id, ordre);

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE faq_produits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faq_public_read" ON faq_produits
  FOR SELECT USING (true);

CREATE POLICY "faq_admin_write" ON faq_produits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Vérification ──────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'faq_produits';
