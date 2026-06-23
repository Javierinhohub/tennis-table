-- ══════════════════════════════════════════════════════════════════
-- Mise à jour description — Butterfly Zyre 03
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

UPDATE produits
SET description = 'Le Zyre 03 associe le topsheet « Ricosheet » — picots plats et serrés, haute résistance à l''abrasion — à une mousse Spring Sponge X extra-épaisse. Le Code de picots n° 303 combine puissance et rotation pour produire des frappes arquées qui s''enfoncent profondément dans le camp adverse. Idéal pour les attaquants qui veulent dominer l''échange par la puissance et l''effet.'
WHERE nom ILIKE '%Zyre 03%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE '%Butterfly%' LIMIT 1);

-- Vérification
SELECT nom, description FROM produits WHERE nom ILIKE '%Zyre 03%';
