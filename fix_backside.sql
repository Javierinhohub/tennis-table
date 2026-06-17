-- ══════════════════════════════════════════════════════════════════
-- Supprimer " — Backside" des noms de revêtements dans produits
-- ══════════════════════════════════════════════════════════════════

-- 1. Aperçu des lignes concernées (exécuter d'abord pour vérifier)
SELECT id, nom
FROM produits
WHERE nom LIKE '% — Backside'
   OR nom LIKE '% - Backside'
ORDER BY nom;

-- ══════════════════════════════════════════════════════════════════

-- 2. Correction (exécuter après vérification)
UPDATE produits
SET nom = TRIM(REGEXP_REPLACE(nom, '\s*[—\-]+\s*Backside\s*$', '', 'i'))
WHERE nom ~* 'Backside$';
