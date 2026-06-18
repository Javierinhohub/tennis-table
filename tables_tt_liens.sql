-- ══════════════════════════════════════════════════════════════════
-- Création de la table tables_tt_liens
-- ══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tables_tt_liens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id    UUID NOT NULL REFERENCES tables_tt(id) ON DELETE CASCADE,
  revendeur   TEXT NOT NULL,   -- ex: 'Cornilleau', 'Amazon', 'TT11'
  url         TEXT NOT NULL,
  actif       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index pour accélérer les jointures
CREATE INDEX IF NOT EXISTS idx_tables_tt_liens_table_id ON tables_tt_liens(table_id);

-- ══════════════════════════════════════════════════════════════════
-- Exemple d'insertion (à adapter avec les vrais IDs)
-- ══════════════════════════════════════════════════════════════════
-- Pour ajouter un lien, récupère d'abord l'ID de la table :
--   SELECT id, nom FROM tables_tt WHERE marque = 'Cornilleau' AND nom = 'Table 540 ITTF';
-- Puis insère :
--   INSERT INTO tables_tt_liens (table_id, revendeur, url) VALUES
--     ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Cornilleau', 'https://fr.cornilleau.com/...');

-- ══════════════════════════════════════════════════════════════════
-- Pour voir tous les liens d'une marque
-- ══════════════════════════════════════════════════════════════════
-- SELECT t.nom, l.revendeur, l.url
-- FROM tables_tt_liens l
-- JOIN tables_tt t ON t.id = l.table_id
-- WHERE t.marque = 'Cornilleau'
-- ORDER BY t.nom, l.revendeur;
