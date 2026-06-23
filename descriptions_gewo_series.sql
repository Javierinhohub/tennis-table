-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Catalogue Gewo complet
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE NEXXUS (flagship offensif)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Gewo Nexxus EL Pro 48 ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Nexxus EL Pro 48 est le revêtement le plus emblématique de la marque allemande, souvent cité comme l'un des meilleurs rapports qualité-prix du marché dans le segment des revêtements tensor haut de gamme. Fabriqué en Allemagne avec une mousse à 48° et la technologie EL (Extra Large pips), il s'adresse aux joueurs offensifs de niveau avancé à compétition qui veulent de la performance sans le prix des grandes marques japonaises.

Sa mousse dure à 48° garantit une réponse explosive et catapultante à chaque frappe appuyée. L'effet de tension interne propre aux revêtements Gewo amplifie la vitesse de départ et la rotation générée, plaçant le Nexxus EL Pro 48 dans le haut du peloton des revêtements tensor européens. Sa trajectoire est puissante et relativement tendue, idéale pour les contre-topspins accélérés et le jeu à haute cadence.

Ce revêtement est particulièrement apprécié en coup droit par les attaquants pratiquant un jeu offensif modern, mais il se défend également très bien en revers pour les joueurs qui frappent fort. Sa relative accessibilité tarifaire par rapport au Tenergy ou au Dignics en fait l'un des choix privilégiés des compétiteurs sérieux qui raisonnent rapport performance-prix.

Le Nexxus EL Pro 48 a contribué à installer Gewo dans le paysage des marques de référence en Europe. Un revêtement solide, honnête et performant, qui ne déçoit jamais les joueurs qui savent l'activer.$desc$
WHERE nom ILIKE '%Nexxus EL Pro 48%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo Nexxus EL Pro 50 ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Nexxus EL Pro 50 est la version encore plus dure et plus explosive du Nexxus EL Pro, avec une dureté de mousse portée à 50°. Destiné aux joueurs les plus puissants et les plus techniques, il pousse encore plus loin les qualités catapultantes de la gamme Nexxus pour livrer l'une des performances les plus élevées du catalogue Gewo.

À 50°, la mousse du Nexxus EL Pro 50 exige une frappe franche et assurée pour s'exprimer pleinement. En contrepartie, les frappes puissantes sont récompensées par une vitesse de sortie remarquable et une rotation très générée, le tout avec la trajectoire tendue caractéristique de la gamme. Le timing court et l'explosivité de ce revêtement en font un outil redoutable dans les contre-topspins et les finales d'échanges.

Ce revêtement s'adresse aux joueurs de niveau national à international qui ont les capacités physiques et techniques pour exploiter une mousse très dure. Les joueurs moins puissants ou en dessous de ce niveau auront davantage à gagner avec le Nexxus EL Pro 48, plus accessible sans sacrifier les performances fondamentales de la gamme.

Face aux Tibhar Evolution MX-D ou Butterfly Dignics 64, le Nexxus EL Pro 50 se présente comme une alternative sérieuse à prix compétitif. Un revêtement d'expert pour les compétiteurs qui exigent le maximum de leurs équipements.$desc$
WHERE nom ILIKE '%Nexxus EL Pro 50%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo Nexxus EL Pro 48 Soft ───────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Nexxus EL Pro 48 Soft (ou version souple) est la variante à mousse moins contraignante du flagship Nexxus, permettant à un plus grand nombre de joueurs de profiter des qualités techniques de la gamme EL Pro sans la rigidité d'une mousse très dure. En réduisant la dureté, Gewo rend ce revêtement accessible aux compétiteurs de niveau régional et aux joueurs dont la frappe est moins puissante.

La mousse plus souple offre une fenêtre de timing élargie, un feeling plus enveloppant à l'impact et une régularité accrue dans les échanges. La vitesse est légèrement en retrait par rapport à la version 48° standard, mais la rotation et la trajectoire restent de très bonne facture. Ce compromis en fait un revêtement particulièrement efficace en revers, où le contrôle et la sensibilité priment souvent sur la puissance brute.

Cette version convient aux joueurs souhaitant progresser vers un matériel plus exigeant sans subir la contrainte immédiate d'une mousse dure. Elle peut aussi servir de revêtement de transition avant d'adopter le Nexxus EL Pro 48 standard, une fois la frappe suffisamment développée pour en tirer le plein potentiel.

