-- Supprimer toutes les tables sauf Pongori, Cornilleau, Joola, Butterfly
DELETE FROM tables_tt
WHERE marque NOT IN ('Pongori', 'Cornilleau', 'Joola', 'Butterfly');

-- Vérification
SELECT marque, COUNT(*) AS nb
FROM tables_tt
GROUP BY marque
ORDER BY marque;
