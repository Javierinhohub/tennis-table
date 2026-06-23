-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Séries Dignics / Tenergy / Rozena / Glayzer / Feint Long
-- Butterfly — Revêtements complets (hors Dignics 05, Dignics 09C, Tenergy 05 déjà faits)
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE DIGNICS
-- ═══════════════════════════════════════════════════════════════════

-- ─── Butterfly Dignics 64 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Dignics 64 est le pendant vitesse-orienté de la gamme Dignics, conçu pour les joueurs qui privilégient les frappes directes et la rapidité sur la rotation. Là où le Dignics 05 excelle dans les topspins chargés à arc élevé, le 64 brille dans les contre-topspins à trajectoire tendue, les blocs explosifs et le jeu très rapide proche de la table.

Sa technologie Spring Sponge X est identique à celle du Dignics 05, avec la même réactivité et le même effet catapulte de nouvelle génération. C'est la géométrie des picots qui change : optimisée pour une trajectoire plus rasante et une vitesse maximale, la structure "64" génère moins de rotation mais une prise en main plus directe et un timing plus permissif dans les échanges rapides.

Avec une dureté de mousse de 40°, le Dignics 64 conserve la fermeté caractéristique de la gamme tout en offrant une réponse explosive à chaque frappe appuyée. Il est particulièrement adapté aux joueurs proches de la table, aux penholdeurs et à tous ceux qui cherchent à accélérer l'échange plutôt qu'à construire des topspins liftés depuis la mi-distance.

Pour les joueurs qui ont déjà joué le Tenergy 64 et souhaitent passer au niveau supérieur avec le ballon plastique, c'est la progression naturelle et la plus évidente de la gamme. Un revêtement d'exception pour un style percutant et direct.$desc$
WHERE nom ILIKE '%Dignics 64%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Dignics 80 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Dignics 80 se positionne à mi-chemin entre le Dignics 05 et le Dignics 64, proposant un équilibre unique entre rotation et vitesse au sein de la gamme. Pour les joueurs qui trouvent le 05 trop arc-boulé ou le 64 trop tendu, le Dignics 80 représente souvent le compromis idéal, combinant les meilleures qualités des deux références.

Construit sur la même mousse Spring Sponge X à 40° que ses frères de gamme, le Dignics 80 offre une réponse dynamique à la frappe, une trajectoire légèrement plus rectiligne que le 05 mais avec davantage de lift que le 64. Sa structure de picots "80" a été pensée pour les joueurs complets, capables de produire à la fois des topspins croisés puissants et des accélérations directes selon les opportunités.

Ce revêtement convient particulièrement aux joueurs polyvalents qui ne se définissent pas par un seul style de jeu. Il excelle dans les contre-topspins, les smashes interrompus et les échanges mixtes où la variation prime sur la répétition. Sa tolérance est légèrement supérieure à celle du 05 dans les frappes rapides, ce qui le rend accessible à un niveau de jeu plus large tout en restant haut de gamme.

Le Dignics 80 est souvent choisi par les joueurs souhaitant passer à la gamme Dignics sans adopter le profil très liftant du 05, ou par les compétiteurs qui alternent les phases de jeu loin et proche de la table dans une même tactique. Un revêtement polyvalent de très haute qualité.$desc$
WHERE nom ILIKE '%Dignics 80%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Dignics 80 FX ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Dignics 80 FX est la version à mousse souple du Dignics 80, conçue pour les joueurs qui souhaitent bénéficier du profil polyvalent de ce revêtement tout en gagnant en feeling et en tolérance. Le suffixe "FX" chez Butterfly désigne les variantes à dureté réduite, généralement plus accessibles et plus confortables pour les joueurs à la touche délicate.

Avec une mousse plus souple que le Dignics 80 standard, le FX offre une fenêtre de timing plus large et un ressenti plus doux à l'impact, sans sacrifier les qualités essentielles de la gamme Dignics : la technologie Spring Sponge X, la polyvalence et la capacité à produire des topspins de qualité. La vitesse est légèrement en retrait par rapport à la version standard, mais le contrôle et la régularité sont nettement améliorés.