Gewo propose ainsi une gamme Nexxus pensée pour tous les profils : le 48 Soft pour l'entrée dans l'univers EL Pro, le 48 pour le niveau compétition standard, et le 50 pour l'élite. Un continuum logique et bien construit.$desc$
WHERE (nom ILIKE '%Nexxus EL Pro%' AND (nom ILIKE '%Soft%' OR nom ILIKE '%soft%'))
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo Nexxus XT Pro 48 ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Nexxus XT Pro 48 est une évolution de la gamme Nexxus qui introduit une nouvelle géométrie de picots (XT pour eXTra) offrant un profil de jeu légèrement différent du EL Pro. Là où l'EL Pro maximise l'énergie transmise à chaque frappe franche, le XT Pro affiche un comportement plus linéaire et une trajectoire subtilement différente, apprécié des joueurs cherchant un autre feeling tout en restant dans l'univers Nexxus.

Avec une dureté de 48°, le XT Pro 48 partage la fermeté caractéristique de la gamme, garantissant une réponse explosive aux frappes appuyées et un effet catapulte de bonne qualité. Sa technologie de tension interne propre à Gewo est pleinement présente, assurant vitesse et rotation au niveau attendu dans ce segment de prix.

Ce revêtement s'adresse aux joueurs offensifs de niveau avancé qui souhaitent explorer une variante de la gamme Nexxus ou qui cherchent une alternative au EL Pro dans le même registre de performance. Il peut également convenir aux joueurs qui ont testé le EL Pro et souhaitent essayer une sensation légèrement différente sans quitter l'univers Gewo.

Dans le catalogue Gewo, le XT Pro 48 coexiste avec le EL Pro 48 comme deux expressions différentes du même niveau de performance. Un choix de connaisseur, pour les pongistes qui savent exactement ce qu'ils cherchent dans un revêtement.$desc$
WHERE nom ILIKE '%Nexxus XT Pro 48%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE HYPE (polyvalent)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Gewo Hype EL Pro 47.5 ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Hype EL Pro 47.5 est l'un des revêtements les plus populaires de la marque allemande, régulièrement cité parmi les meilleures alternatives aux Tibhar Evolution dans le segment des revêtements tensor compétition. Avec une dureté de mousse de 47.5°, il propose un équilibre très réussi entre puissance, rotation et tolérance, accessible à un large spectre de niveaux.

Sa mousse légèrement moins dure que le Nexxus EL Pro 48 lui confère un comportement plus polyvalent : la fenêtre de timing est plus généreuse, les frappes moins appuyées restent efficaces, et le revêtement s'adapte à davantage de styles de jeu sans sacrifier les performances globales. La vitesse catapulte est excellente et la rotation généreuse, avec une trajectoire liftée appréciable dans les topspins de construction.

Ce revêtement convient particulièrement aux joueurs de niveau régional à national qui veulent un matériel de haut niveau polyvalent, aussi bien adapté au coup droit qu'au revers. Son profil équilibré en fait un excellent choix pour les joueurs qui ne veulent pas se spécialiser dans un style unique.

Le rapport qualité-prix du Hype EL Pro 47.5 est l'un de ses arguments majeurs : il rivalise avec des revêtements bien plus onéreux en termes de performance pure, tout en restant accessible pour la majorité des compétiteurs sérieux. Une des valeurs sûres incontournables du catalogue Gewo.$desc$
WHERE nom ILIKE '%Hype EL Pro 47.5%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo Hype KR Pro 47.5 ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Hype KR Pro 47.5 est la variante rotation-orientée de la série Hype, conçue pour les joueurs qui construisent leur jeu autour de la production d'effets intenses et de topspins très chargés. Le suffixe KR (Kick Rotation) traduit l'intention du revêtement : maximiser la rotation à l'impact pour des topspins dévastateurs et des services très chargés.

Partageant la même dureté de 47.5° que le Hype EL Pro, le KR Pro s'en distingue par la géométrie de ses picots, optimisée pour un grip supérieur sur le ballon. L'énergie rotationnelle générée est parmi les plus élevées de la gamme Gewo, avec une trajectoire plus liftée et un arc plus prononcé que le EL Pro. Cette différence est particulièrement visible dans les topspins de récupération depuis la mi-distance et les services très tournés.

