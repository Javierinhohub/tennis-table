-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Catalogue Tibhar complet
-- (hors Evolution MX-P, MX-S, EL-P et Hybrid K3 déjà faits)
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE EVOLUTION (versions restantes)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tibhar Evolution FX-P ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Evolution FX-P est la version à mousse souple du flagship Evolution MX-P. Tout en conservant la même géométrie de picots optimisée pour la puissance et la vitesse directe, il propose une mousse ProTension à plus faible dureté, qui rend ce revêtement beaucoup plus accessible aux joueurs ne disposant pas encore d'une frappe très appuyée.

Grâce à cette souplesse, le FX-P offre un confort supplémentaire dans les échanges : le timing est plus permissif, les touches légères reviennent avec davantage de précision, et la fatigue s'installe moins vite lors des longues séances. La vitesse est légèrement en retrait par rapport au MX-P standard, mais la régularité et le placement gagnent considérablement.

Ce revêtement est particulièrement recommandé aux joueurs de niveau régional à national qui veulent progresser vers un jeu offensif affirmé sans se heurter à la rigidité d'une mousse très dure. Il peut également convenir en revers chez des joueurs avancés recherchant plus de feeling dans les contre-jeux et les blocs actifs.

L'Evolution FX-P reste fidèle à l'identité de la gamme : un revêtement allemand de haute qualité, taillé pour la compétition, avec la signature ProTension qui a fait la réputation de Tibhar. Une porte d'entrée idéale dans l'univers Evolution pour les joueurs encore en progression.$desc$
WHERE nom ILIKE '%Evolution FX-P%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Evolution FX-S ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Evolution FX-S est la variante souple et spin-orientée de la gamme Evolution. Associant la mousse à faible dureté du FX avec le topsheet axé rotation du MX-S, il propose le profil le plus accessible et le plus enveloppant de toute la famille Evolution — idéal pour les joueurs soucieux de la qualité de leurs effets sur balle sans vouloir subir la contrainte d'une mousse ferme.

Sa mousse ProTension souple procure un feeling doux et enveloppant à l'impact, permettant de développer un topspin lent et très chargé en sécurité, ou des lifts de récupération réguliers depuis la mi-distance. La vitesse est la plus modérée de la gamme, ce qui favorise le contrôle et la mise en place tactique plutôt que les contre-attaques explosives.

Le FX-S convient parfaitement aux joueurs polyvalents qui accordent la priorité à la rotation sur la vitesse, ou aux joueurs jouant un style moderne basé sur la construction du point et la variation d'effets. En revers, il est appréciable pour les lifts de sécurité et les services très chargés.

Pour les joueurs qui souhaitent entrer dans l'univers Tibhar en douceur, l'Evolution FX-S représente un point de départ très solide. Sa tolérance élevée et ses qualités de spin en font l'un des revêtements de progression les plus complets disponibles dans la gamme.$desc$
WHERE nom ILIKE '%Evolution FX-S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Evolution EL-S ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Evolution EL-S combine la géométrie de picots Extra Large (EL) — avec leurs têtes élargies et leur surface de contact accrue — au profil axé rotation du suffixe S. Résultat : un revêtement qui maximise l'adhérence sur le ballon tout en offrant la tolérance supérieure caractéristique de la série EL, pour un profil spin-control très équilibré.

Les picots EL du Tibhar Evolution EL-S génèrent un effet "grip étendu" à l'impact, permettant de mieux enrouler autour de la balle et de produire des rotations généreuses même dans les frappes moins techniques ou les sorties de duel difficiles. Par rapport au MX-S, l'EL-S offre un timing plus souple et une tolérance accrue, au prix d'une légère perte d'explosivité.

Ce revêtement est particulièrement adapté aux joueurs qui construisent leurs points par la rotation et le placement plutôt que par l'accélération directe. Il excelle dans les topspins de construction à haute rotation, les ouvertures sur balle coupée et les lifts de récupération. Sa marge à l'erreur élevée en fait également un excellent outil pédagogique pour les joueurs en apprentissage du topspin.

Pour les joueurs de niveau intermédiaire à avancé cherchant un revêtement à la fois exigeant dans ses résultats et pardonnable dans son utilisation, l'Evolution EL-S représente un choix très judicieux au sein de la gamme Tibhar.$desc$
WHERE nom ILIKE '%Evolution EL-S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Evolution MX-D ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Evolution MX-D est le modèle le plus puissant et le plus exigeant de la gamme Evolution. Le "D" de son nom désigne "Duo Tension", une technologie de double tension qui pousse encore plus loin l'effet catapulte de la mousse ProTension : le topsheet et la mousse sont tous deux tendus sous haute pression, créant une réserve d'énergie explosive libérée à chaque frappe appuyée.