Ce revêtement s'adresse notamment aux joueurs en transition qui évoluent d'un jeu intermédiaire vers un style plus offensif et cherchent à s'initier aux performances Dignics sans la contrainte d'une mousse très dure. Il convient aussi aux joueurs qui accordent une grande importance à la qualité des petits jeux et des échanges courts, où la sensibilité prime sur la puissance brute.

Une alternative sérieuse pour ceux qui cherchent la polyvalence Dignics avec plus de confort, ou pour une utilisation en revers où le feeling reste primordial.$desc$
WHERE nom ILIKE '%Dignics 80%'
  AND nom ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE TENERGY (hors Tenergy 05 déjà fait)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Butterfly Tenergy 05 FX ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 05 FX est la variante à mousse souple du légendaire Tenergy 05. Partageant la même structure de picots "05" optimisée pour la rotation maximale, il se distingue par une dureté de mousse réduite qui lui confère un feeling plus enveloppant, une fenêtre de timing plus généreuse et une meilleure adaptabilité aux joueurs moins puissants.

Là où le Tenergy 05 standard exige une frappe franche et assurée pour exprimer pleinement son potentiel, le Tenergy 05 FX pardonne davantage les frappes imprécises et offre une régularité accrue dans les échanges. Il conserve l'essentiel de ce qui fait la réputation de la gamme : un grip excellent, une rotation appréciable et la technologie Spring Sponge à effet catapulte.

Ce revêtement convient particulièrement aux joueurs de niveau intermédiaire à avancé qui souhaitent exploiter le potentiel rotatif des picots 05 sans subir la contrainte physique d'une mousse très dure. Il est également très populaire en revers chez les joueurs avancés, qui préfèrent une touche plus douce pour les lifts de contre-jeu et les touchers de table.

La version FX donne accès à l'expérience Tenergy 05 à un plus grand nombre de joueurs, tout en restant un revêtement haut de gamme et exigeant. Un très bon choix pour les joueurs ambitieux qui montent en niveau, ou pour ceux qui souhaitent combiner puissance et touche sur un seul revêtement.$desc$
WHERE nom ILIKE '%Tenergy 05%'
  AND nom ILIKE '%FX%'
  AND nom NOT ILIKE '%Hard%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 25 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 25 est le membre le plus original de la famille Tenergy. Sa structure de picots "25" adopte une inclinaison et une géométrie sensiblement différentes des autres modèles de la gamme, ce qui lui confère un profil de jeu unique : moins catapultant que le Tenergy 05, avec une trajectoire plus basse et un placement plus direct, il s'apparente davantage au bloc-contre et au jeu actif proche de la table.

Avec une dureté similaire au Tenergy 05, le Tenergy 25 étonne par sa capacité à "accrocher" le ballon de manière différente, générant une rotation moins arc-boutée mais une régularité exemplaire dans les échanges. Ses picots à angle prononcé produisent également des effets particuliers lors des touches de balle très légères, ce qui peut surprendre les adversaires peu habitués à ce comportement.

Ce revêtement est souvent choisi en revers par des joueurs très techniques cherchant à varier les effets des contre-boucles et des blocs. En coup droit, il convient aux joueurs qui privilégient un style percutant et direct plutôt qu'un jeu à lift élevé. Sa relative rareté en compétition le rend difficile à anticiper pour l'adversaire.

Moins médiatisé que ses frères 05 et 64, le Tenergy 25 est pourtant un revêtement de très grande qualité, récompensant les joueurs qui prennent le temps de le maîtriser. Un choix atypique et enrichissant pour les pongistes curieux.$desc$
WHERE nom ILIKE '%Tenergy 25%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 25 FX ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 25 FX est la variante souple du Tenergy 25, combinant la géométrie atypique des picots "25" avec une mousse plus accessible. Comme tous les modèles FX de la gamme Tenergy, il propose un feeling plus doux, une fenêtre de timing élargie et une tolérance à l'erreur supérieure, rendant ce revêtement à la personnalité singulière accessible à davantage de joueurs.

