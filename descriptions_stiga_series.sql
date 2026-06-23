-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Catalogue Stiga complet
-- (hors Calibra LT Sound et Mantra M/H/S déjà faits)
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE DNA PRO (flagship actuel)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Stiga DNA Pro M ──────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Pro M est le revêtement phare de la marque suédoise depuis son lancement, et l'un des revêtements tensor les plus salués par la critique en Europe. Élu meilleur revêtement de l'année à plusieurs reprises par des magazines spécialisés, il incarne la synthèse des ambitions de Stiga : un revêtement de niveau élite, polyvalent et accessible à un large spectre de joueurs.

Sa mousse DNA à dureté Medium (environ 42,5°) offre le meilleur équilibre de la trilogie M/H/S : assez de puissance pour les topspins agressifs, assez de souplesse pour le contrôle et la sensibilité dans les échanges techniques. Le topsheet spécialement développé pour le ballon plastique 40+ garantit un grip exceptionnel et une rotation parmi les plus élevées de sa catégorie, rivalisant avec les références japonaises à un prix significativement plus abordable.

Utilisé par plusieurs membres de l'équipe de Suède et de nombreux joueurs de l'élite européenne, le DNA Pro M convient aussi bien en coup droit qu'en revers pour les joueurs pratiquant un jeu topspin moderne à toutes distances. Sa trajectoire bien liftée, sa régularité et sa tolérance à l'erreur élevée en font un revêtement "de référence" que l'on peut recommander sans hésiter à tout compétiteur sérieux.

Pour les joueurs qui cherchent une alternative crédible au Butterfly Tenergy 05 ou au Tibhar Evolution MX-P, le Stiga DNA Pro M est souvent cité en première position. Une réussite complète.$desc$
WHERE nom ILIKE '%DNA Pro M%'
  AND nom NOT ILIKE '%Hard%'
  AND nom NOT ILIKE '%Soft%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga DNA Pro H ──────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Pro H est la version Hard (dure) de la gamme DNA Pro, conçue pour les joueurs les plus puissants et les plus techniques qui souhaitent pousser les performances du DNA au maximum. Avec une mousse plus ferme que le DNA Pro M, il offre une vitesse catapulte supérieure et une réponse encore plus explosive aux frappes appuyées, au prix d'une tolérance réduite.

Sa mousse DNA à dureté élevée répond idéalement aux frappes franches et puissantes : les topspins croisés deviennent plus pénétrants, les contre-boucles plus incisives et le jeu en général plus intense. Le grip exceptionnel du topsheet DNA Pro est pleinement préservé, garantissant une rotation de haut niveau même dans les situations de jeu les plus rapides.

Ce revêtement s'adresse aux joueurs de niveau national à international, habitués à des mousses fermes et capables d'exploiter la puissance d'un revêtement exigeant. Les joueurs moins puissants ou moins techniques auront généralement davantage à gagner avec le DNA Pro M, plus accessible sans perdre grand-chose en termes de qualité pure.

Le DNA Pro H est souvent utilisé en coup droit par les joueurs qui souhaitent maximiser la puissance de leur attaque, tout en maintenant le DNA Pro M en revers pour plus de contrôle. Une combinaison populaire parmi les compétiteurs qui explorent les possibilités de la gamme Stiga DNA.$desc$
WHERE (nom ILIKE '%DNA Pro H%' OR (nom ILIKE '%DNA Pro%' AND nom ILIKE '%Hard%'))
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga DNA Pro S ──────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Pro S est la version Soft (souple) de la trilogie DNA Pro, destinée aux joueurs qui privilégient la touche, la sensibilité et la régularité sur la puissance brute. Avec sa mousse moins ferme que le DNA Pro M, il offre un feeling plus enveloppant, une fenêtre de timing élargie et une tolérance à l'erreur supérieure, rendant les performances DNA Pro accessibles à un plus grand nombre de profils.

Malgré sa souplesse, le DNA Pro S conserve l'essentiel de ce qui fait l'identité de la gamme : un topsheet à grip exceptionnel, une rotation généreuse et la qualité de fabrication suédoise de Stiga. La vitesse est modérée par rapport au M et au H, mais la régularité dans les topspins de construction et la précision dans les placements sont souvent supérieures.

Ce revêtement convient particulièrement aux joueurs de niveau intermédiaire à avancé qui cherchent à progresser vers un style topspin moderne sans la contrainte d'une mousse dure. Il est également très apprécié en revers par des joueurs de haut niveau, qui préfèrent une mousse plus souple pour mieux sentir les effets adverses et répondre avec précision dans les duels techniques.