Avec une dureté de mousse très élevée, le MX-D s'adresse exclusivement aux joueurs avancés à élite capables de frapper fort et avec une technique précise. Entre les mains d'un joueur de haut niveau, il délivre une vitesse et une rotation parmi les plus élevées du marché européen, avec une trajectoire très tendue et une pénétration dans le camp adverse redoutable.

En contrepartie, sa marge d'erreur est très faible : les frappes hésitantes ou imprécises sont immédiatement sanctionnées. Ce revêtement demande un engagement physique total à chaque coup et une technique solide pour en tirer le meilleur parti. Il n'est pas recommandé en dessous du niveau national.

L'Evolution MX-D occupe une place unique dans la gamme Tibhar : au sommet de la puissance. Pour les compétiteurs qui ont déjà atteint leurs limites avec le MX-P et cherchent à passer un cap supplémentaire dans l'intensité de jeu, c'est l'aboutissement logique de la gamme Evolution.$desc$
WHERE nom ILIKE '%Evolution MX-D%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE HYBRID (versions restantes)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tibhar Hybrid K1 ─────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Hybrid K1 est l'entrée en matière offensive de la gamme Hybrid, conçu pour les joueurs qui souhaitent bénéficier de la polyvalence de la technologie hybride de Tibhar dans un profil orienté vitesse et réactivité. Sans topsheet collant à la différence du K3, le K1 s'inscrit dans la tradition des revêtements européens non-tacky, tout en intégrant une mousse hybride à fort potentiel catapulte.

Sa mousse hybride développée par Tibhar offre une réponse explosive aux frappes directes, un timing court et une vitesse de départ élevée. Le topsheet du K1 garantit un bon niveau de rotation sans atteindre les extrêmes du K3 collant, ce qui le rend plus polyvalent et accessible à un plus grand nombre de styles de jeu. Il peut être utilisé aussi bien en coup droit qu'en revers par des joueurs pratiquant un jeu offensif percutant.

Ce revêtement convient aux attaquants proches de la table qui cherchent des accélérations nettes, un jeu de contre rapide et des smashes décisifs. Sa réponse directe en fait un outil efficace dans les échanges à haut rythme, où chaque dixième de seconde compte. Il est moins adapté aux joueurs qui construisent des topspins depuis la mi-distance.

Pour les joueurs souhaitant découvrir la gamme Hybrid Tibhar sans les contraintes techniques du topsheet tacky du K3, le K1 représente un excellent point d'entrée. Un revêtement honnête, puissant et direct.$desc$
WHERE nom ILIKE '%Hybrid K1%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Hybrid K2 ─────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Hybrid K2 se positionne à mi-chemin entre le K1 orienté vitesse et le K3 à topsheet collant, proposant le meilleur équilibre rotation-vitesse de la gamme Hybrid. Sa mousse hybride de dureté intermédiaire et son topsheet non-tacky avec un grip légèrement supérieur au K1 en font un revêtement polyvalent, aussi à l'aise dans les topspins croisés que dans les accélérations directes.

La technologie hybride Tibhar du K2 génère une réponse dynamique à la frappe, une trajectoire intermédiaire entre le tendu et le liftant, et une capacité à varier le jeu selon les exigences tactiques. Il est conçu pour les joueurs complets qui ne veulent pas se spécialiser dans un seul registre, et qui cherchent un revêtement capable de s'adapter à différentes situations de jeu.

Le K2 est souvent choisi par les joueurs qui ont essayé le K3 mais qui trouvent le topsheet collant trop contraignant, ou par ceux qui viennent du K1 et souhaitent gagner en rotation. Son profil équilibré lui permet de s'intégrer naturellement dans de nombreuses configurations de raquette, en coup droit comme en revers.

Dans la gamme Hybrid, le K2 incarne l'idée de polyvalence : assez rapide pour rythmer les échanges, assez rotatif pour construire des topspins efficaces. Un revêtement solide pour les compétiteurs qui veulent tout sans compromis.$desc$
WHERE nom ILIKE '%Hybrid K2%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ═══════════════════════════════════════════════════════════════════
-- MK PRO
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tibhar MK Pro ────────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar MK Pro représente le haut de gamme de la lignée MK de Tibhar, conçu pour les compétiteurs exigeants qui recherchent une combinaison optimale de vitesse, rotation et contrôle dans un revêtement tensor premium. Fabriqué avec les dernières avancées en matière de mousse et de topsheet, il s'inscrit dans la philosophie Tibhar de revêtements de haute performance accessibles aux joueurs sérieux.

