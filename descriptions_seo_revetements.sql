-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Revêtements les plus connus
-- Intro éditoriale 150-300 mots, optimisée pour le référencement
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ─── Butterfly Tenergy 05 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Tenergy 05 est sans conteste le revêtement de tennis de table le plus emblématique de ces vingt dernières années. Lancé en 2008, ce backside a révolutionné le jeu offensif moderne grâce à sa technologie Spring Sponge brevetée, qui offre un effet catapulte exceptionnel et une réponse particulièrement linéaire à chaque frappe.

Avec sa dureté de 36° et sa structure de picots "05" optimisée pour la rotation maximale, le Tenergy 05 s''impose comme la référence absolue des joueurs de topspin. Son grip exceptionnel permet de générer des effets dévastateurs sur les topspins croisés comme dans les changements de rythme, tandis que sa vitesse notable le rend redoutable dans les échanges rapides.

Plébiscité depuis sa sortie par les meilleurs joueurs mondiaux — de Timo Boll à Vladimir Samsonov en passant par de nombreux champions olympiques — le Tenergy 05 est l''outil de choix des joueurs offensifs cherchant un maximum de rotation avec une grande précision. Son prix élevé est compensé par une durabilité reconnue et des performances de très haut niveau.

Ce revêtement convient idéalement aux joueurs de niveau avancé à élite qui pratiquent un jeu de topspin moderne, notamment à mi-distance. Les débutants ou joueurs intermédiaires lui préféreront souvent la version Tenergy 05-FX, plus souple, pour profiter des mêmes qualités avec plus de tolérance à l''erreur. En résumé, le Tenergy 05 reste la mesure étalon à laquelle tous les autres revêtements offensifs se comparent.'
WHERE nom ILIKE '%Tenergy 05%'
  AND nom NOT ILIKE '%Hard%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Dignics 05 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Dignics 05 représente l''évolution naturelle du Tenergy 05 pour la génération du ballon plastique. Intégrant la technologie Spring Sponge X de nouvelle génération — une mousse encore plus réactive — couplée à un topsheet aux propriétés dynamiques inédites, ce revêtement impose un nouveau standard dans le jeu offensif de haut niveau.

Avec une dureté de 40°, plus élevée que son prédécesseur, le Dignics 05 offre une puissance accrue et un effet catapulte prononcé, tout en conservant une précision remarquable. La géométrie des picots a été entièrement repensée pour maximiser l''adhérence sur le ballon plastique 40+, en compensant les pertes de rotation introduites par ce type de balle par rapport au celluloid.

Plébiscité par Timo Boll, Dimitrij Ovtcharov et de nombreux autres membres de l''élite mondiale, le Dignics 05 convient parfaitement aux joueurs de haut niveau pratiquant un topspin puissant, des contre-topspins dynamiques et un jeu polyvalent à toutes les distances. Sa réponse linéaire et sa tolérance à la frappe forte en font l''un des revêtements les plus sûrs du marché à ce niveau.

Comparé au Dignics 09C, son frère collant, le Dignics 05 est moins accrocheur mais plus rapide et plus polyvalent. Il sera le choix idéal pour les joueurs européens et ceux qui préfèrent un jeu direct sans la colle tacky typique des revêtements asiatiques. Son positionnement haut de gamme se reflète dans son prix, reflet de performances de niveau olympique.'
WHERE nom ILIKE '%Dignics 05%'
  AND nom NOT ILIKE '%09%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Dignics 09C ────────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Dignics 09C se distingue de l''ensemble des revêtements Butterfly par son topsheet collant (tacky), une caractéristique empruntée aux revêtements asiatiques traditionnels. Cette particularité lui confère des propriétés uniques : une capacité à générer des effets extrêmes sur les services et les topspins liftés, ainsi qu''une excellente aptitude à "tenir" le ballon en début de frappe.

Avec une dureté de mousse de 44°, le Dignics 09C est le plus dur des revêtements de la gamme Dignics. Il offre moins de vitesse brute que le Dignics 05, mais une rotation maximale à l''impact, particulièrement redoutable dans les échanges rapprochés et les services très chargés. Le "C" de son nom fait référence au topsheet collant.

Ce revêtement est particulièrement apprécié des joueurs proches de la table pratiquant un topspin lourd et précis, à la manière du jeu sino-européen. Fan Zhendong, numéro un mondial, et plusieurs autres membres de l''équipe nationale de Chine ont utilisé ce revêtement, témoignant de ses capacités au plus haut niveau international.

À mi-chemin entre l''école européenne (revêtements non-collants, jeu à mi-distance) et l''école chinoise (revêtements tackys, jeu proche de la table), le Dignics 09C s''adresse aux joueurs expérimentés cherchant à exploiter les avantages du grip collant tout en bénéficiant des performances Spring Sponge X de Butterfly. Un choix exigeant mais récompensant pour qui maîtrise sa technique.'
WHERE nom ILIKE '%Dignics 09C%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── DHS Hurricane 3 (standard) ──────────────────────────────────
UPDATE produits SET description =
'Le DHS Hurricane 3 est le revêtement iconique de l''école chinoise de tennis de table et l''un des plus utilisés dans l''histoire du sport. Conçu par Double Happiness Shanghai (DHS), fournisseur officiel de l''équipe nationale de Chine, le Hurricane 3 incarne les principes fondamentaux du jeu chinois : service ultra-chargé, topspin lourd et placement précis.

Sa caractéristique principale est son topsheet extrêmement collant (tacky), qui accroche littéralement le ballon lors de la frappe. Cette adhérence hors norme permet des rotations dévastatrices sur les services et les topspins, ainsi qu''une grande stabilité dans les échanges court-table. La mousse dure (entre 37° et 42° selon la version) complète ce profil en offrant une sensation ferme et directe à chaque frappe.

Le Hurricane 3 est disponible en plusieurs variantes : standard, Neo avec mousse pré-boostée, National (version équipe de Chine) et différentes duretés. En compétition internationale, les versions National et Provincial sont souvent boostées par les joueurs avec des colles spéciales pour accroître encore leur vitesse.

Fan Zhendong, Ma Long, Chen Meng et la quasi-totalité de l''équipe de Chine jouent avec le Hurricane 3 en coup droit, ce qui en dit long sur ses qualités. Ce revêtement demande cependant une bonne technique, car son manque de catapulte native rend les frappes passives moins efficaces que sur un revêtement européen tensor.'
WHERE (nom ILIKE '%Hurricane 3%' OR nom ILIKE '%Hurricane III%')
  AND nom NOT ILIKE '%Neo%'
  AND nom NOT ILIKE '%National%'
  AND nom NOT ILIKE '%Blue%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DHS');

-- ─── DHS Hurricane 3 Neo ──────────────────────────────────────────
UPDATE produits SET description =
'Le DHS Hurricane 3 Neo est la version modernisée et pré-boostée du légendaire Hurricane 3, spécialement adaptée pour les joueurs pratiquant en dehors de la Chine. Alors que le Hurricane 3 standard est souvent boosté manuellement par les professionnels, le Neo intègre un traitement de mousse qui reproduit cet effet directement en usine, pour une performance immédiate dès la sortie de l''emballage.

Grâce à cette pré-boost intégrée, la mousse du Hurricane 3 Neo est plus réactive et offre une vitesse supérieure à la version originale sans traitement. L''acheteur bénéficie d''un compromis entre les caractéristiques collantes et à rotation élevée du Hurricane 3 traditionnel et la dynamique d''un revêtement tensor européen — un hybride très apprécié des joueurs souhaitant expérimenter le style chinois sans la complexité du boostage manuel.

