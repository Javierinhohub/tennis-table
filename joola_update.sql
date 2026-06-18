-- ══════════════════════════════════════════════════════════════════
-- Joola — Suppression + ré-insertion
-- ══════════════════════════════════════════════════════════════════

DELETE FROM tables_tt WHERE marque = 'Joola';

INSERT INTO tables_tt (marque, nom, slug, type, niveau, prix, actif) VALUES
  ('Joola', 'Aluterna + Housse',      'joola-aluterna',          'intérieur', 'club', 688.90, true),
  ('Joola', 'Outdoor Rally TL + Housse', 'joola-rally-tl-outdoor', 'extérieur', 'club', 608.90, true),
  ('Joola', 'J200A + Housse',         'joola-j200a',             'intérieur', 'club', 599.00, true);

-- Vérification
SELECT marque, nom, slug, type, niveau, prix FROM tables_tt WHERE marque = 'Joola';