Ce revêtement s'adresse aux joueurs offensifs qui pratiquent un jeu de topspin construit, avec une préférence pour la rotation sur la vitesse. Il est particulièrement efficace pour les joueurs qui jouent à mi-distance et qui cherchent à dominer l'échange par la qualité de leurs effets plutôt que par l'accélération directe.

Le Hype KR Pro 47.5 complète parfaitement la gamme Hype aux côtés du EL Pro : là où l'EL Pro cherche la polyvalence, le KR Pro opte pour la spécialisation dans la rotation. Un choix très cohérent pour les joueurs dont le topspin est l'arme principale.$desc$
WHERE nom ILIKE '%Hype KR Pro 47.5%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE MX (entrée de gamme compétition)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Gewo MX Smash ────────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo MX Smash est le revêtement d'entrée dans l'univers compétition de Gewo, pensé pour les joueurs qui cherchent un revêtement tensor accessible tout en bénéficiant du savoir-faire de la marque allemande. Positionné en dessous des gammes Nexxus et Hype, il offre une performance solide pour le niveau club à régional sans l'exigence technique des modèles haut de gamme.

Sa mousse tensor de dureté modérée procure une bonne réactivité à la frappe, une vitesse appréciable et une rotation correcte pour son prix. Le comportement est prévisible et régulier, ce qui facilite l'apprentissage et la mise en pratique des coups offensifs de base. Le Gewo MX Smash est un revêtement honnête qui tient ses promesses sans surprendre dans un sens ou dans l'autre.

Ce revêtement s'adresse aux joueurs de niveau débutant-intermédiaire à régional qui souhaitent progresser vers un jeu offensif structuré. Il peut aussi servir de revêtement de rechange ou d'entraînement pour des joueurs de niveau supérieur qui ne veulent pas user leurs revêtements premium à l'entraînement.

Dans la hiérarchie Gewo, le MX Smash représente le point d'entrée vers le monde des tensors allemands. Pour les joueurs qui souhaitent découvrir la philosophie Gewo avant d'investir dans un Hype ou un Nexxus, c'est une introduction parfaite et abordable.$desc$
WHERE nom ILIKE '%MX Smash%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo MX Synaptic ─────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo MX Synaptic est un revêtement tensor de milieu de gamme proposant un profil équilibré entre vitesse et rotation, conçu pour les joueurs en progression cherchant un matériel fiable et polyvalent. Sa mousse tensor de dureté intermédiaire et son topsheet aux propriétés bien calibrées en font un revêtement accessible mais sérieux, à mi-chemin entre les revêtements d'initiation et les modèles haut de gamme.

Sa réponse à la frappe est dynamique sans être contraignante : le timing est généreux, la trajectoire est correctement liftée et la régularité est au rendez-vous dans les échanges de moyenne intensité. Le Gewo MX Synaptic convient aussi bien pour les topspins construits que pour les blocs actifs et les jeux de table, incarnant la polyvalence comme valeur première.

Ce revêtement cible les joueurs de niveau club à régional qui cherchent à progresser dans un style offensif moderne. Sa tolérance le rend également intéressant pour les joueurs plus avancés qui veulent un revêtement de rechange ou d'entraînement fiable sans sacrifier complètement la qualité de jeu.

Le MX Synaptic illustre bien la philosophie Gewo à ce niveau de gamme : proposer des revêtements sérieux, fabriqués avec soin, à des prix accessibles au plus grand nombre. Une option solide pour les pongistes qui ne veulent pas faire de compromis sur la qualité sans pour autant investir dans le très haut de gamme.$desc$
WHERE nom ILIKE '%MX Synaptic%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ═══════════════════════════════════════════════════════════════════
-- REVÊTEMENTS DÉFENSIFS / PICOTS
-- ═══════════════════════════════════════════════════════════════════

-- ─── Gewo Proton Neo (picots courts) ──────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Proton Neo est un revêtement à picots courts (short pips) orienté vers le jeu offensif rapide et le blocage actif. Ses picots courts lui confèrent des propriétés particulières : les effets adverses sont partiellement neutralisés à la réception, facilitant les reprises directes et les blocs agressifs, tout en permettant des attaques plates à trajectoire tendue et très rapide.

