-- ══════════════════════════════════════════════════════════════════
-- Pongori (Decathlon) — Insertion de 13 tables
-- ══════════════════════════════════════════════════════════════════

INSERT INTO tables_tt (marque, nom, slug, type, niveau, prix, actif) VALUES

  -- ── Intérieur ──────────────────────────────────────────────────
  ('Pongori', 'PPT 100 Small Indoor',       'pongori-ppt-100-small-indoor',       'intérieur', 'loisir',       39.99,  true),
  ('Pongori', 'PPT 130 Small Indoor.2',     'pongori-ppt-130-small-indoor-2',     'intérieur', 'loisir',       79.99,  true),
  ('Pongori', 'PPT 130 Medium Indoor',      'pongori-ppt-130-medium-indoor',      'intérieur', 'loisir',      149.99,  true),
  ('Pongori', 'TTT 130.2 Indoor',           'pongori-ttt-130-2-indoor',           'intérieur', 'club',        379.99,  true),
  ('Pongori', 'TTT 930 Indoor ITTF',        'pongori-ttt-930-indoor-ittf',        'intérieur', 'compétition', 699.99,  true),

  -- ── Extérieur ──────────────────────────────────────────────────
  ('Pongori', 'PPT 130 Outdoor',            'pongori-ppt-130-outdoor',            'extérieur', 'loisir',      299.99,  true),
  ('Pongori', 'PPT 500 Outdoor Medium',     'pongori-ppt-500-outdoor-medium',     'extérieur', 'loisir',      298.99,  true),
  ('Pongori', 'PPT 530 Outdoor Medium.2',   'pongori-ppt-530-outdoor-medium-2',   'extérieur', 'loisir',      299.99,  true),
  ('Pongori', 'PPT 500.2 Outdoor',          'pongori-ppt-500-2-outdoor',          'extérieur', 'loisir',      399.99,  true),
  ('Pongori', 'PPT 530.2 Outdoor',          'pongori-ppt-530-2-outdoor',          'extérieur', 'club',        499.99,  true),
  ('Pongori', 'PPT 900.2 Outdoor',          'pongori-ppt-900-2-outdoor',          'extérieur', 'club',        599.99,  true),
  ('Pongori', 'PPT 930.2 Outdoor',          'pongori-ppt-930-2-outdoor',          'extérieur', 'club',        649.99,  true);

-- Vérification
SELECT marque, nom, slug, type, niveau, prix
FROM tables_tt
WHERE marque = 'Pongori'
ORDER BY type, niveau, prix;
