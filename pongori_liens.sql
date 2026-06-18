-- ══════════════════════════════════════════════════════════════════
-- Liens revendeurs Pongori (Decathlon)
-- ══════════════════════════════════════════════════════════════════

-- 1. Supprimer les liens Decathlon existants pour Pongori
DELETE FROM tables_tt_liens
WHERE table_id IN (SELECT id FROM tables_tt WHERE marque = 'Pongori')
  AND revendeur = 'Decathlon';

-- 2. Insérer tous les liens en un seul INSERT
INSERT INTO tables_tt_liens (table_id, revendeur, url)
SELECT DISTINCT ON (c.url) t.id, 'Decathlon', c.url
FROM (VALUES
  ('%PPT%530%',        'https://www.decathlon.fr/p/table-de-ping-pong-exterieure-ppt-530-2-grise/324873/c4c3m8583715'),
  ('%PPT%500%',        'https://www.decathlon.fr/p/table-de-ping-pong-exterieure-ppt-500-2-bleue/324825/m8583712'),
  ('%PPT%900%',        'https://www.decathlon.fr/p/table-de-ping-pong-exterieure-ppt-900-2-grise/323924/m8579044'),
  ('%PPT%930%',        'https://www.decathlon.fr/p/table-de-ping-pong-exterieure-ppt-930-2-noire/352116/m8862640'),
  ('%PPT%130%outdoor%','https://www.decathlon.fr/p/table-de-ping-pong-exterieur-ppt-130-bleue/311792/c5m8558266'),
  ('%130%medium%',     'https://www.decathlon.fr/p/table-de-ping-pong-ppt-130-medium-indoor-black/348955/m8931353'),
  ('%130%small%',      'https://www.decathlon.fr/p/table-de-ping-pong-ppt-130-small-indoor-black/324720/m8931428'),
  ('%TTT%130%',        'https://www.decathlon.fr/p/table-de-tennis-de-table-interieure-compacte-avec-filet-innovant-ttt-130-2-bleu/342265/m8750295'),
  ('%TTT%930%',        'https://www.decathlon.fr/p/table-de-tennis-de-table-interieure-compacte-competition-ittf-ttt-930-noir/324990/c381m8584579')
) AS c(pattern, url)
JOIN tables_tt t ON t.marque = 'Pongori' AND t.nom ILIKE c.pattern
ORDER BY c.url, t.id;

-- 3. Vérification
SELECT t.nom, l.url
FROM tables_tt_liens l
JOIN tables_tt t ON t.id = l.table_id
WHERE t.marque = 'Pongori' AND l.revendeur = 'Decathlon' AND l.actif = true
ORDER BY t.nom;
