-- ══════════════════════════════════════════════════════════════════
-- Associations TT-Kip entre produits (revêtements ↔ bois)
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS associations_produits (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produit_id         UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  produit_associe_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  commentaire        TEXT,                          -- ex: "Idéal pour le topspin"
  cree_le            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (produit_id, produit_associe_id),
  CHECK  (produit_id <> produit_associe_id)
);

CREATE INDEX IF NOT EXISTS idx_assoc_produit         ON associations_produits(produit_id);
CREATE INDEX IF NOT EXISTS idx_assoc_produit_associe ON associations_produits(produit_associe_id);

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE associations_produits ENABLE ROW LEVEL SECURITY;

-- Lecture publique (affiché sur les fiches produit)
CREATE POLICY "associations_public_read" ON associations_produits
  FOR SELECT USING (true);

-- Écriture réservée aux admins
CREATE POLICY "associations_admin_write" ON associations_produits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Vérification ──────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'associations_produits';