Sa mousse à haute densité et son topsheet aux propriétés dynamiques avancées permettent de générer une rotation importante et une vitesse catapulte élevée, tout en conservant une marge de contrôle appréciable. Le MK Pro brille particulièrement dans les topspins ouverts puissants, les contre-boucles accélérées et le jeu à mi-distance où la précision et la puissance doivent coexister.

Ce revêtement s'adresse aux joueurs de niveau national à international qui souhaitent bénéficier des technologies les plus récentes de Tibhar sans le profil extrême des gammes hybrides ou du MX-D. Il est utilisable aussi bien en coup droit qu'en revers, s'adaptant à différentes morphologies de jeu.

Tibhar a construit sa réputation sur la qualité de fabrication allemande et l'innovation continue dans la composition de ses revêtements. Le MK Pro en est une illustration moderne, combinant tradition du savoir-faire européen et performance de niveau élite pour les compétiteurs les plus ambitieux.$desc$
WHERE nom ILIKE '%MK Pro%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ═══════════════════════════════════════════════════════════════════
-- QUANTUM X PRO
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tibhar Quantum X Pro ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Quantum X Pro est l'un des revêtements les plus performants jamais produits par la marque allemande. Intégrant la technologie Quantum X — une mousse à cellules ouvertes de nouvelle génération avec une réactivité et un effet catapulte exceptionnels — il se positionne comme l'alternative Tibhar aux revêtements Butterfly Dignics dans le segment ultra-premium.

Sa mousse Quantum à très haute performance délivre une vitesse explosive et une rotation généreuse à chaque frappe appuyée. Le topsheet spécialement conçu pour le ballon plastique 40+ garantit une adhérence optimale dans toutes les conditions de jeu, qu'il s'agisse des topspins ouverts depuis la mi-distance ou des contre-boucles rapprochées. La trajectoire est à la fois puissante et régulière, avec un arc qui se situe entre le très liftant du Tibhar MX-S et le tendu du MX-P.

Ce revêtement s'adresse aux joueurs de niveau élite ou aux compétiteurs sérieux qui ont atteint les limites de la gamme Evolution et cherchent un échelon supplémentaire de performance. Sa dureté élevée exige une technique solide et une frappe franche pour révéler pleinement son potentiel.