Les picots "25" conservent leur profil unique : une trajectoire plus tendue et moins arc-boulée que le 05, un comportement différent dans les touches légères, et une aptitude particulière au jeu proche de la table. La version FX accentue la sensation de contrôle et permet aux joueurs moins puissants de profiter pleinement de ces caractéristiques sans avoir à frapper très fort pour activer la mousse.

Ce revêtement s'adresse aux joueurs techniques qui apprécient la finesse dans le jeu, la variation d'effets et la créativité tactique plutôt que la puissance brute. Il peut être une excellente option en revers pour les joueurs qui veulent jouer actif sans la fermeté contraignante des versions standard.

Rare sur les tables de compétition, le Tenergy 25 FX est souvent méconnu, y compris dans les cercles de passionnés. C'est précisément ce qui en fait un atout tactique précieux : ses effets et trajectoires peuvent surprendre des adversaires rodés aux revêtements classiques de la gamme Tenergy.$desc$
WHERE nom ILIKE '%Tenergy 25%'
  AND nom ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 64 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 64 est la version vitesse-optimisée de la famille Tenergy, destinée aux joueurs qui privilégient la vitesse brute et les frappes directes sur la production de rotation. Reconnaissable à sa structure de picots "64" qui génère une trajectoire plus tendue et rasante que le Tenergy 05, il s'impose comme le choix naturel des joueurs à jeu rapide, percutant et proche de la table.

La technologie Spring Sponge du Tenergy 64 est la même que celle des autres modèles de la gamme, avec la même dureté de 36°. C'est la géométrie des picots qui opère la différence : ils produisent moins de lift mais une vitesse d'impact supérieure, un timing plus court et une réponse très directe à chaque frappe appuyée. Les contre-topspins et les smashes gagnent en explosivité, au détriment d'une légère perte de rotation.

Ce revêtement a longtemps été le favori de joueurs comme Xu Xin, connu pour son jeu de coup droit très percutant et direct. En revers, il convient aux joueurs pratiquant le flip agressif et le contre-jeu rapide. Les penholdeurs qui frappent à plat l'apprécient également beaucoup.

Le Tenergy 64 est souvent recommandé comme alternative au Tenergy 05 pour les joueurs dont le style de jeu est plus orienté vitesse que rotation. Si le 05 est la référence absolue pour les topspineurs, le 64 est son pendant naturel pour les frappeurs nets et directs.$desc$
WHERE nom ILIKE '%Tenergy 64%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 64 FX ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 64 FX est la variante à mousse souple du Tenergy 64, rendant les propriétés vitesse-orientées de ce revêtement accessibles aux joueurs qui recherchent plus de touche et de tolérance. La mousse FX plus souple autorise un jeu dynamique sans imposer la frappe appuyée exigée par la version standard.

Avec ses picots "64" à trajectoire tendue et rasante, le Tenergy 64 FX conserve le profil vitesse de la série tout en gagnant en confort. La sensation à l'impact est plus douce, le timing est plus flexible, et le revêtement produit une réponse agréable même sur les frappes légères ou les touches de reprise. En contrepartie, la vitesse maximale et l'explosivité sont légèrement inférieures à celles de la version standard.

Ce revêtement est particulièrement populaire en revers chez les joueurs de niveau régional à national qui souhaitent un jeu actif et rapide sans la rigidité d'une mousse très ferme. Il offre une excellente combinaison vitesse-contrôle qui manque parfois aux versions standard de la gamme Tenergy.

Pour les joueurs en progression qui veulent s'approcher des caractéristiques d'un Tenergy 64 sans être immédiatement limités par la dureté de la mousse, le FX est une passerelle idéale. Un revêtement souvent sous-estimé qui mérite pourtant une vraie place dans les choix de matériel des compétiteurs sérieux.$desc$
WHERE nom ILIKE '%Tenergy 64%'
  AND nom ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 80 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 80 occupe une position stratégique au sein de la gamme Tenergy : à mi-chemin entre la rotation pure du 05 et la vitesse brute du 64, il propose un équilibre recherché par de nombreux joueurs polyvalents. Ses picots "80" génèrent une trajectoire intermédiaire, plus dynamique que le 05 mais plus liftée que le 64, pour un profil de jeu complet et adaptable.

