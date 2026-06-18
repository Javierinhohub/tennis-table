-- ══════════════════════════════════════════════════════════════════
-- Liens revendeurs Cornilleau (site officiel fr.cornilleau.com)
-- ══════════════════════════════════════════════════════════════════

-- 1. Supprimer les liens Cornilleau existants (évite les doublons)
DELETE FROM tables_tt_liens
WHERE table_id IN (SELECT id FROM tables_tt WHERE marque = 'Cornilleau')
  AND revendeur = 'Cornilleau';

-- 2. Insérer tous les liens en un seul INSERT
INSERT INTO tables_tt_liens (table_id, revendeur, url)
SELECT DISTINCT ON (c.url) t.id, 'Cornilleau', c.url
FROM (VALUES
  ('%mini%',             'https://fr.cornilleau.com/tables-d-interieur/2987-mini-table-de-ping-pong.html'),
  ('%100%indoor%',       'https://fr.cornilleau.com/tables-d-interieur/2355-table-100-indoor.html'),
  ('%challenger%indoor%','https://fr.cornilleau.com/tables-d-interieur/2921-table-challenger-indoor.html'),
  ('%500%indoor%',       'https://fr.cornilleau.com/tables-d-interieur/2354-7953-table-500-indoor.html'),
  ('%instinct%outdoor%', 'https://fr.cornilleau.com/tables-d-exterieur/2365-table-instinct-outdoor.html'),
  ('%prestige%outdoor%', 'https://fr.cornilleau.com/tables-d-exterieur/2729-table-prestige-outdoor.html'),
  ('%100X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1959-2208-table-100x-outdoor.html'),
  ('%challenger%outdoor%','https://fr.cornilleau.com/tables-d-exterieur/1968-table-challenger-outdoor.html'),
  ('%200X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1960-2210-table-200x-outdoor-.html'),
  ('%300X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1961-2212-table-300x-outdoor-.html'),
  ('%400X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1962-2214-table-400x-outdoor.html'),
  ('%black%code%',       'https://fr.cornilleau.com/tables-d-exterieur/2461-9893-table-black-code-id-outdoor-2-.html'),
  ('%500X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1963-2216-table-500x-outdoor.html'),
  ('%600X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1964-2218-table-600x-outdoor.html'),
  ('%700X%outdoor%',     'https://fr.cornilleau.com/tables-d-exterieur/1965-table-700x-outdoor.html'),
  ('%540%ITTF%',         'https://fr.cornilleau.com/tables-de-competition/1876-540-ittf-table.html'),
  ('%610%ITTF%',         'https://fr.cornilleau.com/tables-de-competition/1877-610-ittf-table.html'),
  ('%640%ITTF%',         'https://fr.cornilleau.com/tables-de-competition/1878-640-ittf-table.html'),
  ('%850%',              'https://fr.cornilleau.com/tables-de-competition/20-2228-competition-850-wood-table-de-ping-pong-interieur.html'),
  ('%740%',              'https://fr.cornilleau.com/tables-de-collectivites/1879-740-longlife.html'),
  ('%510%campus%',       'https://fr.cornilleau.com/tables-de-collectivites/2876-15420-table-510-campus-outdoor-2025.html'),
  ('%pro 540%',          'https://fr.cornilleau.com/tables-de-collectivites/2721-table-pro-540-outdoor-new-2024.html'),
  ('%urban%',            'https://fr.cornilleau.com/tables-de-collectivites/2920-table-urban-outdoor.html'),
  ('%park%',             'https://fr.cornilleau.com/tables-de-collectivites/49-86-pro-park-table-de-ping-pong-exterieure.html')
) AS c(pattern, url)
JOIN tables_tt t ON t.marque = 'Cornilleau' AND t.nom ILIKE c.pattern
ORDER BY c.url, t.id;

-- 3. Vérification
SELECT t.nom, l.url
FROM tables_tt_liens l
JOIN tables_tt t ON t.id = l.table_id
WHERE t.marque = 'Cornilleau' AND l.revendeur = 'Cornilleau' AND l.actif = true
ORDER BY t.nom;
