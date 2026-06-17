-- ══════════════════════════════════════════════════════════════════
-- Cornilleau — Suppression + ré-insertion propre (avec colonne slug)
-- ══════════════════════════════════════════════════════════════════

-- 1. Supprimer toutes les tables Cornilleau existantes
DELETE FROM tables_tt WHERE marque = 'Cornilleau';

-- 2. Ré-insérer les 29 modèles avec slug + prix à jour
INSERT INTO tables_tt (marque, nom, slug, type, niveau, prix, actif) VALUES

  -- ── Intérieur ──────────────────────────────────────────────────
  ('Cornilleau', 'Mini table de ping-pong',        'cornilleau-mini-table',            'intérieur', 'loisir',      149.00,  true),
  ('Cornilleau', 'Table Challenger indoor',         'cornilleau-challenger-indoor',     'intérieur', 'loisir',      390.00,  true),
  ('Cornilleau', 'Table 100 indoor',                'cornilleau-table-100-indoor',      'intérieur', 'loisir',      450.00,  true),
  ('Cornilleau', 'Table 500 indoor',                'cornilleau-table-500-indoor',      'intérieur', 'club',        750.00,  true),
  ('Cornilleau', 'Table 540 ITTF',                  'cornilleau-table-540-ittf',        'intérieur', 'compétition', 950.00,  true),
  ('Cornilleau', 'Table 610 ITTF',                  'cornilleau-table-610-ittf',        'intérieur', 'compétition', 950.00,  true),
  ('Cornilleau', 'Table 640 ITTF',                  'cornilleau-table-640-ittf',        'intérieur', 'compétition', 1075.00, true),
  ('Cornilleau', 'Table 850-W ITTF',                'cornilleau-table-850w-ittf',       'intérieur', 'compétition', 1600.00, true),
  ('Cornilleau', 'Table de ping-pong Origin Move',  'cornilleau-origin-move',           'intérieur', 'compétition', 2490.00, true),

  -- ── Extérieur ──────────────────────────────────────────────────
  ('Cornilleau', 'Table INSTINCT outdoor',          'cornilleau-instinct-outdoor',      'extérieur', 'loisir',      519.00,  true),
  ('Cornilleau', 'Table 100X outdoor',              'cornilleau-table-100x-outdoor',    'extérieur', 'loisir',      535.00,  true),
  ('Cornilleau', 'Table Challenger outdoor',        'cornilleau-challenger-outdoor',    'extérieur', 'loisir',      540.00,  true),
  ('Cornilleau', 'Table 200X outdoor',              'cornilleau-table-200x-outdoor',    'extérieur', 'club',        600.00,  true),
  ('Cornilleau', 'Table 300X outdoor',              'cornilleau-table-300x-outdoor',    'extérieur', 'club',        680.00,  true),
  ('Cornilleau', 'Table 400X outdoor',              'cornilleau-table-400x-outdoor',    'extérieur', 'club',        760.00,  true),
  ('Cornilleau', 'Table Prestige outdoor',          'cornilleau-prestige-outdoor',      'extérieur', 'club',        799.00,  true),
  ('Cornilleau', 'Table BLACK CODE-ID 2 outdoor',  'cornilleau-black-code-id2-outdoor','extérieur', 'club',        799.00,  true),
  ('Cornilleau', 'Table 500X outdoor',              'cornilleau-table-500x-outdoor',    'extérieur', 'club',        950.00,  true),
  ('Cornilleau', 'Table 600X outdoor',              'cornilleau-table-600x-outdoor',    'extérieur', 'compétition', 1100.00, true),
  ('Cornilleau', 'Table 700X outdoor',              'cornilleau-table-700x-outdoor',    'extérieur', 'compétition', 1400.00, true),
  ('Cornilleau', 'Table de ping-pong Origin Medium outdoor', 'cornilleau-origin-medium-outdoor', 'extérieur', 'compétition', 1990.00, true),
  ('Cornilleau', 'Table de ping-pong Origin outdoor',        'cornilleau-origin-outdoor',         'extérieur', 'compétition', 2190.00, true),
  ('Cornilleau', 'Table de ping Hyphen outdoor gris noir',   'cornilleau-hyphen-outdoor-gris',     'extérieur', 'compétition', 2590.00, true),
  ('Cornilleau', 'Table de ping Hyphen outdoor blanc',       'cornilleau-hyphen-outdoor-blanc',    'extérieur', 'compétition', 2590.00, true),

  -- ── Collectivités ───────────────────────────────────────────────
  ('Cornilleau', 'Table 510 CAMPUS Outdoor',        'cornilleau-510-campus-outdoor',    'extérieur', 'club',        1200.00, true),
  ('Cornilleau', 'Table Pro 540 outdoor',           'cornilleau-pro-540-outdoor',       'extérieur', 'compétition', 1200.00, true),
  ('Cornilleau', 'Table 740 LONGLIFE',              'cornilleau-740-longlife',          'extérieur', 'compétition', 1550.00, true),
  ('Cornilleau', 'Table Urban outdoor',             'cornilleau-urban-outdoor',         'extérieur', 'compétition', 2000.00, true),
  ('Cornilleau', 'Table Park outdoor',              'cornilleau-park-outdoor',          'extérieur', 'compétition', 2600.00, true);

-- 3. Vérification
SELECT marque, nom, slug, type, niveau, prix
FROM tables_tt
WHERE marque = 'Cornilleau'
ORDER BY type, niveau, prix;
