-- ============================================================
-- Ajout de la colonne image_url + peuplement des images
-- Exécuter dans Supabase → SQL Editor
-- ============================================================

ALTER TABLE tables_tt ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ========================
-- Cornilleau – Extérieur
-- ========================

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23525-xlarge_default/table-100x-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%100X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18439-xlarge_default/table-200x-outdoor-.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%200X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18461-xlarge_default/table-300x-outdoor-.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%300X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23539-xlarge_default/table-400x-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%400X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18518-xlarge_default/table-500x-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%500X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23547-xlarge_default/table-600x-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%600X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23551-xlarge_default/table-700x-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%700X%outdoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/19049-xlarge_default/table-instinct-outdoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%instinct%';

-- ========================
-- Cornilleau – Compétition ITTF
-- ========================

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18696-xlarge_default/540-ittf-table.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%540%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18670-xlarge_default/610-ittf-table.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%610%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/18633-xlarge_default/640-ittf-table.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%640%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23007-xlarge_default/table-740-ittf-2025.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%740%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/19435-xlarge_default/competition-850-wood-table-de-ping-pong-interieur.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%850%';

-- ========================
-- Cornilleau – Intérieur
-- ========================

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23697-xlarge_default/table-challenger-indoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%challenger%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23715-xlarge_default/table-100-indoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%100%indoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23726-xlarge_default/table-300-indoor-2025.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%300%indoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23736-xlarge_default/table-400-indoor-2025.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%400%indoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/23750-xlarge_default/table-500-indoor.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%500%indoor%';

UPDATE tables_tt SET image_url = 'https://fr.cornilleau.com/22932-xlarge_default/mini-table-de-ping-pong.jpg'
WHERE marque = 'Cornilleau' AND nom ILIKE '%mini%';

-- ========================
-- Pongori / Décathlon
-- ========================

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2272557/k$7d189c4fedeec3fdb583807cc6bf776d/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%PPT%530%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2272561/k$d08780fabfc81791e18a9f61b925a297/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%PPT%500%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2795278/k$c9f7ff213f3c7a04bceec703ff02b72a/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%PPT%900%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2795354/k$65a5e9cef269e9581153633c56284b0c/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%PPT%930%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2337385/k$c9fbfa23683e1f7d1cc8984267a0f075/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%130%outdoor%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2848048/k$45b8bd8f5fd6656b996a3f5b337cfbfc/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%130%medium%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2876580/k$878fd9d96c165af16052d4d39ba9a3a3/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%130%small%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2618701/k$748eba4a36125a19cb701e0662c663bf/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%TTT%130%';

UPDATE tables_tt SET image_url = 'https://contents.mediadecathlon.com/p2472648/k$d58a10a60beabe475c0d5320970b5186/picture.jpg'
WHERE marque = 'Pongori' AND nom ILIKE '%TTT%930%';