Partageant la même mousse Spring Sponge à 36° que ses homologues de gamme, le Tenergy 80 offre la même réactivité et le même effet catapulte. Sa spécificité réside dans la géométrie des picots, qui produit un compromis précis : assez de rotation pour construire des topspins efficaces en sécurité, assez de vitesse pour rythmer et accélérer l'échange selon les opportunités tactiques.

Ce revêtement est souvent choisi par les joueurs qui ne veulent pas se spécialiser dans un seul registre de jeu, ou qui cherchent un revêtement polyvalent pour explorer différentes distances et styles de coup. Sa tolérance est légèrement supérieure à celle du Tenergy 05 dans les frappes rapides, ce qui le rend agréable dans les échanges à haut rythme.

Le Tenergy 80 constitue également un excellent choix en revers pour de nombreux joueurs : assez rapide pour le contre-jeu, assez rotatif pour placer des lifts de sécurité. Une valeur sûre souvent sous-estimée au profit des modèles 05 et 64, mais qui mérite amplement sa place dans cette gamme iconique.$desc$
WHERE nom ILIKE '%Tenergy 80%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 80 FX ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 80 FX est la version à mousse souple du Tenergy 80, apportant plus de touche et de tolérance au profil déjà bien équilibré de ce revêtement. Comme pour tous les modèles FX de la gamme, la mousse plus souple améliore considérablement le confort, la régularité et le contrôle dans les situations délicates, tout en conservant l'essentiel des caractéristiques du 80.

Avec ses picots "80" et leur profil intermédiaire, le Tenergy 80 FX est un revêtement polyvalent qui convient aussi bien en coup droit qu'en revers pour les joueurs cherchant un matériel équilibré. La souplesse de la mousse FX rend ce revêtement particulièrement agréable pour les lifts de contre-jeu, les blocs actifs et les jeux de table, où la sensibilité prime sur la puissance.

Ce revêtement est fréquemment recommandé aux joueurs de niveau intermédiaire-avancé souhaitant entrer dans l'univers Tenergy sans la contrainte d'une mousse dure. Il permet de développer une technique propre et d'explorer les différentes facettes du jeu offensif moderne tout en conservant une marge de confort appréciable.

Le Tenergy 80 FX est aussi apprécié de certains joueurs avancés en revers, qui préfèrent une mousse plus souple pour mieux sentir les effets adverses et répondre avec précision. Un choix judicieux pour tout joueur cherchant un revêtement all-round sans compromis sur la qualité Butterfly.$desc$
WHERE nom ILIKE '%Tenergy 80%'
  AND nom ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Tenergy 19 ─────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Tenergy 19 est le membre le plus récent et le plus atypique de la famille Tenergy. Introduit en 2019, il présente une architecture radicalement différente des autres modèles : une mousse Spring Sponge à cellules très fines et à pores resserrés, qui modifie profondément la nature de l'interaction balle-revêtement aux faibles vitesses d'impact.

Cette mousse dense procure une sensation de "grip" supplémentaire lors des touches légères, ce qui rend le Tenergy 19 exceptionnel dans les petits jeux : poussettes, coupées, flicks de table et services. Le ballon semble littéralement "coller" à la surface lors des touches légères, permettant une précision et une variation d'effets rares sur un revêtement aussi offensif. À haute vitesse en revanche, il se comporte comme les autres Tenergy, avec la même catapulte et le même grip global.

Plébiscité par les joueurs techniques qui accordent autant d'importance au court jeu qu'au long jeu, le Tenergy 19 est souvent utilisé en revers pour profiter de ses qualités tactiles dans les échanges rapprochés. Certains joueurs l'adoptent également en coup droit pour sa sensation unique à l'ouverture sur poussette et dans les services chargés.