Face à des références comme le Butterfly Dignics 05 ou le Donic Acuda S1 Turbo, le Quantum X Pro se présente comme une alternative sérieuse portant la qualité allemande Tibhar au plus haut niveau international. Un revêtement pour joueurs qui ne font aucun compromis sur la performance.$desc$
WHERE (nom ILIKE '%Quantum X Pro%' OR nom ILIKE '%Quantum XPro%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Quantum XS ────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Quantum XS est la version spin-et-contrôle de la gamme Quantum, offrant les qualités technologiques de la mousse Quantum dans un profil moins axé sur la vitesse brute et davantage sur la construction des points par la rotation et la régularité. C'est le pendant polyvalent du Quantum X Pro, pensé pour les joueurs qui veulent la puissance Quantum dans un profil plus accessible.

Sa mousse Quantum à cellules ouvertes reste réactive et dynamique, mais son topsheet aux propriétés plus axées spin génère des topspins très chargés et une meilleure tolérance dans les échanges difficiles. La trajectoire est plus liftée que celle du Quantum X Pro, avec un arc plus élevé qui favorise la sécurité dans les topspins de récupération.

Le Quantum XS convient aux joueurs qui pratiquent un style basé sur la construction du point, la variation de rythme et les topspins dévastateurs plutôt que sur l'accélération directe. Il est appréciable aussi bien en coup droit qu'en revers, s'adaptant à des morphologies de jeu variées.

Dans la hiérarchie Tibhar, le Quantum XS se situe au-dessus de la gamme Evolution S tout en restant légèrement en dessous du Quantum X Pro en termes de puissance brute. Un revêtement de haut niveau, technique et récompensant, pour les compétiteurs ambitieux.$desc$
WHERE (nom ILIKE '%Quantum XS%' OR nom ILIKE '%Quantum X S%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ═══════════════════════════════════════════════════════════════════
-- GRASS D.TECS (picots longs)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tibhar Grass D.Tecs ──────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Grass D.Tecs est l'un des revêtements à picots longs les plus populaires au monde, utilisé par d'innombrables défenseurs et joueurs combinés à tous les niveaux. Son nom évocateur ("Grass" pour l'aspect d'un gazon artificiel) illustre parfaitement la forêt de picots longs et fins qui caractérisent ce revêtement et lui confèrent ses propriétés perturbatrices uniques.

Ses picots longs et très souples génèrent des effets imprévisibles à la réception : les topspins adverses reviennent avec un effet coupé ou neutre, les balles coupées peuvent revenir légèrement liftées, et les frappes sans effet flottent de manière déstabilisante. Cette capacité à "casser" le rythme de l'adversaire en fait l'un des outils tactiques les plus redoutés en compétition, y compris aux plus hauts niveaux.

Disponible en plusieurs versions (avec mousse fine, mousse épaisse, ou OX sans mousse), le Grass D.Tecs permet aux joueurs d'ajuster le niveau de contrôle et de perturbation selon leur style. La version OX maximise la disruptivité, tandis que les versions avec mousse facilitent le placement et les contre-attaques occasionnelles.

Tibhar a su développer avec le Grass D.Tecs une signature reconnue dans le monde des picots longs : une qualité de fabrication rigoureuse, des effets cohérents et une durabilité éprouvée. Que ce soit entre les mains d'un défenseur pur ou d'un joueur combiné, il reste une référence incontournable dans cette catégorie.$desc$
WHERE nom ILIKE '%Grass D%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Specter ───────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Specter est un revêtement à picots courts (short pips) conçu pour les joueurs pratiquant un style de jeu rapide et percutant, basé sur le blocage agressif, le coup droit direct et le contre-jeu proche de la table. Contrairement aux revêtements lisses classiques, ses picots courts lui confèrent un comportement légèrement différent à la réception des effets : les rotations adverses sont partiellement "effacées", ce qui facilite les reprises directes et les blocs actifs.

La surface du Specter génère une trajectoire tendue et rectiligne, avec peu de lift propre mais une réponse directe et explosive aux frappes appuyées. Cela en fait l'outil privilégié des joueurs recherchant la vitesse pure et l'impact direct, notamment les penholdeurs classiques ou les joueurs qui pratiquent l'attaque de balle coupée à plat.

Le Specter convient également aux joueurs défensifs ou perturbateurs qui souhaitent utiliser les picots courts en revers pour simplifier la gestion des effets adverses tout en conservant la capacité d'attaquer de temps à autre. Sa relative neutralité par rapport aux revêtements lisses en fait un outil tactique intéressant dans les duels à fort topspin.

Dans le catalogue Tibhar, le Specter occupe une niche précise — les picots courts — souvent méconnue des joueurs qui n'ont pas encore exploré cette catégorie. Pour ceux qui cherchent une alternative aux revêtements lisses classiques avec plus de neutralisation des effets, c'est une option à découvrir.$desc$
WHERE nom ILIKE '%Specter%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Aurus ─────────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Tibhar Aurus est l'une des séries tensor les plus durables et les plus appréciées de la marque allemande, ayant accompagné de nombreux joueurs compétiteurs à travers les années. Précurseur de la gamme Evolution dans le catalogue Tibhar, il a contribué à établir la réputation de la marque dans le domaine des revêtements tensor de haute qualité.

Sa technologie tensor offre une réponse dynamique à la frappe, un bon niveau de rotation et une vitesse appréciable pour un revêtement de sa génération. Sa mousse à tension interne procure un effet catapulte reconnaissable et une trajectoire relativement liftée, adaptée au jeu topspin moderne. La qualité de fabrication Tibhar garantit une régularité dans les performances et une durabilité reconnue.

L'Aurus existe en plusieurs variantes de dureté et de profil (Prime, Select, Sound selon les versions disponibles), permettant aux joueurs de trouver la configuration adaptée à leur style et leur niveau. Il est généralement positionné en dessous de la gamme Evolution en termes de performance pure, mais offre un rapport qualité-prix très attractif.

Pour les joueurs de niveau club à régional cherchant un revêtement tensor allemand fiable et performant sans le prix des gammes premium, l'Aurus reste une référence solide. Une valeur sûre dans le catalogue Tibhar, éprouvée par des années de compétition.$desc$
WHERE nom ILIKE '%Aurus%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- Vérification — produits Tibhar et statut des descriptions
SELECT
  nom,
  CASE
    WHEN description IS NOT NULL AND description != '' THEN 'OK ✓'
    ELSE 'manquant'
  END AS statut,
  LEFT(description, 80) AS apercu
FROM produits
WHERE marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar')
ORDER BY nom;