Pour les joueurs qui souhaitent découvrir la gamme DNA Pro en douceur, ou ceux qui cherchent un revêtement de revers particulièrement agréable et efficace, le DNA Pro S représente une excellente porte d'entrée.$desc$
WHERE (nom ILIKE '%DNA Pro S%' OR (nom ILIKE '%DNA Pro%' AND nom ILIKE '%Soft%'))
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga DNA Dragon Grip ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Dragon Grip est la variante à topsheet collant (tacky) de la gamme DNA, s'inspirant de la philosophie des revêtements asiatiques tout en intégrant la technologie de mousse suédoise de Stiga. Ce revêtement hybride réunit l'adhérence extrême d'un topsheet tacky — caractéristique de l'école chinoise — avec la réactivité catapultante de la mousse DNA, pour un profil de jeu unique et très complet.

Son topsheet collant génère des rotations exceptionnelles sur les services, une capacité à "tenir" le ballon en début de frappe et des topspins très chargés que les adversaires peinent à renvoyer proprement. Comparé aux revêtements tacky asiatiques classiques (comme le DHS Hurricane), le Dragon Grip bénéficie de la mousse DNA plus réactive, offrant davantage de catapulte native et de vitesse sans traitement préalable.

Ce revêtement demande une adaptation technique, notamment pour les joueurs habitués aux revêtements européens non-collants. La gestion du topsheet collant dans les services et les topspins exige un apprentissage progressif, mais les possibilités offertes en termes de rotation et de variation sont considérables.

Le DNA Dragon Grip s'adresse aux joueurs expérimentés qui souhaitent explorer le style sino-européen, améliorer leur court jeu ou simplement disposer d'une arme redoutable sur les services. Un revêtement exigeant mais récompensant, qui illustre parfaitement la capacité de Stiga à innover au-delà de ses traditions européennes.$desc$
WHERE nom ILIKE '%DNA Dragon Grip%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga DNA Future M / H / S ───────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Future est la génération la plus récente de la gamme DNA, représentant l'état de l'art de la technologie Stiga pour le jeu avec le ballon plastique moderne. Disponible en trois duretés (M, H, S), il fait évoluer la formule du DNA Pro avec une mousse de nouvelle génération et un topsheet repensé pour maximiser encore davantage la rotation et la dynamique de jeu.

La mousse DNA Future intègre des avancées dans la structure cellulaire et la composition chimique de l'élastomère, offrant une réponse plus explosive et une durabilité améliorée par rapport au DNA Pro. Le topsheet conserve le grip exceptionnel de la gamme tout en améliorant la transmission d'énergie à l'impact, pour des topspins encore plus pénétrants et une trajectoire plus mordante.

Chaque déclinaison de dureté conserve la logique de la gamme DNA : le H pour les attaquants puissants cherchant le maximum de vitesse et de pénétration, le M pour l'équilibre parfait convenant à la majorité des compétiteurs, et le S pour ceux qui privilégient le feeling et la régularité sur la puissance brute.

Le DNA Future positionne Stiga comme un acteur majeur du marché premium, capable de rivaliser avec les Butterfly Dignics ou les Tibhar Quantum X Pro. Pour les joueurs qui cherchent le summum de la technologie suédoise, c'est aujourd'hui l'aboutissement de la gamme DNA.$desc$
WHERE nom ILIKE '%DNA Future%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga DNA Platinum M / H / S ─────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga DNA Platinum représente le niveau intermédiaire de la gamme DNA, entre la version Pro et la Future. Conçu pour offrir les performances DNA à un prix légèrement plus accessible, il intègre la technologie DNA dans une formule très polyvalente, pensée pour les compétiteurs réguliers qui cherchent fiabilité et performance sur le long terme.

Sa mousse DNA Platinum offre une réactivité de très bonne facture, une rotation généreuse et une trajectoire bien liftée dans les topspins. Le topsheet est conçu pour un grip constant dans toutes les conditions de jeu, qu'il s'agisse de matchs en salle sèche ou humide. La durabilité est une qualité reconnue de cette version, ce qui en fait un choix économiquement avantageux sur la durée.

Disponible lui aussi en trois déclinaisons de dureté (M, H, S), le DNA Platinum s'adapte à tous les profils : le H pour les attaquants puissants, le M pour les joueurs polyvalents, et le S pour ceux qui cherchent le confort et la régularité. La logique de gamme est identique à celle du DNA Pro, avec des performances globalement légèrement en dessous mais un tarif attractif.