Sa dureté de 36°, identique aux autres modèles Tenergy, le rend accessible aux joueurs habitués à la gamme. Souvent décrit comme un "game changer" dans le court jeu, le Tenergy 19 reste pleinement efficace dans les échanges longs. Un revêtement fascinant et très différent des autres.$desc$
WHERE nom ILIKE '%Tenergy 19%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ═══════════════════════════════════════════════════════════════════
-- ROZENA
-- ═══════════════════════════════════════════════════════════════════

-- ─── Butterfly Rozena ─────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Rozena est le revêtement d'entrée dans la philosophie Butterfly haute performance. Lancé pour rendre accessibles les technologies de la marque aux joueurs intermédiaires, il intègre une version allégée de la Spring Sponge — la Free Chack Sponge — qui offre une réponse dynamique sans atteindre la complexité exigeante des gammes Tenergy et Dignics.

Avec une mousse accessible et des picots spécialement conçus pour maximiser la tolérance, le Rozena invite les joueurs en progression à adopter un jeu plus offensif sans se heurter aux limites d'une mousse trop dure. Il produit un bon niveau de rotation, une trajectoire relativement liftée et une vitesse appréciable pour son positionnement tarifaire, bien inférieur aux gammes premium.

Le Rozena est souvent recommandé comme revêtement de transition : il permet aux joueurs de niveau club ou régional d'expérimenter un matériel de qualité Butterfly sans l'investissement des gammes Tenergy ou Dignics. Son comportement prévisible et régulier favorise l'apprentissage des gestes techniques offensifs et la construction d'un jeu de topspin cohérent.

Pour les joueurs qui envisagent à terme de passer au Tenergy 05 FX ou au Tenergy 80, le Rozena constitue une excellente étape intermédiaire. Il ne déçoit pas non plus les joueurs plus expérimentés cherchant un revêtement polyvalent pour les entraînements. Un excellent rapport qualité-prix dans la gamme Butterfly.$desc$
WHERE nom ILIKE '%Rozena%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE GLAYZER
-- ═══════════════════════════════════════════════════════════════════

-- ─── Butterfly Glayzer ────────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Glayzer représente une nouvelle direction dans la gamme Butterfly, conçu spécifiquement pour répondre aux exigences du jeu moderne avec le ballon plastique 40+. Positionné entre les gammes Tenergy et Dignics, il combine la technologie Spring Sponge X — héritée des Dignics — avec un topsheet non-collant aux propriétés repensées pour maximiser la performance sur ballon plastique.

Sa mousse Spring Sponge X plus réactive que celle du Tenergy offre davantage d'explosivité et de vitesse catapulte, tout en maintenant un profil d'utilisation accessible. Le Glayzer s'adresse aux joueurs offensifs qui souhaitent dépasser le niveau Tenergy sans adopter la contrainte d'une mousse très ferme. Son profil intermédiaire lui confère un confort supplémentaire tout en livrant des performances de haut niveau.

Ce revêtement brille particulièrement dans les topspins ouverts, les contre-boucles dynamiques et le jeu à mi-distance. Sa trajectoire est liftée et régulière, avec une excellente transmission d'énergie à l'impact. Les joueurs qui cherchent à progresser et à adopter un matériel plus performant que le Tenergy y trouveront une réponse directe et enthousiasmante.

Pour les joueurs ambitieux qui évoluent du Tenergy vers le Dignics, le Glayzer constitue une transition naturelle et progressive. Il s'inscrit dans la stratégie de Butterfly d'offrir des alternatives entre ses gammes classiques tout en intégrant les dernières avancées technologiques.$desc$
WHERE nom ILIKE '%Glayzer%'
  AND nom NOT ILIKE '%09C%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Glayzer 09C ────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Glayzer 09C est la version à topsheet collant (tacky) de la gamme Glayzer, s'inspirant directement de la philosophie du Dignics 09C tout en proposant ses propres caractéristiques techniques. Ce revêtement hybride réunit les avantages du grip collant des revêtements asiatiques et la technologie catapulte Spring Sponge X de Butterfly, pour un résultat à la fois puissant et accessible.