Son topsheet collant conserve toutes les propriétés de rotation légendaires de la gamme Hurricane, permettant des services dévastateurs, des topspins très chargés et un excellent court jeu. La mousse dans sa version Neo orange (38-40°) est plus accessible aux joueurs habitués aux revêtements européens que la version National, réservée aux professionnels.

Idéal pour les joueurs en transition vers l''école de jeu chinoise, ou pour ceux qui recherchent davantage de rotation sans sacrifier complètement la vitesse, le Hurricane 3 Neo s''est imposé comme l''un des revêtements asiatiques les plus populaires en dehors de la Chine. Son excellent rapport qualité-prix complète son attrait.'
WHERE (nom ILIKE '%NEO Hurricane 3%' OR nom ILIKE '%Hurricane 3 NEO%'
       OR nom ILIKE '%Hurricane NEO%' OR nom ILIKE '%Neo Hurricane%'
       OR (nom ILIKE '%Hurricane 3%' AND nom ILIKE '%Neo%'))
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DHS');

-- ─── Tibhar Evolution MX-P ───────────────────────────────────────
UPDATE produits SET description =
'Le Tibhar Evolution MX-P est le revêtement phare de la gamme Evolution, et l''un des revêtements tensor les plus vendus en Europe depuis son lancement. Fabriqué en Allemagne selon la technologie ProTension, il représente le savoir-faire européen dans la conception de revêtements haute performance pour le jeu offensif moderne.

Sa technologie ProTension étire le topsheet sur une mousse à grandes cellules à pores ouverts, créant un effet de tension interne qui démultiplie la vitesse et le grip à la frappe. Avec une dureté de mousse entre 47° et 50°, l''Evolution MX-P est le plus dynamique de la série -P, destiné aux joueurs qui recherchent une frappe directe, puissante et très explosive.

La géométrie des picots a été spécifiquement développée pour allonger le temps de contact balle-raquette, offrant une sensation de contrôle accrue et une meilleure lecture des trajectoires malgré la vitesse élevée. C''est ce qui fait sa particularité : l''Evolution MX-P ne sacrifie pas totalement le ressenti pour la vitesse, contrairement à certains revêtements ultra-rapides.

Apprécié des joueurs de niveau régional à national, le MX-P convient aux attaquants pratiquant le topspin à mi-distance, avec une préférence pour les frappes appuyées et les contre-topspins accélérés. Il est souvent comparé au Butterfly Tenergy 05, avec lequel il partage certaines qualités, tout en étant proposé à un prix plus accessible. Un excellent choix pour les joueurs ambitieux souhaitant franchir un cap offensif.'
WHERE nom ILIKE '%Evolution MX-P%'
  AND nom NOT ILIKE '%50%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Andro Rasanter R47 ──────────────────────────────────────────
UPDATE produits SET description =
'Le Andro Rasanter R47 est le représentant le plus populaire de la gamme Rasanter, une série de revêtements conçus par la marque allemande Andro pour répondre aux défis posés par le ballon plastique 40+. Le "R" désigne la priorité donnée à la Rotation, et "47" indique la dureté de mousse.

Son architecture repose sur une surface très fine avec une géométrie de picots innovante, permettant une surface de contact balle-raquette maximale même lors des frappes rapides. Ce design compense la perte de rotation induite par le ballon plastique par rapport au celluloid, garantissant des effets puissants et constants dans toutes les situations de jeu.

La mousse Ultrasound à 47° offre le parfait équilibre entre vitesse, rotation et contrôle. Plus souple que le R50, plus ferme que le R42, le R47 est le choix le plus polyvalent de la gamme — adapté aux joueurs offensifs qui alternent entre topspins engagés à mi-distance et frappes directes près de la table.

Approuvé par plusieurs joueurs professionnels européens et largement utilisé en compétition nationale et internationale, le Rasanter R47 s''est imposé comme une alternative sérieuse aux revêtements Butterfly dans sa gamme de prix. Ses qualités de spin au service et en retour en font un outil complet, particulièrement efficace sur les échanges longs où la rotation prononcée déstabilise l''adversaire. Une valeur sûre pour les joueurs ambitieux cherchant un revêtement de compétition fiable.'
WHERE nom ILIKE '%Rasanter R47%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Andro');

-- ─── Xiom Vega Pro ───────────────────────────────────────────────
UPDATE produits SET description =
'Le Xiom Vega Pro a marqué l''entrée de la marque coréenne Xiom sur la scène mondiale du tennis de table haut de gamme. Lancé à la fin des années 2000, ce revêtement tensor a immédiatement séduit les joueurs offensifs par sa capacité à combiner rotation élevée, vitesse franche et durabilité exceptionnelle — une combinaison rare dans cette gamme de prix.

Contrairement à de nombreux revêtements tensor européens qui privilégient l''effet catapulte, le Xiom Vega Pro se distingue par une sensation de contrôle prononcée, due à un temps de contact balle-raquette plus long. Sa mousse de dureté intermédiaire (45-47°) offre une réponse linéaire et prévisible, ce qui le rend particulièrement adapté aux joueurs qui cherchent à construire leurs points méthodiquement plutôt que de miser sur la vitesse brute.

Son topsheet légèrement collant améliore l''accroche sur les balles basses et les topspins à demi-vitesse, tout en restant suffisamment dynamique pour les frappes puissantes. Le Vega Pro est également reconnu pour sa longévité supérieure à la moyenne, un avantage notable pour les joueurs en développement soucieux de leur budget.

À un prix nettement inférieur aux revêtements Butterfly ou aux dernières générations de revêtements européens premium, le Vega Pro représente un excellent rapport qualité-prix pour les compétiteurs de niveau régional à national. Il conviendra particulièrement aux joueurs polyvalents qui souhaitent un revêtement fiable et constant, aussi bien en coup droit qu''au revers.'
WHERE nom ILIKE '%Vega Pro%'
  AND nom NOT ILIKE '%Hybrid%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Xiom');

-- ─── Donic Bluefire M1 Turbo ─────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire M1 Turbo est le fleuron de la gamme Bluefire, une série de revêtements développée par la marque allemande Donic pour le jeu offensif de haut niveau. Reconnaissable à sa mousse bleue distinctive à 50°, le M1 Turbo est le revêtement le plus dur et le plus explosif de la famille Bluefire.

Sa structure de mousse à grandes cellules et parois fines offre une élasticité exceptionnelle, couplée à un topsheet très adhérent aux picots fins et longs. Cette combinaison génère un effet catapulte puissant et une rotation élevée, particulièrement sensible dans les topspins appuyés et les coups frappés engagés. Les têtes de picots légèrement élargies confèrent au M1 Turbo une sensation de contact plus directe que le M1 standard, renforçant la dynamique de spin.

Recommandé aux joueurs de haut niveau possédant une technique solide, le Bluefire M1 Turbo récompense les frappes franches et bien senties. Sa réactivité exige un bon niveau de régularité, car les frappes hésitantes ou partielles seront moins bien contrôlées que sur une mousse plus souple.