Pour les joueurs qui souhaitent jouer la gamme DNA sans l'investissement du Pro ou du Future, le Platinum constitue une alternative honnête et très compétitive. Une entrée recommandée dans l'écosystème DNA de Stiga.$desc$
WHERE nom ILIKE '%DNA Platinum%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE AIROC ASTRO
-- ═══════════════════════════════════════════════════════════════════

-- ─── Stiga Airoc Astro M ──────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Airoc Astro M est le revêtement de milieu de gamme de Stiga, introduisant la technologie Airoc — une mousse à structure cellulaire allégée qui améliore la réactivité sans alourdir le revêtement. Positionné en dessous de la gamme DNA Pro, il offre un niveau de performance très respectable pour les joueurs de niveau club à régional, avec la qualité de fabrication suédoise de Stiga.

La mousse Airoc de dureté Medium procure une réponse dynamique et agréable à la frappe, une bonne rotation dans les topspins et une trajectoire bien liftée adaptée au jeu topspin moderne. Sa tolérance élevée et son comportement prévisible en font un revêtement particulièrement apprécié des joueurs en progression qui cherchent à affiner leur technique sans être trop limités par leur matériel.

L'Airoc Astro M est aussi bien adapté en coup droit qu'en revers, ce qui en fait un choix naturel pour les joueurs qui cherchent une solution polyvalente sur les deux côtés de la raquette. Sa régularité dans les échanges et sa facilité de prise en main le rendent accessible à un niveau de jeu intermédiaire tout en offrant une marge de progression.

Pour les joueurs qui souhaitent entrer dans l'univers Stiga avec un revêtement moderne et performant sans l'investissement d'un DNA Pro, l'Airoc Astro M représente une porte d'entrée idéale et très bien positionnée.$desc$
WHERE nom ILIKE '%Airoc Astro M%'
  AND nom NOT ILIKE '%Hard%'
  AND nom NOT ILIKE '%Soft%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Airoc Astro S ──────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Airoc Astro S est la version Soft de la gamme Airoc Astro, pensée pour les joueurs qui recherchent avant tout le confort, la régularité et la sensibilité dans leurs échanges. Sa mousse Airoc plus souple que le modèle M offre une fenêtre de timing généreuse, un feeling doux et enveloppant, et une tolérance à l'erreur encore plus élevée.

Cette souplesse accrue rend l'Airoc Astro S particulièrement adapté aux joueurs débutants ou en progression qui travaillent leur technique de topspin. Elle convient aussi très bien aux joueurs plus avancés qui souhaitent un revêtement de revers confortable, permettant de bien sentir les effets adverses et de répondre avec précision dans les échanges lents à modérés.

La rotation produite est appréciable pour ce niveau de gamme, avec une trajectoire bien liftée facilitant la mise en place tactique. Le revêtement pardonne davantage les frappes imparfaites que le modèle M, ce qui favorise l'apprentissage des gestes fondamentaux offensifs sans découragement.

Dans la hiérarchie Airoc Astro, le S occupe la position la plus accessible, sans jamais compromettre la qualité Stiga. Pour les pongistes qui découvrent le jeu topspin moderne ou qui cherchent un revers agréable à jouer, c'est un choix très bien pensé.$desc$
WHERE nom ILIKE '%Airoc Astro S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Airoc Astro H ──────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Airoc Astro H est la version Hard de la gamme Airoc Astro, apportant plus de puissance et d'explosivité au profil déjà bien équilibré de cette série. Sa mousse Airoc plus ferme augmente la vitesse catapulte et l'intensité des frappes, le positionnant comme le choix privilégié des joueurs offensifs dynamiques qui souhaitent un revêtement de milieu de gamme plus mordant.

Avec la dureté la plus élevée de la série Airoc Astro, le modèle H exige une frappe plus engagée pour s'exprimer pleinement. En contrepartie, les topspins puissants gagnent en pénétration, les contre-boucles en explosivité, et le jeu global prend un caractère plus incisif. La trajectoire est légèrement plus tendue que sur le M, ce qui convient aux joueurs qui préfèrent un jeu direct et rythmé.

Ce revêtement s'adresse aux joueurs de niveau régional à national qui ont une frappe développée et souhaitent exploiter la technologie Airoc à son plein potentiel. Il peut également servir de tremplin avant d'adopter un DNA Pro M pour les joueurs en pleine progression.