Son topsheet collant permet de générer des rotations extrêmes sur les services, de "tenir" le ballon en début de frappe et de produire des topspins très chargés depuis toutes les positions. Le Glayzer 09C propose une mousse Spring Sponge X spécifique qui module le rendu global, offrant un confort dans les touches légères tout en maintenant un excellent niveau de rotation — une proposition légèrement différente du Dignics 09C.

Ce type de revêtement demande une adaptation technique, surtout pour les joueurs habitués aux revêtements européens non-collants : la gestion du topsheet collant dans les services chargés, le contre-jeu actif et les topspins très liftés nécessitent un apprentissage progressif. La récompense en termes de rotation et de variation tactique est cependant considérable.

Idéal pour les joueurs qui souhaitent explorer le style de jeu sino-européen ou améliorer leur court jeu grâce au grip du topsheet tacky, le Glayzer 09C est une option exigeante et récompensante. Un revêtement qui ouvre de nouvelles perspectives tactiques pour les joueurs polyvalents.$desc$
WHERE nom ILIKE '%Glayzer 09C%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ═══════════════════════════════════════════════════════════════════
-- SÉRIE FEINT LONG (picots longs)
-- ═══════════════════════════════════════════════════════════════════

-- ─── Butterfly Feint Long II ──────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Feint Long II est l'une des références mondiales en matière de longs picots défensifs-perturbateurs. Produit par la marque japonaise depuis plusieurs décennies, il représente une valeur sûre dans la catégorie des picots longs, apprécié tant par les défenseurs purs que par les joueurs combinant jeu défensif et contre-attaque.

Ses longs picots souples modifient fondamentalement le comportement de la balle à la réception : les effets adverses sont renvoyés de façon aléatoire ou inversée, déstabilisant les adversaires peu habitués à ce type de revêtement. La qualité de fabrication Butterfly garantit une régularité dans la production des effets perturbateurs, ce qui distingue le Feint Long II des longs picots d'entrée de gamme.

Disponible avec ou sans mousse (OX — sans mousse) selon les préférences du joueur, le Feint Long II offre différents niveaux de contrôle et de perturbation. La version OX est plus déstabilisante mais demande une technique plus aboutie pour maintenir la balle sur la table ; la version avec mousse fine offre davantage de contrôle et de régularité dans les placements.

Ce revêtement convient aux joueurs défensifs de tous niveaux souhaitant adopter les longs picots, mais aussi aux joueurs combinés qui utilisent les picots en revers et attaquent en coup droit. Son usage demande une adaptation tactique et technique, mais les possibilités en termes de variation et de déstabilisation sont immenses.$desc$
WHERE nom ILIKE '%Feint Long II%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Feint Long III ─────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Feint Long III est la version évoluée et plus disruptive de la série Feint Long. Doté de picots encore plus souples que le Feint Long II, il amplifie les effets de perturbation à la réception et offre des trajectoires plus imprévisibles, rendant son jeu particulièrement difficile à lire pour les adversaires.

La souplesse accrue des picots du Feint Long III génère des retours avec des effets parasites plus marqués sur les attaques adverses à fort effet. Les topspins puissants sont renvoyés avec un effet inversé prononcé, les balles coupées reviennent légèrement liftées, et les balles sans effet peuvent repartir avec des trajectoires flottantes déstabilisantes. Cette capacité perturbatrice maximale en fait le choix de nombreux défenseurs et joueurs combinés de haut niveau.

En contrepartie, le contrôle actif est plus exigeant : placer la balle précisément demande une technique bien maîtrisée et une bonne lecture du rebond adverse. Ce revêtement n'est pas recommandé aux débutants dans l'utilisation des longs picots, mais convient parfaitement aux joueurs expérimentés qui cherchent à maximiser l'effet perturbateur.