Plébiscité en Europe comme revêtement de coup droit pour les attaquants purs, le Donic Bluefire M1 Turbo s''est imposé comme une alternative sérieuse aux produits Butterfly et Tibhar dans le segment premium. Son prix compétitif pour le niveau de performance offert en fait un choix très apprécié des joueurs de division nationale cherchant à optimiser leur arsenal offensif sans se ruiner.'
WHERE nom ILIKE '%Bluefire M1 Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Joola Rhyzm-P ───────────────────────────────────────────────
UPDATE produits SET description =
'Le Joola Rhyzm-P est la version optimisée pour le ballon plastique 40+ de la célèbre série Rhyzm, développée par la marque allemande Joola pour les joueurs offensifs exigeants. Le suffixe "P" (Plastic Generation) indique que ce revêtement a été spécifiquement conçu pour compenser les pertes de performance introduites par la transition du ballon celluloid au ballon plastique en 2015.

Sa technologie GeoGrip assure une adhérence maximale du topsheet, reproduisant les conditions de jeu du celluloid sur le nouveau ballon 40+ moins réactif. La structure de mousse plus poreuse du Rhyzm-P augmente la réactivité et le rebond, offrant un soutien accru pour les topspins et les frappes directes à toutes les distances de table.

En termes de performance, le Rhyzm-P se situe dans le segment des revêtements tensor offensifs haut de gamme, rivalisant avec des références comme le Tibhar Evolution ou le Donic Bluefire. Sa vitesse franche et sa rotation généreuse en font un outil de choix pour les attaquants jouant à mi-distance, tandis que sa tolérance relativement élevée le rend accessible aux joueurs de niveau avancé.