L'Airoc Astro H complète logiquement la trilogie de la gamme et assure que chaque joueur puisse trouver dans la série Airoc la dureté exactement adaptée à son niveau et à son style.$desc$
WHERE nom ILIKE '%Airoc Astro H%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE CALIBRA (versions restantes)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Stiga Calibra LT ─────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Calibra LT est le revêtement fondateur de la série Calibra Long Trajectory de Stiga, conçu pour les joueurs offensifs qui pratiquent un jeu avec beaucoup d'arc et de profondeur dans leurs topspins. Son nom résume parfaitement sa philosophie : générer des trajectoires longues et hautes, particulièrement efficaces contre les défenseurs et dans les échanges à mi-distance.

Sa mousse souple et son topsheet à bon grip favorisent un enroulement généreux autour de la balle, produisant des topspins très liftés qui retombent profondément dans le camp adverse. Cette trajectoire haute est particulièrement difficile à défendre pour les joueurs non habitués, et offre une grande marge de sécurité pour les joueurs qui construisent leurs points depuis loin de la table.

La tolérance élevée du Calibra LT en fait un excellent revêtement de progression ou d'initiation au jeu topspin long. Sa douceur à l'impact et sa régularité permettent de développer des gestes propres et de travailler la technique sans être constamment sanctionné par des fautes directes.

Le Calibra LT se décline en plusieurs versions (Plus, Sound, Tour) selon les besoins du joueur, mais dans sa version de base, il reste une référence accessible et fiable dans le catalogue Stiga. Un revêtement honnête, durables et bien pensé pour le développement du jeu topspin.$desc$
WHERE nom ILIKE '%Calibra LT%'
  AND nom NOT ILIKE '%Sound%'
  AND nom NOT ILIKE '%Plus%'
  AND nom NOT ILIKE '%Tour%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Calibra LT Plus ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Calibra LT Plus est la version améliorée du Calibra LT, offrant des performances supérieures grâce à une mousse plus réactive et un topsheet au grip renforcé. Cette évolution conserve les qualités fondamentales de la série — la longue trajectoire liftée et la tolérance élevée — tout en ajoutant une dimension catapultante plus affirmée qui rapproche ce revêtement du niveau compétition.

Sa mousse plus réactive que le Calibra LT standard génère une vitesse de sortie supérieure à rotation égale, permettant aux topspins liftés d'être non seulement profonds mais aussi plus pénétrants. Cette combinaison de hauteur de trajectoire et de vitesse accrue est particulièrement efficace dans les échanges à distance, où le joueur cherche à dominer par l'arme de la rotation profonde.

Le Calibra LT Plus convient aux joueurs de niveau intermédiaire à avancé qui ont déjà développé leur technique de topspin et souhaitent un revêtement plus exigeant que le Calibra LT standard sans aller jusqu'à la gamme Mantra ou DNA. C'est une progression naturelle au sein de la famille Calibra.

Pour les joueurs qui aiment jouer loin de la table avec beaucoup d'effet et recherchent un revêtement qui valorise cette philosophie de jeu, le Calibra LT Plus représente l'un des choix les plus cohérents du catalogue Stiga.$desc$
WHERE nom ILIKE '%Calibra LT Plus%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Calibra Tour ───────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Calibra Tour est la version compétition de la gamme Calibra, pensée pour les joueurs confirmés qui veulent allier la philosophie de trajectoire longue de la série à des performances de haut niveau. Avec une mousse plus ferme et un topsheet plus dynamique que les autres membres de la famille Calibra, il offre vitesse, rotation et puissance dans un package résolument orienté compétition.

Son profil de jeu diffère sensiblement des versions LT et LT Sound : la trajectoire, bien que toujours liftée, est plus tendue et plus pénétrante, ce qui la rend plus polyvalente dans les échanges à différentes distances. Le Calibra Tour peut être utilisé en coup droit par des joueurs offensifs de niveau avancé qui apprécient les qualités de la série Calibra mais cherchent plus d'intensité dans leurs frappes.

Ce revêtement s'adresse aux compétiteurs qui évoluent en division régionale à nationale et qui ont outrepassé le niveau de la gamme Calibra LT classique. Il peut constituer un revêtement intermédiaire avant d'adopter un Mantra ou un DNA Pro, tout en conservant la signature Calibra reconnaissable.