Sa mousse solide associée aux picots courts génère une réponse directe et explosive à la frappe. Le Proton Neo est particulièrement efficace dans les échanges rapprochés, les reprises de topspin à plat et les contre-attaques directes sur balles chargées adverses. La trajectoire produite est rasante et difficile à lire pour l'adversaire, ce qui crée naturellement des opportunités de déstabilisation.

Ce revêtement s'adresse aux joueurs pratiquant le style dit "penhold classique", aux bloqueurs agressifs, ou à tous ceux qui cherchent à simplifier la gestion des effets adverses en revers tout en conservant une capacité d'attaque directe. Sa neutralisation partielle des rotations adverses est un atout tactique précieux dans les matchs à fort topspin.

Dans l'offre Gewo, le Proton Neo illustre la capacité de la marque à proposer des solutions pour tous les styles de jeu, au-delà des seuls revêtements lisses offensifs. Un choix atypique et récompensant pour les joueurs qui osent sortir des sentiers battus.$desc$
WHERE nom ILIKE '%Proton Neo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ─── Gewo Long Defense (picots longs) ────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo Long Defense est le revêtement à picots longs de la gamme Gewo, conçu pour les joueurs défensifs et les joueurs combinés cherchant à perturber le rythme adverse par des retours imprévisibles et des effets modifiés. Fidèle à la philosophie de la marque, ce revêtement associe une qualité de fabrication allemande rigoureuse à des performances perturbatrices solides.

Ses picots longs et souples génèrent les effets caractéristiques des longues picots : les topspins adverses reviennent avec un effet coupé ou neutre, les balles coupées peuvent revenir légèrement liftées, et les balles sans effet flottent de manière déstabilisante. La régularité dans la production de ces effets est une marque de fabrique Gewo, permettant aux joueurs de développer un jeu tactique cohérent et reproductible.

Disponible avec ou sans mousse selon les configurations, le Gewo Long Defense permet d'ajuster le niveau de perturbation et de contrôle selon le style du joueur. La version sans mousse (OX) maximise l'effet perturbateur, tandis que les versions avec mousse fine offrent davantage de régularité et facilitent les placements.

Pour les défenseurs ou joueurs combinés qui cherchent une alternative aux références du marché (Butterfly Feint Long, Tibhar Grass D.Tecs) avec la qualité européenne Gewo, ce revêtement représente une option très sérieuse à un prix souvent plus accessible.$desc$
WHERE (nom ILIKE '%Long Defense%' OR nom ILIKE '%Gewo%Long%')
  AND nom NOT ILIKE '%Short%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE NANO (technologie nano-composite)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Gewo New SpinDynamics ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Gewo New SpinDynamics est un revêtement tensor axé sur la rotation, conçu pour les joueurs qui privilégient la production d'effets importants sur balle à une vitesse maîtrisée. Son nom illustre son positionnement : la dynamique de spin est au cœur de sa conception, avec un topsheet et une mousse optimisés pour maximiser l'adhérence et la transmission d'énergie rotationnelle à chaque impact.

Sa mousse tensor de dureté modérée et son topsheet à grip élevé génèrent des topspins généreux et réguliers, avec une trajectoire bien liftée et une bonne tolérance dans les frappes moins parfaites. Ce revêtement excelle dans les ouvertures sur balle coupée, les topspins de construction à haute rotation et les services très chargés — tout ce qui demande d'abord de l'effet avant la vitesse.

Ce revêtement s'adresse aux joueurs de niveau club à régional qui travaillent leur jeu de topspin et cherchent un matériel qui valorise la rotation. Sa tolérance élevée le rend également pertinent pour les joueurs moins expérimentés en cours d'apprentissage du topspin moderne.

Le New SpinDynamics s'inscrit dans la tradition Gewo de proposer des revêtements spécialisés à prix abordable, permettant aux joueurs de tous niveaux de trouver l'outil adapté à leur style sans se ruiner. Un choix judicieux pour les joueurs dont la rotation est l'arme principale.$desc$
WHERE nom ILIKE '%SpinDynamics%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo');

-- Vérification — produits Gewo et statut des descriptions
SELECT
  nom,
  CASE
    WHEN description IS NOT NULL AND description != '' THEN 'OK ✓'
    ELSE 'manquant'
  END AS statut,
  LEFT(description, 70) AS apercu
FROM produits
WHERE marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Gewo')
ORDER BY nom;
