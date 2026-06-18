-- ══════════════════════════════════════════════════════════════════
-- Butterfly — Suppression + ré-insertion
-- ══════════════════════════════════════════════════════════════════

DELETE FROM tables_tt WHERE marque = 'Butterfly';

INSERT INTO tables_tt (marque, nom, slug, type, niveau, prix, actif) VALUES
  ('Butterfly', 'Centrefold 25', 'butterfly-centrefold-25', 'intérieur', 'compétition', 1295.00, true),
  ('Butterfly', 'Octet 25',      'butterfly-octet-25',      'intérieur', 'compétition', 1095.00, true),
  ('Butterfly', 'Space Saver 22','butterfly-space-saver-22','intérieur', 'club',          975.00, true);

-- Vérification
SELECT marque, nom, slug, type, niveau, prix FROM tables_tt WHERE marque = 'Butterfly';