Dans la logique de gamme Stiga, le Calibra Tour occupe une niche précise : la performance compétition avec l'âme Calibra. Un choix cohérent pour les joueurs attachés à cette série et qui veulent passer un cap.$desc$
WHERE nom ILIKE '%Calibra Tour%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE MANTRA PRO (si disponible)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Stiga Mantra Pro M ───────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Mantra Pro M est la version haut de gamme de la célèbre gamme Mantra, intégrant les derniers développements technologiques de Stiga dans une formule encore plus ambitieuse. Positionné entre le Mantra M classique et le DNA Pro M, il offre un saut de performance significatif par rapport à son prédécesseur, avec une mousse plus réactive et un topsheet au grip renforcé.

Sa mousse Pro génère une catapulte supérieure et une rotation accrue par rapport au Mantra M standard, avec une trajectoire plus dynamique et une pénétration dans le camp adverse plus marquée. La tolérance reste à un bon niveau pour ce type de revêtement, permettant aux joueurs de niveau avancé de profiter des performances Pro sans être trop pénalisés dans les moments moins précis.

Ce revêtement s'adresse aux joueurs compétiteurs de niveau régional à national qui ont maîtrisé le Mantra M et souhaitent un défi supplémentaire. Il peut aussi convenir aux joueurs venant du DNA Pro qui cherchent un profil légèrement différent tout en restant dans le haut de gamme Stiga.

Le Mantra Pro M confirme la volonté de Stiga de proposer plusieurs niveaux d'excellence au sein de ses gammes historiques, offrant à chaque joueur la possibilité de progresser sans changer de marque. Une évolution logique et bienvenue de la série Mantra.$desc$
WHERE nom ILIKE '%Mantra Pro M%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Mantra Pro H ───────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Mantra Pro H est la déclinaison Hard du Mantra Pro, destinée aux joueurs les plus puissants qui cherchent le maximum d'explosivité dans la gamme. Avec sa mousse ferme et son topsheet à grip amélioré, il combine la puissance caractéristique de la version H avec les performances supérieures de la technologie Pro, pour un revêtement réservé aux compétiteurs avancés.

Sa mousse dure répond idéalement aux frappes franches et engagées : les topspins gagnent en pénétration et en vitesse de rotation, les contre-boucles deviennent plus incisives et le jeu dans son ensemble prend une dimension plus agressive. Comparé au Mantra H classique, le Pro H apporte une explosivité supplémentaire et une réactivité accrue, au prix d'une tolérance légèrement réduite.

Ce revêtement s'adresse exclusivement aux joueurs de niveau national et au-delà, disposant d'une technique solide et d'une frappe puissante pour exploiter pleinement le potentiel d'une mousse dure de haute qualité. Pour les joueurs moins techniques ou moins puissants, le Mantra Pro M restera un choix plus sage et plus performant.

Le Mantra Pro H est souvent choisi en coup droit par les joueurs qui misent sur la puissance de leur attaque, complété par un revers en Mantra Pro M ou S pour plus de contrôle.$desc$
WHERE nom ILIKE '%Mantra Pro H%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Mantra Pro S ───────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Stiga Mantra Pro S est la version Soft du Mantra Pro, alliant les améliorations technologiques de la ligne Pro à la souplesse et au confort caractéristiques des versions S de la gamme Mantra. C'est le choix idéal pour les joueurs techniques qui veulent bénéficier des performances avancées du Pro sans sacrifier la sensibilité et le feeling essentiels à leur style de jeu.

Sa mousse souple offre une fenêtre de timing généreuse et un feeling enveloppant à l'impact. Malgré cette souplesse, le topsheet Pro procure un grip supérieur au Mantra S classique, permettant de générer plus de rotation sur les touchers légers et les services. C'est cette combinaison — mousse souple et topsheet très adhérent — qui fait la valeur du Mantra Pro S.

Ce revêtement est particulièrement apprécié en revers par des joueurs de haut niveau, qui cherchent une mousse souple pour mieux sentir les effets adverses tout en bénéficiant d'un grip de niveau Pro pour leurs propres productions. Il convient aussi aux joueurs dont le style repose sur la régularité et les effets plutôt que sur la puissance brute.

Le Mantra Pro S ferme la trilogie Mantra Pro de manière parfaitement cohérente, garantissant à chaque joueur de trouver dans cette gamme la déclinaison qui correspond exactement à ses besoins.$desc$
WHERE nom ILIKE '%Mantra Pro S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- Vérification — produits Stiga et statut des descriptions
SELECT
  nom,
  CASE
    WHEN description IS NOT NULL AND description != '' THEN 'OK ✓'
    ELSE 'manquant'
  END AS statut,
  LEFT(description, 70) AS apercu
FROM produits
WHERE marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga')
ORDER BY nom;
