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
-- Vérification : produits mis à jour avec une description
-- ══════════════════════════════════════════════════════════════════
SELECT p.nom, m.nom AS marque, LEFT(p.description, 80) AS extrait
FROM produits p
JOIN marques m ON m.id = p.marque_id
WHERE p.description IS NOT NULL
ORDER BY m.nom, p.nom;