Disponible en version avec mousse ou OX, le Feint Long III est un outil redoutable entre de bonnes mains. Il est particulièrement efficace contre les joueurs offensifs qui peinent à gérer les retours modifiés, et peut changer l'issue d'un match en quelques échanges bien placés.$desc$
WHERE nom ILIKE '%Feint Long III%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Feint AG ───────────────────────────────────────────
UPDATE produits SET description =
$desc$Le Butterfly Feint AG est une variante spécialisée de la gamme Feint Long, conçue pour maximiser les propriétés perturbatrices des longs picots dans un usage principalement défensif. Sa géométrie de picots unique offre un comportement encore plus imprévisible à la réception, générant des retours flottants et des effets parasites particulièrement difficiles à gérer même pour les joueurs habitués aux longs picots.

Le Feint AG se distingue par sa capacité à "aspirer" les effets adverses de manière très prononcée, produisant des trajectoires qui challengent les adversaires à tous les niveaux. Utilisé principalement sans mousse (OX), il offre le maximum de perturbation et une sensation de jeu très différente des revêtements lisses classiques.

Ce revêtement s'adresse aux défenseurs et joueurs combinés expérimentés qui ont déjà acquis la maîtrise technique des longs picots et qui cherchent à pousser encore plus loin le potentiel perturbateur de leur jeu. L'utilisation du Feint AG exige une excellente lecture du jeu adverse et une grande rigueur dans le placement, mais les récompenses tactiques peuvent être considérables.

La gamme Feint de Butterfly jouit d'une réputation de qualité et de régularité dans le domaine des longs picots, et le Feint AG s'inscrit dans cette tradition d'excellence. Pour les joueurs défensifs et perturbateurs cherchant à se démarquer par un matériel atypique et redoutable, il représente l'une des options les plus intéressantes du marché.$desc$
WHERE nom ILIKE '%Feint AG%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Feint (OX / sans mousse — variante générique) ──────
UPDATE produits SET description =
$desc$Le Butterfly Feint OX est la version sans mousse (OX = sans éponge) des revêtements longs picots de la gamme Feint. Sans mousse intercalaire entre le topsheet et le bois de la raquette, le comportement du revêtement change radicalement : les effets perturbateurs sont maximaux, les trajectoires encore plus imprévisibles, et le contrôle actif demande une technique très spécifique.

En version OX, les longs picots Feint génèrent des retours qui dépendent presque entièrement de l'effet adverse plutôt que d'une impulsion propre du joueur. Les topspins forts reviennent avec un effet coupé prononcé, les balles coupées reviennent lifter, et les balles sans effet flottent de manière déstabilisante. Cette inversion des effets, caractéristique des longs picots OX, est un des outils tactiques les plus redoutables en tennis de table.

Ce revêtement est exclusivement destiné aux joueurs ayant une expérience avancée des longs picots. Sans la stabilité offerte par une mousse, le placement et la régularité dépendent entièrement de la technique et de la lecture du jeu. Les premiers essais peuvent être déconcertants, mais la maîtrise des picots OX ouvre des possibilités tactiques uniques en compétition.

Butterfly, avec sa qualité de fabrication reconnue, garantit une consistance optimale dans les effets produits, ce qui distingue le Feint OX des alternatives bas de gamme. Un choix pour les défenseurs et joueurs combinés qui veulent pousser la perturbation à son maximum.$desc$
WHERE nom ILIKE '%Feint%'
  AND nom ILIKE '%OX%'
  AND nom NOT ILIKE '%Long%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- Vérification — nombre de produits mis à jour par série
SELECT
  CASE
    WHEN nom ILIKE '%Dignics%' THEN 'Dignics'
    WHEN nom ILIKE '%Tenergy%' THEN 'Tenergy'
    WHEN nom ILIKE '%Rozena%' THEN 'Rozena'
    WHEN nom ILIKE '%Glayzer%' THEN 'Glayzer'
    WHEN nom ILIKE '%Feint%' THEN 'Feint Long'
  END AS serie,
  COUNT(*) AS nb_produits,
  COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) AS avec_description
FROM produits
WHERE marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly')
  AND (
    nom ILIKE '%Dignics%' OR nom ILIKE '%Tenergy%' OR
    nom ILIKE '%Rozena%' OR nom ILIKE '%Glayzer%' OR nom ILIKE '%Feint%'
  )
GROUP BY 1
ORDER BY 1;