Reconnu pour son excellente durabilité — un point fort historique de la gamme Rhyzm — le Joola Rhyzm-P offre un excellent rapport qualité-prix pour les compétiteurs souhaitant un revêtement fiable sur le long terme. Que ce soit en coup droit ou en revers, il s''adapte à différents styles de jeu tout en maintenant ses performances au fil des entraînements et des compétitions.'
WHERE nom ILIKE '%Rhyzm%'
  AND (nom ILIKE '%Rhyzm-P%' OR nom ILIKE '%Rhyzm P%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ══════════════════════════════════════════════════════════════════
-- AJOUTS : Tibhar · Stiga · Donic · Butterfly Zyre 03
-- ══════════════════════════════════════════════════════════════════

-- ─── Tibhar Evolution MX-S ───────────────────────────────────────
UPDATE produits SET description =
'Le Tibhar Evolution MX-S est la version orientée spin de la gamme Evolution, conçue pour les joueurs qui privilégient la rotation et la régularité sur la vitesse brute. Fabriqué en Allemagne avec la technologie ProTension signature de Tibhar, il partage avec le MX-P la même architecture de mousse à grandes cellules, mais avec une topsheet spécifiquement retravaillée pour maximiser l''adhérence et l''enroulement autour de la balle.

Avec une dureté légèrement inférieure au MX-P, l''Evolution MX-S offre une sensation plus douce et un temps de contact balle-raquette plus long, ce qui le rend idéal pour les topspins construits avec technique, notamment au revers. La mousse absorbe mieux les variations d''impact et tolère les frappes imprécises, un avantage notable pour les joueurs en progression ou cherchant plus de consistance dans les échanges.

Sa particularité réside dans sa capacité à produire des effets intenses même sur des balles basses ou difficiles, grâce à une adhérence topsheet supérieure à celle du MX-P. C''est le revêtement de la gamme Evolution recommandé pour le revers des joueurs offensifs, notamment ceux qui construisent leur jeu autour du topspin croisé et des ouvertures sécurisées.

En termes de rapport qualité-prix, l''Evolution MX-S se situe dans le même segment haut de gamme que son frère MX-P, à un prix comparable. Un choix excellent pour les attaquants qui souhaitent maîtriser leurs effets sans sacrifier la vitesse de leur jeu global.'
WHERE nom ILIKE '%Evolution MX-S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Evolution EL-P ───────────────────────────────────────
UPDATE produits SET description =
'Le Tibhar Evolution EL-P est le modèle le plus équilibré de la gamme Evolution, conçu pour combler le fossé entre la puissance brute du MX-P et la souplesse du FX-P. Son sigle "EL" (Extra Large) fait référence à sa géométrie de picots inédite, avec des têtes plus larges qui augmentent la surface de contact avec la balle.

Cette architecture originale confère à l''Evolution EL-P une polyvalence rare : il se montre aussi à l''aise sur les topspins puissants à mi-distance que sur les blocs actifs et les frappes directes près de la table. La mousse de dureté intermédiaire (entre 45° et 47°) procure une excellente élasticité sans le côté "canon" du MX-P, rendant le jeu plus lisible et plus facile à contrôler dans les échanges rapides.

Selon Tibhar, l''EL-P permet une frappe précise et puissante depuis toutes les positions, avec une capacité à générer autant de rotation que le MX-P tout en offrant davantage de marge à l''erreur. Sa réponse est linéaire et rassurante, ce qui en fait un choix idéal pour les joueurs qui montent en niveau et cherchent un revêtement capable d''évoluer avec leur technique.

Recommandé aussi bien en coup droit qu''au revers, l''Evolution EL-P est sans doute le revêtement de la gamme Evolution qui conviendra au plus large éventail de joueurs. Un excellent point d''entrée pour découvrir le niveau de performance Tibhar.'
WHERE nom ILIKE '%Evolution EL-P%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Stiga Calibra LT Sound ──────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Calibra LT Sound est l''un des revêtements les plus emblématiques de la marque suédoise Stiga, reconnu pour son sponge ultra-souple et sa sonorité caractéristique à l''impact — d''où le suffixe "Sound". Appartenant à la famille Calibra (LT = Long Trajectory), ce revêtement a été conçu pour les joueurs offensifs jouant loin de la table, qui misent sur des topspins liftés avec une trajectoire très haute et profonde.

Sa mousse très souple (autour de 32-35°) est l''une des plus tendres du marché dans cette catégorie offensive. Cette douceur offre une sensation de contrôle exceptionnelle et une grande tolérance aux frappes imprécises, tout en générant des effets importants grâce à l''enroulement prononcé de la balle dans le topsheet. Le Calibra LT Sound reproduit fidèlement l''effet de la colle rapide interdite depuis 2008, avec des trajectoires basses au départ puis plongeantes sur la table adverse.

Particulièrement apprécié au revers, ce revêtement permet de construire des topspins réguliers et spinés depuis la mi-distance ou loin de la table, avec une facilité déconcertante. Sa relative lenteur par rapport aux revêtements tensor actuels est compensée par une sécurité de jeu très élevée.

Idéal pour les joueurs de niveau intermédiaire à avancé qui privilégient la régularité et les effets sur la vitesse, le Calibra LT Sound reste une valeur sûre chez Stiga. Sa longévité reconnue et son prix accessible en font également un revêtement d''entraînement très prisé.'
WHERE nom ILIKE '%Calibra LT Sound%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Mantra M ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Mantra M est le revêtement de référence de la gamme Mantra, la série haut de gamme de la marque suédoise Stiga. La déclinaison "M" (Medium) représente le point d''équilibre parfait entre vitesse, rotation et contrôle, en faisant le choix le plus polyvalent de la trilogie H/M/S.

Conçu pour les joueurs offensifs modernes jouant des deux côtés, le Mantra M intègre un topsheet très adhérent associé à une mousse de dureté intermédiaire qui assure un temps de contact idéal pour les topspins construits. Sa réponse est dynamique sans être brutale, ce qui le rend efficace aussi bien sur les frappes de puissance en coup droit que sur les ouvertures techniques au revers.

L''architecture du Mantra M a été pensée pour compenser les caractéristiques du ballon plastique 40+, notamment en maintenant un niveau de rotation élevé malgré la surface moins réactive de la balle moderne. Le topsheet haute friction s''accroche parfaitement à la balle même lors de contacts partiels ou obliques.

Recommandé pour les joueurs de compétition de niveau régional à national, le Mantra M s''installe aussi bien en coup droit qu''au revers, et peut être monté sur des lames de puissances variées. Son rapport qualité-prix compétitif par rapport aux revêtements Butterfly ou aux dernières générations Tibhar en fait l''une des meilleures propositions de la marque scandinave.'
WHERE nom ILIKE '%Mantra M%'
  AND nom NOT ILIKE '%Mantra H%'
  AND nom NOT ILIKE '%Mantra S%'
  AND nom NOT ILIKE '%Pro%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Mantra H ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Mantra H est la version la plus puissante et la plus rapide de la gamme Mantra, conçue pour les joueurs offensifs agressifs qui cherchent à dominer l''échange par la vitesse et la puissance de leurs topspins. Le "H" (Hard) désigne la dureté accrue de la mousse par rapport au Mantra M, ce qui lui confère une réponse plus directe et plus explosive.

Avec sa mousse plus dure, le Mantra H est taillé pour les frappes franches et engagées, notamment en coup droit lors des contre-topspins et des smashes. La sensation à l''impact est plus ferme et plus directe, récompensant les joueurs qui frappent fort et avec technique. Les topspins générés avec le Mantra H sont rapides et pénétrants, avec une trajectoire plus tendue que celle du Mantra M.

Ce revêtement est particulièrement adapté aux joueurs de haut niveau qui pratiquent un jeu explosif proche à mi-distance de la table, avec une préférence pour les frappes directes sur les balles semi-longues. Sa vitesse élevée exige cependant une technique solide, car les frappes imprécises ou molles sont moins bien absorbées que sur les versions plus souples.

Pour les joueurs cherchant à maximiser leur puissance offensive tout en restant dans l''univers Stiga, le Mantra H représente le meilleur choix de la gamme. Sa dureté plus élevée le prédestine davantage au coup droit, tandis qu''une version plus souple comme le Mantra M conviendra mieux au revers.'
WHERE nom ILIKE '%Mantra H%'
  AND nom NOT ILIKE '%Pro%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Mantra S ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Mantra S est la version la plus souple et la plus contrôlée de la gamme Mantra de Stiga. Le "S" (Soft) indique une mousse plus tendre, offrant une sensation plus confortable et une tolérance accrue qui en font le meilleur choix pour le revers ou pour les joueurs préférant un jeu basé sur la régularité et les effets plutôt que sur la vitesse brute.

Grâce à sa mousse douce, le Mantra S offre un excellent dwell time (temps de contact) qui maximise la rotation générée sur chaque frappe. Les topspins sont liftés et consistants, avec une trajectoire haute qui oblige l''adversaire à reculer. Ce profil le rend idéal pour les joueurs qui construisent leurs points progressivement, en utilisant les effets pour déstabiliser plutôt que la vitesse pour conclure.

Sa légèreté et sa douceur en font également un excellent revêtement pour les joueurs en développement qui souhaitent s''approprier le jeu de topspin moderne sans les exigences techniques d''une mousse dure. Le topsheet très adhérent du Mantra S assure une adhérence constante sur les balles difficiles, en service ou en réception.

Polyvalent et durable, le Stiga Mantra S se distingue par sa résistance à l''usure, qualité reconnue de la gamme Mantra. C''est un choix particulièrement recommandé en position de revers pour les attaquants complets, ou comme revêtement principal pour les joueurs cherchant le maximum d''effets avec le minimum de risque.'
WHERE nom ILIKE '%Mantra S%'
  AND nom NOT ILIKE '%Mantra H%'
  AND nom NOT ILIKE '%Mantra M%'
  AND nom NOT ILIKE '%Pro%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Donic Bluefire M1 (standard) ───────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire M1 est le revêtement premium de la série Bluefire, avec une mousse bleue à 47,5° qui en fait la version de référence entre le très dur M1 Turbo et le plus équilibré M2. Fabriqué en Allemagne par Donic, il bénéficie de la même architecture de mousse haute performance que toute la gamme : grandes cellules à parois fines pour une élasticité maximale et un transfert d''énergie optimal à l''impact.

Son topsheet très adhérent aux picots fins et allongés confère au Bluefire M1 une rotation élevée dans toutes les situations de jeu. Contrairement au M1 Turbo dont les picots sont légèrement plus larges, le M1 standard offre une sensation plus souple et un meilleur ressenti sur les balles à mi-vitesse, le rendant légèrement plus polyvalent et accessible.

Recommandé pour les joueurs offensifs de niveau avancé à élite, le Bluefire M1 excelle dans les topspins construits à mi-distance, les contre-topspins accélérés et les services très chargés. Il offre un équilibre remarquable entre puissance et contrôle, permettant de varier les angles et les vitesses tout en maintenant un niveau d''effets constant.

Avec un positionnement prix légèrement inférieur au M1 Turbo, le Donic Bluefire M1 standard représente un excellent investissement pour les joueurs de compétition cherchant un revêtement de coup droit performant et fiable. Sa mousse bleue est devenue iconique dans le monde du ping-pong européen.'
WHERE nom ILIKE '%Bluefire M1%'
  AND nom NOT ILIKE '%Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Bluefire M2 ───────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire M2 est le revêtement polyvalent par excellence de la gamme Bluefire, avec sa mousse bleue à 45°. Situé entre le M1 (47,5°) et le M3 (40°), il s''adresse aux joueurs qui recherchent un compromis idéal entre vitesse, rotation et contrôle, sans les exigences techniques des versions plus dures.

Son architecture de mousse à grandes cellules élastiques offre un effet catapulte bien dosé, permettant des topspins réguliers et consistants sans nécessiter une frappe très engagée. Le topsheet très adhérent assure une bonne rotation même sur les balles basses ou les récupérations techniques, là où les revêtements plus durs perdent en efficacité.

Le Bluefire M2 brille particulièrement au revers, où sa dureté intermédiaire permet de bloquer activement, de topspin-er les balles semi-rapides et de varier les rythmes sans risque de perte de contrôle. Il est également très efficace sur les coups de contre, grâce à la réactivité naturelle de la mousse bleue Donic.

Apprécié des joueurs de tous niveaux compétitifs, du régional au national, le Donic Bluefire M2 est souvent cité comme l''un des meilleurs revêtements polyvalents du marché pour son prix. Sa durabilité supérieure à la moyenne et ses performances constantes en font un choix sécurisant pour les joueurs qui ne veulent pas changer de revêtement tous les deux mois.'
WHERE nom ILIKE '%Bluefire M2%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Bluefire M3 ───────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire M3 est la version la plus souple et la plus accessible de la série Bluefire, avec une mousse bleue à 40°. Conçu pour les joueurs qui cherchent les caractéristiques premium de la gamme Bluefire — notamment le topsheet très adhérent et la mousse grande cellule à haute élasticité — dans un format plus doux et plus facile à maîtriser.

Sa mousse à 40° offre une tolérance élevée à l''erreur : même les frappes imprécises ou légères bénéficient de la réactivité naturelle de la structure Bluefire. Les topspins générés avec le M3 sont réguliers et spinés, avec une trajectoire relativement haute qui passe facilement le filet et plonge ensuite sur la table adverse.

Recommandé en position de revers pour les attaquants modernes, ou comme revêtement principal pour les joueurs en développement souhaitant bénéficier d''une technologie haut de gamme sans les contraintes techniques des mousses très dures, le Bluefire M3 est aussi excellent pour les joueurs cherchant à maximiser leurs effets de service et de récupération.

Sa légèreté et sa douceur en font un revêtement confortable à l''entraînement comme en compétition, moins fatigant sur le long terme qu''une mousse dure. Le Donic Bluefire M3 offre une porte d''entrée idéale dans l''univers des revêtements haut de gamme allemands, avec des performances très au-dessus de son positionnement prix.'
WHERE nom ILIKE '%Bluefire M3%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Acuda S1 Turbo ────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Acuda S1 Turbo est le fleuron de la série Acuda, une gamme de revêtements haut de gamme développée par Donic en alternative à la série Bluefire. Avec sa mousse plus dure et encore plus tendue que le S1 standard, l''Acuda S1 Turbo est le choix des joueurs les plus agressifs qui jouent près de la table et misent sur la vitesse et la précision.

Sa mousse très réactive offre un effet catapulte prononcé qui récompense les frappes directes et les counter-loops à pleine vitesse. Couplée à un topsheet très grip, la structure du S1 Turbo génère des rotations intenses sur les topspins appuyés, des balles rapides en smash et des services très chargés difficiles à lire pour l''adversaire.

Ce revêtement est conçu pour les joueurs d''élite ou de haut niveau compétitif qui maîtrisent leur technique et cherchent à maximiser l''impact de chaque frappe. Sa réactivité élevée rend les coups passifs moins fiables, mais récompense au-delà de l''imaginable les frappes engagées avec bonne intention.

Le Donic Acuda S1 Turbo se distingue des revêtements Bluefire par une sensation plus directe et une trajectoire plus tendue, le rapprochant dans l''esprit des revêtements très durs comme le Dignics 05 de Butterfly. Un outil d''expert, réservé aux joueurs qui savent exactement ce qu''ils cherchent dans leur matériel et qui ne transigent pas sur la performance pure.'
WHERE nom ILIKE '%Acuda S1 Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Acuda S1 ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Acuda S1 est le revêtement phare de la gamme Acuda, une série développée par Donic pour les joueurs offensifs exigeants jouant proche de la table. Conçu comme alternative haut de gamme aux revêtements européens premium, l''Acuda S1 combine une mousse de dureté intermédiaire à un topsheet très adhérent pour un jeu agressif et précis.

Sa mousse offre une élasticité bien dosée qui se prête aussi bien aux topspins construits avec topspin qu''aux frappes directes accélérées. Le topsheet spin-optimisé génère d''excellents effets en service et en troisième balle, deux phases de jeu essentielles à la tactique offensive moderne. La balle sort rapidement et tendue de ce revêtement, rendant les retours difficiles à gérer pour l''adversaire.

L''Acuda S1 est particulièrement efficace en position de coup droit pour les joueurs qui jouent entre la table et la mi-distance, avec une prédilection pour les frappes directes et les topspins rapides. Comparé au S1 Turbo, il offre davantage de confort et de tolérance, le rendant accessible à un panel plus large de joueurs sans sacrifier les performances.

Reconnu pour sa précision et sa réponse franche à chaque impact, le Donic Acuda S1 s''est constitué une solide réputation en compétition européenne. Son excellent rapport qualité-prix par rapport aux revêtements Butterfly ou Tibhar équivalents en fait une option très sérieuse pour les joueurs de division nationale et internationale.'
WHERE nom ILIKE '%Acuda S1%'
  AND nom NOT ILIKE '%Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Acuda S2 ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Acuda S2 est la version intermédiaire de la gamme Acuda, positionnée entre le très agressif S1 et le plus souple S3. Avec une mousse de dureté légèrement réduite par rapport au S1, l''Acuda S2 offre un équilibre remarquable entre rotation, vitesse et contrôle, le rendant particulièrement adapté aux joueurs polyvalents qui jouent sur toute la table.

Sa structure de mousse optimisée pour le topspin lui confère une bonne capacité à générer des effets importants même sur les frappes à vitesse modérée, ce qui le rend efficace aussi bien en coup droit qu''en revers. Le topsheet très adhérent assure une excellente accroche sur les balles courtes et les récupérations techniques, deux situations où les revêtements plus durs perdent parfois en efficacité.

L''Acuda S2 est apprécié des joueurs de niveau avancé cherchant un revêtement de compétition fiable et régulier, sans l''exigence technique des versions plus dures. Il permet d''exploiter pleinement les qualités de la gamme Acuda — rapidité, rotation, sensation directe — avec une marge d''erreur supplémentaire appréciable lors des matchs sous pression.

Sa polyvalence en fait un excellent choix en position de revers pour les attaquants complets, ou comme revêtement de coup droit pour les joueurs préférant une mousse un peu plus souple que le S1. Un revêtement honnête et performant dans la belle tradition Donic.'
WHERE nom ILIKE '%Acuda S2%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Butterfly Zyre 03 ───────────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Zyre 03 est le dernier-né des revêtements premium de Butterfly et marque une rupture technologique majeure avec les gammes Tenergy et Dignics. Lancé pour les joueurs cherchant à pousser encore plus loin les limites de la rotation et de la puissance, il intègre deux innovations inédites : le topsheet "Ricosheet" et la mousse Spring Sponge X dans son épaisseur maximale.

Le Ricosheet est un topsheet révolutionnaire aux picots extrêmement courts, denses et serrés, atteignant la densité maximale autorisée par les règles internationales. Cette architecture génère une surface de contact balle-raquette inédite, maximisant le grip et la transmission d''énergie rotationnelle à chaque impact. Selon les tests internes de Butterfly, le Zyre 03 affiche une résistance à l''abrasion supérieure de 40 % à celle du Dignics 05, promettant une durabilité nettement améliorée.

La mousse Spring Sponge X, plus épaisse que dans les gammes précédentes (jusqu''à 2,7 mm), réduit la déformation de la balle à l''impact, conservant mieux l''énergie et propulsant la balle avec une trajectoire fortement arquée et profonde dans le camp adverse. Le Code de picots n°303 adopté — Power + Spin — caractérise une frappe qui combine vitesse et rotation de manière rarement atteinte auparavant.

Destiné aux joueurs de haut niveau pratiquant des topspins puissants en coup droit, le Zyre 03 représente l''état de l''art de la technologie Butterfly en 2024-2025. Un choix pour les compétiteurs qui ne veulent aucun compromis.'
WHERE nom ILIKE '%Zyre 03%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ══════════════════════════════════════════════════════════════════
-- AJOUTS 2 : Donic JP · Tibhar K3 · Xiom Jekyll & Hyde
--            Andro NUZN · Yasaka Rakza · Joola Dynaryz
-- ══════════════════════════════════════════════════════════════════

-- ─── Donic Bluefire JP01 Turbo ───────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire JP01 Turbo est le revêtement le plus rapide et le plus agressif de la série Bluefire JP, une gamme distincte de la série M qui privilégie la vitesse linéaire et les frappes directes. Avec sa mousse bleue à très haute dureté et son topsheet ultra-adhérent, le JP01 Turbo est conçu pour les attaquants qui veulent conclure l''échange en un minimum de frappes.

Le "JP" de la gamme fait référence à une géométrie de picots différente de la série M, optimisée pour un transfert d''énergie plus direct et une trajectoire plus tendue. La version Turbo pousse cette philosophie à l''extrême : la mousse est encore plus réactive que le JP01 standard, offrant un effet catapulte immédiat dès le contact et une vitesse de sortie de balle dévastatrice.

Ce revêtement est taillé pour les joueurs d''élite pratiquant un jeu explosif très proche de la table — counter-loop, smash en première balle, ouvertures directes sur balles mi-longues. Sa réactivité exige une technique solide et des frappes franches ; les coups mous ou approximatifs sont peu récompensés. C''est en cela qu''il diffère du M1 Turbo : là où le M1 Turbo conserve un peu plus de dwell time, le JP01 Turbo est encore plus immédiat et catapultant.

Reconnu comme l''un des revêtements les plus rapides du catalogue Donic, le Bluefire JP01 Turbo s''adresse aux joueurs de compétition haut niveau cherchant le maximum de vitesse sans compromis. Un outil d''expert par excellence.'
WHERE nom ILIKE '%Bluefire JP01 Turbo%' OR nom ILIKE '%Bluefire JP 01 Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Bluefire JP01 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire JP01 est le revêtement de référence de la série Bluefire JP, positionné comme le choix des joueurs offensifs de haut niveau qui recherchent un équilibre entre vitesse explosive et sensation de jeu. Sa mousse bleue dure, moins extrême que la version Turbo, lui confère une légère marge de tolérance supplémentaire tout en conservant les caractéristiques directes et percutantes de la famille JP.

Le topsheet très adhérent du JP01 génère d''excellentes rotations sur les topspins en coup droit et permet des services très chargés difficiles à contrer. Sa géométrie de picots spécifique à la série JP produit une trajectoire tendue et pénétrante, très différente du profil plus arqué de la série M — un atout majeur pour déborder l''adversaire en vitesse pure.

Le JP01 brille particulièrement dans les échanges rapprochés et les phases de contre-attaque, où sa réactivité permet de reprendre l''initiative rapidement. Comparé au JP01 Turbo, il offre un peu plus de confort dans les situations défensives et les blocs actifs, sans sacrifier l''essentiel de la puissance offensive.

Recommandé pour les joueurs de niveau régional à national pratiquant un topspin direct et rapide, avec une préférence pour les échanges courts et décisifs. La série Bluefire JP est souvent comparée aux revêtements Butterfly pour son niveau de performance, à un prix légèrement plus accessible. Le JP01 en est le meilleur ambassadeur.'
WHERE (nom ILIKE '%Bluefire JP01%' OR nom ILIKE '%Bluefire JP 01%')
  AND nom NOT ILIKE '%Turbo%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Bluefire JP02 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire JP02 est le revêtement polyvalent de la série Bluefire JP, conçu pour combler le fossé entre l''agressivité du JP01 et la douceur du JP03. Avec une mousse bleue de dureté intermédiaire, le JP02 offre ce que Donic décrit comme le "compromis parfait" : suffisamment rapide pour les joueurs offensifs, suffisamment contrôlé pour les phases de jeu passive et de placement.

Son topsheet très adhérent assure d''excellentes rotations dans toutes les situations de jeu — service, troisième balle, récupération, contre-topspin. La mousse intermédiaire absorbe mieux les variations d''impact que le JP01, ce qui le rend plus facile à maîtriser lors des échanges rapides ou des balles décentrées. Le JP02 excelle particulièrement au revers, où un revêtement trop dur peut nuire à la précision.

La différence principale avec la série M réside dans la géométrie des picots : les JP produisent une trajectoire plus tendue et plus directe que les M, qui ont tendance à générer une courbe plus arquée. Le JP02 est donc idéal pour les joueurs qui veulent vitesse et pénétration sans la dureté extrême du JP01.

Très apprécié des joueurs de niveau intermédiaire à avancé, le Donic Bluefire JP02 est souvent recommandé comme premier revêtement haut de gamme pour les joueurs qui montent en niveau compétitif. Son rapport qualité-prix et sa polyvalence en font l''un des choix les plus cohérents de la gamme Donic.'
WHERE (nom ILIKE '%Bluefire JP02%' OR nom ILIKE '%Bluefire JP 02%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Bluefire JP03 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Donic Bluefire JP03 est la version la plus souple et la plus contrôlée de la série Bluefire JP, avec une mousse bleue douce qui en fait le choix privilégié des joueurs allround offensifs et des attaquants cherchant une sécurité maximale dans leur jeu. Sa douceur de mousse lui confère un excellent ressenti et une tolérance à l''erreur supérieure aux autres membres de la famille JP.

Sa mousse souple allonge le temps de contact balle-raquette, offrant une sensation très "vivante" et un contrôle remarquable sur les balles difficiles, les récupérations et les blocs actifs. Les topspins générés avec le JP03 sont réguliers et spinés, avec une trajectoire arquée que l''adversaire doit gérer avec soin. Ce profil le rend particulièrement efficace au revers pour les joueurs qui construisent leur jeu progressivement.

Comparé aux autres revêtements souples du marché, le JP03 conserve les qualités distinctives de la gamme Bluefire JP — topsheet très adhérent, trajectoire directe — tout en les rendant accessibles aux joueurs qui n''ont pas encore la technique pour exploiter des mousses plus dures. Sa durabilité reconnue et sa facilité de prise en main en font également un excellent revêtement d''entraînement.

Recommandé pour les joueurs de niveau intermédiaire ou pour les joueurs avancés en position de revers, le Donic Bluefire JP03 est la porte d''entrée idéale dans l''univers des revêtements JP. Une valeur sûre dans le catalogue Donic.'
WHERE (nom ILIKE '%Bluefire JP03%' OR nom ILIKE '%Bluefire JP 03%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Tibhar Hybrid K3 ────────────────────────────────────────────
UPDATE produits SET description =
'Le Tibhar Hybrid K3 est l''un des revêtements les plus singuliers du catalogue Tibhar : un revêtement "hybride" qui combine un topsheet collant (tacky) à la manière des revêtements chinois avec la technologie de mousse haute performance caractéristique des fabricants européens. Ce mariage inédit offre un profil de jeu unique, à mi-chemin entre les deux grandes écoles du tennis de table mondial.

Avec sa mousse très dure (53°) et son topsheet à forte adhérence, le Hybrid K3 génère des niveaux de rotation extrêmes — comparables aux meilleurs revêtements chinois de type Hurricane — tout en bénéficiant d''un effet catapulte puissant grâce à l''élasticité européenne de sa mousse. La sensation à l''impact est ferme et directe, avec une réponse immédiate et percutante typique des joueurs qui recherchent la domination par la rotation.

Sa dureté élevée de 53° en fait un revêtement exigeant, réservé aux joueurs possédant une technique solide et habitués aux mousses dures. Les frappes doivent être franches et engagées pour exploiter pleinement la réactivité de la mousse. En contrepartie, les topspins générés sont dévastateurs de lourdeur et de vitesse, les services sont quasi-illisibles et le jeu court est d''une précision chirurgicale.

Particulièrement recommandé en coup droit pour les joueurs qui veulent explorer les avantages du jeu "chinois" sans quitter l''univers des grandes marques européennes, le Tibhar Hybrid K3 est un revêtement d''exception pour les compétiteurs ambitieux et techniquement avancés.'
WHERE nom ILIKE '%Hybrid K3%'
  AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Xiom Jekyll & Hyde (générique — variantes V/C/Z) ────────────
UPDATE produits SET description =
'La série Xiom Jekyll & Hyde représente une nouvelle génération de revêtements "hybrides" qui abolit la frontière traditionnelle entre revêtements européens tensors et revêtements asiatiques collants. Inspirée du personnage littéraire de Robert Louis Stevenson — tantôt raffiné, tantôt brutal — cette gamme incarne la dualité entre contrôle précis et attaque dévastatrice.

La technologie Dual Tension intégrée à la Jekyll & Hyde combine un topsheet à haute adhérence (légèrement collant selon les variantes) avec une mousse à haute élasticité, éliminant le besoin de boostage externe. Les picots plus courts et plus denses que dans les revêtements tensor classiques maximisent la surface de contact balle-raquette, générant des effets intenses même à faible vitesse d''impact.

La gamme se décline en trois familles : les versions V (Viscous), aux topsheets légèrement tackys inspirés des revêtements asiatiques ; les versions C (Chinese), plus collantes, imitant directement le style DHS ou Butterfly 09C ; et les versions Z (Zero glue), tensors purs sans tacky. Chaque famille existe en plusieurs duretés (47,5° à 57,5°) pour couvrir tous les profils de joueurs.

Recommandée aux joueurs offensifs modernes souhaitant exploiter la rotation maximale sans la complexité du boostage, la série Jekyll & Hyde convient aussi bien au coup droit qu''au revers. C''est l''un des choix les plus innovants du marché actuel pour les joueurs qui veulent dépasser les limites des revêtements tensors classiques.'
WHERE nom ILIKE '%Jekyll%' AND nom ILIKE '%Hyde%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Xiom');

-- ─── Andro NUZN (toutes variantes) ──────────────────────────────
UPDATE produits SET description =
'La série Andro NUZN (prononcer "new zone") représente l''aboutissement de la démarche data-driven du laboratoire Andro : pour la première fois, les paramètres de performance du revêtement ont été définis à l''aide de l''outil d''analyse Spinsight, qui mesure et quantifie objectivement la rotation, la vitesse et la précision générées par chaque configuration de picots et de mousse.

Le résultat est une gamme de revêtements "hybrides" qui combinent un topsheet extrêmement adhérent à une mousse innovante à gestion d''énergie optimisée au niveau moléculaire. Cette mousse offre une élasticité supérieure à celle des revêtements conventionnels tout en conservant une fermeté qui favorise les frappes directes et les topspins pénétrants. La formulation améliorée du topsheet garantit également une durabilité nettement supérieure à la moyenne, un argument fort pour les joueurs qui s''entraînent intensivement.

La gamme NUZN est déclinée en quatre duretés : 45° (le plus accessible, équilibre parfait puissance-contrôle), 48° (polyvalent et précis), 50° (ultra-moderne, pour le jeu topspin de précision) et 55° (le plus dur, pour un jeu implacable et maximaliste). Chaque version conserve la même philosophie de rotation maximale et de trajectoire arquée.

Comparé aux Rasanter, le NUZN est encore plus orienté spin et durée de vie. Pour les joueurs qui veulent un revêtement de nouvelle génération, fondé sur des données mesurables plutôt que sur une tradition marketing, Andro NUZN est une réponse sérieuse.'
WHERE nom ILIKE '%NUZN%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Andro');

-- ─── Yasaka Rakza 7 ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Yasaka Rakza 7 est le revêtement phare de la marque suédoise Yasaka, et l''un des revêtements offensifs les plus appréciés des joueurs de compétition cherchant équilibre et régularité. Depuis son lancement, le Rakza 7 s''est imposé comme une alternative solide aux revêtements allemands et japonais dans le segment intermédiaire-haut de gamme.

Sa caractéristique principale est l''incorporation d''une proportion accrue de caoutchouc naturel dans la composition du topsheet, ce qui lui confère une durabilité exceptionnelle — la surface conserve ses propriétés d''adhérence bien plus longtemps que la majorité des revêtements concurrents. Cette robustesse est couplée à un excellent grip qui assure des rotations constantes tout au long de la durée de vie du revêtement.

La mousse de dureté intermédiaire offre une réponse équilibrée : suffisamment rapide pour les attaques directes en coup droit, suffisamment douce pour les topspins construits au revers et les récupérations techniques. Le Rakza 7 excelle particulièrement dans les échanges réguliers à vitesse modérée, où sa grande consistance fait la différence dans les matchs longs et intenses.

Plébiscité par les joueurs de niveau régional à national qui souhaitent un revêtement fiable et durable, le Yasaka Rakza 7 représente un excellent rapport qualité-prix. Sa longévité le rend particulièrement économique sur la durée. Un choix classique et éprouvé pour tous les joueurs qui privilégient la constance à l''extrême performance.'
WHERE nom ILIKE '%Rakza 7%'
  AND nom NOT ILIKE '%Soft%'
  AND nom NOT ILIKE '%Extra%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

-- ─── Yasaka Rakza 7 Soft ─────────────────────────────────────────
UPDATE produits SET description =
'Le Yasaka Rakza 7 Soft est la déclinaison souple du célèbre Rakza 7, pensée pour les joueurs qui souhaitent les qualités de durabilité et de spin caractéristiques de la gamme Rakza dans un format plus confortable et plus tolérant. Sa mousse plus douce que le Rakza 7 standard allonge le temps de contact balle-raquette, favorisant les topspins réguliers et spinés au détriment de la vitesse brute.

Son profil de jeu est idéal pour le revers ou pour les joueurs qui ne pratiquent pas encore un jeu très engagé. La mousse souple absorbe mieux les variations d''impact — particulièrement les balles décentrées ou reçues sur le bord de la raquette — ce qui réduit le nombre de fautes directes et améliore la constance globale du jeu. Les services sont efficaces et réguliers, les récupérations sous pression plus sécurisées.

Comme le Rakza 7, il bénéficie de la formule enrichie en caoutchouc naturel de Yasaka, qui lui confère une durabilité bien supérieure à la moyenne des revêtements de cette catégorie. Cette longévité est un argument de poids pour les joueurs en développement qui s''entraînent souvent et souhaitent ne pas changer de revêtement trop fréquemment.

Recommandé pour les joueurs de niveau intermédiaire à avancé cherchant un revêtement souple de qualité, en position de revers ou comme choix principal pour un jeu basé sur le contrôle et les effets. Un revêtement qui dure et qui ne déçoit jamais.'
WHERE nom ILIKE '%Rakza 7 Soft%' OR nom ILIKE '%Rakza 7 S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

-- ─── Yasaka Rakza Z ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Yasaka Rakza Z est la version collante et ultra-spinée de la famille Rakza, intégrant un topsheet à forte adhérence (tacky) associé à une mousse "Power Sponge" plus dure que le Rakza 7. Ce mariage d''une surface collante et d''une mousse dynamique produit des niveaux de rotation parmi les plus élevés du marché, dans un revêtement homologué LARC accessible à un large public.

Son topsheet tacky accroche la balle de manière très prononcée, permettant des services extrêmement variés et difficiles à lire, des topspins très lourds même à faible vitesse d''impact, et une grande précision dans le jeu court. La mousse Power Sponge ajoute à cela la réactivité nécessaire pour conclure les échanges avec vitesse — un compromis réussi entre l''école chinoise (topsheet collant) et l''élasticité européenne.

La trajectoire générée par le Rakza Z est caractéristique : très arquée en topspin, avec une balle qui plonge fortement sur la table adverse et rebondit bas, rendant les retours très difficiles. Cette trajectoire convient parfaitement aux joueurs pratiquant un jeu rapproché de la table, avec des services liftés et des ouvertures en premier engagement.

Idéal pour les joueurs qui souhaitent explorer les avantages des revêtements collants sans la complexité du boostage ou le prix des revêtements chinois premium, le Yasaka Rakza Z est l''une des meilleures options du marché dans cette niche. Un revêtement moderne, original et très performant.'
WHERE nom ILIKE '%Rakza Z%'
  AND nom NOT ILIKE '%Extra%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

-- ─── Yasaka Rakza X ──────────────────────────────────────────────
UPDATE produits SET description =
'Le Yasaka Rakza X est la version la plus rapide et la plus dure de la famille Rakza, conçue pour les joueurs offensifs de haut niveau qui cherchent le maximum de vitesse sans renoncer à la rotation et à la sensation caractéristiques de la gamme. Avec sa mousse dure et son topsheet très adhérent, le Rakza X se positionne dans le segment des revêtements tensor premium les plus performants.

Sa mousse plus dure que le Rakza 7 génère un effet catapulte plus prononcé et une sortie de balle plus rapide, idéale pour les frappes directes, les contre-topspins accélérés et les smashes décisifs. Le topsheet conserve l''excellente adhérence et la durabilité supérieure de la gamme Rakza, grâce à sa formule enrichie en caoutchouc naturel, assurant des performances constantes tout au long de la vie du revêtement.

Le Rakza X excelle particulièrement en position de coup droit pour les joueurs pratiquant un topspin puissant et direct à mi-distance. Sa réponse ferme et linéaire convient aux joueurs qui ont confiance dans leur technique et qui cherchent à accélérer le jeu plutôt qu''à le contrôler. Comparé au Rakza Z, il est moins collant et plus rapide — un profil plus européen, plus catapultant.

Recommandé pour les compétiteurs de niveau avancé à élite, le Yasaka Rakza X offre un excellent positionnement prix face à des concurrents comme le Tibhar Evolution MX-P ou le Donic Bluefire M1. Une valeur sûre et performante dans le catalogue Yasaka.'
WHERE nom ILIKE '%Rakza X%'
  AND nom NOT ILIKE '%Soft%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

-- ─── Joola Dynaryz AGR ───────────────────────────────────────────
UPDATE produits SET description =
'Le Joola Dynaryz AGR est le revêtement le plus agressif et le plus rapide de la gamme Dynaryz, la série premium de la marque allemande Joola. Le sigle AGR — pour "Aggressive" — résume parfaitement sa philosophie : maximiser la vitesse et la puissance de frappe au service d''un jeu offensif implacable.

Son sponge HYPER BOUNCE à 50° est l''un des plus durs de la gamme Joola, offrant un effet catapulte très prononcé et une sortie de balle explosive. Couplé au topsheet ADVANCED TRACTION extrêmement adhérent, développé spécifiquement pour compenser les caractéristiques du ballon plastique 40+, le Dynaryz AGR génère des rotations intenses sur chaque topspin engagé, rendant les retours adverses très difficiles à contrôler.

Ce revêtement brille particulièrement dans les phases d''ouverture agressive, les contre-topspins à pleine vitesse et les troisièmes balles décisives. Sa réponse directe et percutante récompense les joueurs qui frappent fort et avec intention. Sa dureté élevée le réserve aux joueurs possédant une technique solide, capables d''exploiter la réactivité de la mousse sans subir de pertes de contrôle.

Le Dynaryz AGR est souvent cité comme l''une des meilleures alternatives aux revêtements Butterfly Dignics dans sa catégorie de prix. Pour les joueurs de compétition cherchant un revêtement de niveau international sans le prix de la marque japonaise, c''est une option de premier choix qui n''a rien à envier aux références du marché.'
WHERE nom ILIKE '%Dynaryz AGR%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ─── Joola Dynaryz ACC ───────────────────────────────────────────
UPDATE produits SET description =
'Le Joola Dynaryz ACC est le revêtement de référence de la gamme Dynaryz, représentant l''équilibre idéal entre les trois qualités essentielles d''un revêtement moderne : vitesse, rotation et contrôle. Le sigle ACC — pour "Accurate" — traduit la priorité donnée à la précision et à la polyvalence dans la conception de ce revêtement.

Sa mousse HYPER BOUNCE à 47,5° offre une dureté intermédiaire qui convient à la majorité des situations de jeu — des topspins construits aux frappes directes, des récupérations sous pression aux services variés. Le topsheet ADVANCED TRACTION garantit une adhérence élevée sur le ballon plastique, assurant des rotations constantes et puissantes sans les contraintes d''un revêtement ultra-dur.

Le Dynaryz ACC excelle dans les échanges à vitesse variable, où sa réponse équilibrée permet de s''adapter rapidement aux changements de rythme imposés par l''adversaire. C''est un revêtement "intelligent", qui s''adapte au style du joueur plutôt que de l''imposer — une qualité rare qui en fait un choix idéal aussi bien en coup droit qu''au revers pour les joueurs complets.

Recommandé pour les joueurs de niveau régional à national cherchant un revêtement haut de gamme polyvalent, le Joola Dynaryz ACC représente une des meilleures propositions de la marque. Son rapport qualité-prix face aux revêtements Tibhar ou Butterfly de même niveau en fait l''un des incontournables du marché actuel.'
WHERE nom ILIKE '%Dynaryz ACC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ─── Joola Dynaryz CMD ───────────────────────────────────────────
UPDATE produits SET description =
'Le Joola Dynaryz CMD est la version la plus douce et la plus contrôlée de la gamme Dynaryz, pensée pour les joueurs qui cherchent le confort de jeu, la sensation précise et la régularité dans les échanges. Le sigle CMD — pour "Comfortable" — reflète une approche centrée sur le plaisir de jeu et la maîtrise technique.

Avec sa mousse HYPER BOUNCE à 43°, le Dynaryz CMD est nettement plus souple que ses homologues AGR et ACC, ce qui lui confère une tolérance à l''erreur supérieure et une sensation très agréable à l''impact — ce que Joola décrit comme un "toucher plaisant et un son impressionnant". Ce dwell time allongé facilite la construction des topspins et le travail des effets sur les balles difficiles.

Malgré sa douceur, le Dynaryz CMD conserve la technologie ADVANCED TRACTION et HYPER BOUNCE qui caractérisent la gamme, offrant des performances bien au-dessus de ce que l''on pourrait attendre d''une mousse à 43°. La topsheet très adhérente assure des rotations constantes et efficaces, particulièrement appréciables au service et lors des ouvertures sur balle courte.

Recommandé pour le revers des joueurs offensifs, pour les joueurs de niveau intermédiaire cherchant à progresser avec un revêtement confortable, ou pour les joueurs plus âgés qui souhaitent réduire la fatigue sans sacrifier la performance, le Joola Dynaryz CMD est un choix éminemment polyvalent et accessible. Un excellent ambassadeur de la marque Joola.'
WHERE nom ILIKE '%Dynaryz CMD%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ══════════════════════════════════════════════════════════════════
-- Vérification : produits mis à jour avec une description
-- ══════════════════════════════════════════════════════════════════
SELECT p.nom, m.nom AS marque, LEFT(p.description, 80) AS extrait
FROM produits p
JOIN marques m ON m.id = p.marque_id
WHERE p.description IS NOT NULL
ORDER BY m.nom, p.nom;
