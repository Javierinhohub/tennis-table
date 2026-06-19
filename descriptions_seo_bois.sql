-- ══════════════════════════════════════════════════════════════════
-- Descriptions SEO — Bois (bois) les plus connus
-- Intro éditoriale 150-300 mots, optimisée pour le référencement
-- À exécuter dans Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- BUTTERFLY
-- ══════════════════════════════════════════════════════════════════

-- ─── Butterfly Viscaria ───────────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Viscaria est le bois de tennis de table la plus emblématique de l''histoire moderne du sport. Lancée en 1993 comme première bois ALC (Arylate-Carbon) au monde, elle a défini le standard des bois offensives en fibre composite pendant plus de trente ans — un record absolu dans ce domaine.

La technologie ALC combine des fibres d''Arylate souples et flexibles avec du carbone élastique. Le résultat est unique : la vitesse du carbone est tempérée par la sensation et la maniabilité de l''Arylate, offrant un profil de jeu à la fois explosif et contrôlable. Aucune autre combinaison de fibres n''a réussi à reproduire cet équilibre aussi universellement reconnu.

Sa tête compacte est un autre atout majeur : elle facilite les reprises rapides au rebond et les flips aggressifs sur les balles courtes, deux gestes clés du jeu de topspin moderne. La répartition des rebonds est homogène sur toute la surface de le bois, garantissant un comportement prévisible quelle que soit la zone de frappe.

Adoptée par des dizaines de champions mondiaux — de Jan-Ove Waldner à Ma Long, en passant par Fan Zhendong et de nombreux médaillés olympiques — la Viscaria est le bois de référence à laquelle toutes les autres sont comparées. Sa nouvelle version Viscaria Super ALC enrichit ce patrimoine avec des fibres Super ALC encore plus performantes. Un outil intemporel pour les joueurs offensifs de haut niveau.'
WHERE nom ILIKE '%Viscaria%'
  AND nom NOT ILIKE '%Super%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Viscaria Super ALC ────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Viscaria Super ALC est la version modernisée de la légendaire Viscaria originale, intégrant la nouvelle génération de fibres Super ALC pour repousser encore davantage les limites de vitesse tout en conservant l''équilibre caractéristique de la gamme. Lancée pour répondre aux exigences du ballon plastique 40+, elle incarne la continuité et l''évolution de la tradition ALC de Butterfly.

Les fibres Super ALC offrent une élasticité accrue par rapport à l''ALC classique, se traduisant par un effet catapulte légèrement plus prononcé et une sortie de balle plus rapide. La sensation à l''impact reste néanmoins caractéristique Butterfly — précise, directe et très lisible — ce qui facilite la transition pour les joueurs déjà habitués à la Viscaria ou à d''autres bois ALC.

Sa conception tête compacte héritée de la Viscaria originale reste un atout pour les joueurs qui jouent près de la table et doivent reprendre rapidement les balles courtes. Le bois récompense les frappes engagées et les topspins puissants tout en offrant suffisamment de retour d''information tactile pour ajuster la trajectoire et la vitesse en cours d''échange.

Recommandée pour les joueurs offensifs de niveau avancé à élite cherchant à maximiser leur vitesse de jeu sans perdre le contrôle distinctif de la gamme ALC, la Viscaria Super ALC s''impose comme le choix naturel pour ceux qui souhaitent faire évoluer leur équipement avec leur niveau de jeu.'
WHERE nom ILIKE '%Viscaria Super ALC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Timo Boll ALC ─────────────────────────────────────
UPDATE produits SET description =
'Le Butterfly Timo Boll ALC est l''une des bois les plus appréciées du catalogue Butterfly, portant le nom du joueur européen le plus titré de sa génération. Timo Boll a choisi ce bois en 2008 et l''a utilisée tout au long de sa carrière professionnelle, témoignant de ses qualités exceptionnelles et de son adaptabilité à un jeu complet, aussi bien en attaque qu''en récupération.

Construite en technologie ALC (Arylate-Carbon), elle partage la philosophie de la Viscaria : marier la rapidité du carbone au toucher et à la maniabilité de l''Arylate. Par rapport à la Viscaria, le Timo Boll ALC est légèrement plus ample dans sa tête, offrant une zone de frappe un peu plus large qui facilite les prises de balle à différentes hauteurs et angles — un avantage pour les joueurs au jeu varié.

Son profil de jeu est à la fois dynamique et précis, parfaitement adapté aux variations de vitesse, aux rotations soignées et aux blocs actifs caractéristiques du style de Timo Boll. Le bois répond aussi bien aux topspins puissants qu''aux contre-topspins rapides, en passant par les flips agressifs et les défenses en revers.

Devenu un classique incontournable de Butterfly, le Timo Boll ALC est recommandé pour les joueurs offensifs polyvalents de niveau avancé à élite. C''est souvent la première bois ALC de nombreux joueurs en progression, qui y trouvent un équilibre rassurant entre performance et contrôle.'
WHERE nom ILIKE '%Timo Boll ALC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Innerforce Layer ALC ─────────────────────────────
UPDATE produits SET description =
'Le Butterfly Innerforce Layer ALC inaugure une approche radicalement différente du placement des fibres composite dans un bois de tennis de table. Contrairement aux bois ALC classiques (Viscaria, Timo Boll ALC) qui placent les fibres en couche externe, l''Innerforce Layer ALC positionne les fibres ALC en couche interne, sous les placages de bois extérieurs.

Ce positionnement "inner" modifie profondément le profil de jeu : le contact avec la balle est amorti par le bois extérieur avant d''atteindre les fibres, ce qui allonge le temps de contact et offre une sensation plus douce et plus "boisée" tout en conservant la vitesse et la puissance des fibres composite. Le joueur ressent davantage la balle, ce qui améliore la lecture de l''adversaire et la précision du placement.

La trajectoire générée est plus arquée que sur un bois ALC classique, idéale pour les topspins liftés construits avec technique. Le bois excelle particulièrement en position de revers, où la douceur de contact facilite les ouvertures et les flips rapides. En coup droit, elle offre assez de puissance pour conclure les échanges sans nécessiter une frappe extrêmement engagée.

Recommandée pour les joueurs offensifs qui cherchent plus de sensation et de contrôle sans sacrifier la vitesse, l''Innerforce Layer ALC est un bois emblématique dans la gamme Butterfly. Un choix particulièrement pertinent pour les joueurs de style "tout-terrain" qui alternent entre zones de jeu et types de frappe avec fluidité.'
WHERE nom ILIKE '%Innerforce Layer ALC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ─── Butterfly Harimoto / Ovtcharov Inner Force ZLC ──────────────
UPDATE produits SET description =
'Les bois Butterfly Inner Force ZLC portant les noms de Tomokazu Harimoto et Dimitrij Ovtcharov appartiennent à la gamme Innerforce ZLC, le segment le plus rapide des bois inner-fiber de Butterfly. Le ZLC (Zylon-Carbon) est une fibre composite encore plus élastique et plus rapide que l''ALC, positionnée en couche interne pour combiner puissance extrême et toucher de bois préservé.

La technologie inner ZLC produit une réponse explosive et linéaire : la balle sort très vite de le bois avec une trajectoire tendue, idéale pour les joueurs qui dominent l''échange par la vitesse et la régularité des topspins puissants. Malgré cette rapidité, la position interne des fibres conserve une sensation au contact nettement supérieure à celle des bois outer-carbon, permettant d''ajuster finement les trajectoires et les effets.

Ces bois sont utilisées respectivement par Harimoto Tomokazu — multiple médaillé mondial japonais connu pour son jeu explosif proche de la table — et Dimitrij Ovtcharov, l''un des joueurs européens les plus constants au plus haut niveau international. Leur choix de cette architecture inner ZLC témoigne de sa capacité à soutenir un jeu de compétition mondial.

Réservées aux joueurs de niveau avancé à élite maîtrisant un topspin puissant des deux côtés, ces bois récompensent les frappes engagées et les joueurs capables de gérer une vitesse élevée en régularité. Un investissement premium pour ceux qui visent le plus haut niveau.'
WHERE (nom ILIKE '%Harimoto%' OR nom ILIKE '%Ovtcharov%')
  AND nom ILIKE '%Inner Force ZLC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ──────────────────────────────────────────────────────────────────
-- STIGA
-- ══════════════════════════════════════════════════════════════════

-- ─── Stiga Clipper CR WRB ────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Clipper CR WRB est peut-être le bois de tennis de table la plus vendue de l''histoire. Depuis sa création, le Clipper est devenu l''archétype de le bois allround de qualité : 7 plis d''Ayous, un profil équilibré et une maniabilité universelle qui en font le choix de prédilection des enseignants, des clubs et des joueurs cherchant un instrument fiable et durable.

La version CR (Combi-Revolution) intègre un traitement UV sur la partie supérieure de le bois qui accroît la rigidité et la vitesse sans modifier la sensation de base du bois. Le système WRB (Weight Balance, Rate of Recovery, Ball Sensitivity) est incorporé dans le manche creux, ce qui déplace le centre de gravité vers la tête de le bois, améliore la récupération entre les frappes et accroît la sensibilité tactile à l''impact.

Sa surface de jeu généreuse (157 × 151 mm) est légèrement plus grande que les bois offensives modernes, facilitant la prise de balle à différents points d''impact et réduisant les erreurs par manque de surface. La composition 7 plis tout-bois offre une sensation authentique et chaleureuse, plébiscitée par les joueurs qui aiment "sentir" la balle.

Utilisé à très haut niveau par des légendes comme Jan-Ove Waldner et Jörgen Persson, le Clipper CR WRB s''adresse aussi bien aux débutants avancés qu''aux joueurs de division nationale. C''est la référence absolue des bois allround en bois, un classique indémodable de la marque suédoise.'
WHERE nom ILIKE '%Clipper%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Cybershape Carbon ─────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Cybershape Carbon est l''une des bois les plus avant-gardistes de l''histoire du tennis de table. Sa forme hexagonale — une rupture totale avec la silhouette rectangulaire traditionnelle — n''est pas un simple choix esthétique : elle répond à une analyse biomécanique précise des zones d''impact réelles lors d''un échange de haut niveau.

La forme hexagonale rapproche la zone de frappe principale de la table, améliore la réactivité sur les balles courtes et les attaques en revers, et agrandit la surface de jeu utile de 11 % par rapport à un bois rectangulaire classique. Les angles tronqués éliminent les zones de le bois rarement utilisées en match, réduisant le poids mort et améliorant l''équilibre global.

Sa composition en carbone lui confère une vitesse élevée et une rigidité maîtrisée, idéale pour les joueurs qui pratiquent un jeu rapide et agressif des deux côtés de la table. Truls Möregård, médaillé d''argent aux Championnats du Monde 2021, a porté ce bois à la connaissance internationale en l''utilisant lors de ses exploits sur la scène mondiale.

Le Cybershape Carbon s''adresse aux joueurs offensifs curieux d''explorer une géométrie de bois inédite et de bénéficier d''une répartition des masses optimisée. Sa singularité requiert un temps d''adaptation, mais les joueurs qui l''adoptent rapportent unanimement un gain de réactivité sur les balles courtes et une meilleure aisance en revers. Un objet de tennis de table vraiment unique.'
WHERE nom ILIKE '%Cybershape%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Carbonado 45 ──────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Carbonado 45 est l''entrée de gamme de la famille Carbonado, la série de bois premium de Stiga intégrant les fibres TeXtreme Spread Tow Carbon de haute technologie. Parmi les trois modèles principaux (45, 145, 190), le Carbonado 45 est le plus souple, le plus contrôlé et le plus accessible, offrant une porte d''entrée idéale dans l''univers des bois carbone haut de gamme.

Les fibres TeXtreme utilisées dans le Carbonado 45 sont orientées à 45 degrés, ce qui génère une flexion courbe lors de l''impact. Cette architecture produit une trajectoire fortement arquée, avec des topspins qui montent haut et plongent ensuite profondément dans le camp adverse. Ce profil de trajectoire est très difficile à défendre et constitue l''une des signatures du Carbonado 45.

Sa dureté relative est plus faible que le 145 et le 190, ce qui lui confère une tolérance accrue et un temps de contact plus long. Les joueurs apprécient la sensation "vivante" de ce bois, qui communique clairement l''effet reçu et permet d''ajuster finement les productions de spin. Elle s''adapte aussi bien au coup droit qu''au revers.

Recommandé pour les joueurs de niveau intermédiaire à avancé qui souhaitent bénéficier de la technologie carbone Stiga sans l''exigence technique des modèles plus durs, le Carbonado 45 est également apprécié au revers des joueurs de niveau élite cherchant davantage d''effet et de contrôle. Un bois originale dans un marché souvent uniformisé.'
WHERE nom ILIKE '%Carbonado 45%'
  AND nom NOT ILIKE '%145%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Carbonado 145 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Carbonado 145 est le modèle intermédiaire de la famille Carbonado, conçu pour les joueurs offensifs qui recherchent un équilibre optimal entre la rapidité de le bois et la précision du jeu. Positionné entre le Carbonado 45 (plus souple, plus arqué) et le Carbonado 190 (plus dur, plus rapide), le 145 représente le "sweet spot" de la gamme.

Ses fibres TeXtreme orientées à un angle intermédiaire produisent une trajectoire équilibrée : suffisamment arquée pour passer le filet en sécurité dans les topspins construits, suffisamment tendue pour accélérer efficacement lors des frappes directes. Cette dualité est l''un des atouts majeurs du Carbonado 145, qui s''adapte à de nombreux styles de jeu.

La rigidité intermédiaire de le bois offre une bonne restitution d''énergie à l''impact, permettant des topspins puissants sans nécessiter une frappe très engagée. Le feedback est clair et précis, permettant au joueur d''évaluer rapidement la qualité de chaque coup et d''ajuster son jeu en conséquence. La composition bois-carbone lui confère une légèreté relative très appréciée dans les longues sessions d''entraînement.

Recommandé pour les compétiteurs de niveau avancé à national cherchant un bois carbone polyvalente, le Stiga Carbonado 145 convient aux joueurs qui souhaitent faire progresser leur vitesse de jeu sans perdre leur capacité à contrôler les échanges tactiques. Un choix cohérent et performant dans le catalogue Stiga.'
WHERE nom ILIKE '%Carbonado 145%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ─── Stiga Carbonado 190 ─────────────────────────────────────────
UPDATE produits SET description =
'Le Stiga Carbonado 190 est le fleuron de la famille Carbonado, le bois la plus rigide, la plus rapide et la plus exigeante de la série. Conçue pour les joueurs d''élite qui veulent dominer l''échange par la vitesse et la puissance, elle intègre des fibres TeXtreme Spread Tow Carbon de 100 g/m² orientées à 90 degrés, offrant une rigidité maximale et une trajectoire très tendue caractéristique.

L''orientation à 90 degrés des fibres CarboFlex produit ce que Stiga appelle une "flexural bendability" — une rigidité structurelle qui minimise la déformation de le bois à l''impact et maximise le transfert d''énergie vers la balle. Le résultat est une vitesse de sortie de balle très élevée, avec une trajectoire plate et pénétrante qui traverse rapidement la table adverse.

Sa rigidité élevée exige des frappes propres et bien senties. Les joueurs qui exploitent pleinement le Carbonado 190 sont ceux qui frappent fort et avec technique, en coup droit comme en revers. Les coups mous ou imprécis sont moins bien absorbés que sur des bois plus souples. En contrepartie, chaque frappe réussie est d''une efficacité redoutable.

Fabriqué en Suède avec les standards de qualité Stiga, le Carbonado 190 est réservé aux joueurs de niveau national à international qui cherchent la performance maximale. C''est le bois de référence pour les attaquants purs de la gamme Stiga, un outil d''expert pour les compétiteurs qui ne font aucun compromis sur la vitesse.'
WHERE nom ILIKE '%Carbonado 190%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ──────────────────────────────────────────────────────────────────
-- DONIC
-- ══════════════════════════════════════════════════════════════════

-- ─── Donic Zhang Jike Original Carbon ───────────────────────────
UPDATE produits SET description =
'Le Donic Zhang Jike Original Carbon est l''une des bois les plus emblématiques du catalogue Donic, portant le nom du joueur le plus titré de sa génération : Zhang Jike, double champion du monde et champion olympique avec l''équipe nationale de Chine. La composition de ce bois correspond exactement à la spécification utilisée par le champion lors de sa carrière active, développée en étroite collaboration avec les ingénieurs Donic.

Sa construction innovante associe une âme centrale en Kiri ultra-léger (le bois le plus léger utilisé en compétition), entourée de plis d''Ayous et de deux couches de Cured Aramid Carbon (CAC). Les placages extérieurs sont en Koto africain dur, ce qui confère à le bois une surface de contact ferme et directe tout en conservant la légèreté du Kiri au cœur.

Le résultat est un bois d''une puissance exceptionnelle avec une sensation de toucher remarquablement fine pour une construction aussi rapide. Les topspins sont pénétrants et purs, les frappes directes très convaincantes, et le retour d''information à chaque impact permet un ajustement précis des trajectoires. La légèreté de le bois facilite le jeu rapide et les changements de rythme.

Recommandée pour les joueurs offensifs de niveau avancé à élite qui apprécient les bois carbon inner-design avec une forte identité de jeu, le Donic Zhang Jike Original Carbon est un bois de champion pour les joueurs qui n''acceptent pas la médiocrité. Un hommage en bois et carbone à l''un des plus grands champions de tous les temps.'
WHERE nom ILIKE '%Zhang Jike Original Carbon%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Zhang Jike True Carbon ────────────────────────────────
UPDATE produits SET description =
'Le Donic Zhang Jike True Carbon est l''évolution moderne de le bois de champion portant le nom de Zhang Jike, conçue pour répondre aux exigences du jeu contemporain avec le ballon plastique 40+. "True Carbon" désigne la technologie de carbone utilisée dans sa construction : un placement des fibres carbone optimisé pour un transfert d''énergie maximal et une sensation de toucher authentique.

Sa conception s''inspire du bilan de l''Original Carbon tout en modernisant les matériaux et l''architecture pour mieux correspondre aux caractéristiques de la balle plastique, moins réactive que le celluloid. Les fibres carbone True Carbon ont été repositionnées pour compenser la perte d''élasticité de la balle, restituant les niveaux de vitesse et de rotation attendus d''un bois de haut niveau.

Le bois conserve la légèreté et le dynamisme de la tradition Zhang Jike chez Donic, avec une frappe directe, incisive et très communicative. Elle s''adresse aux joueurs offensifs de style proche de la table qui pratiquent un topspin puissant et des frappes directes décisives — exactement le profil de jeu de son parrain.

Positionnée comme le bois offensive premium de référence dans la gamme Donic actuelle, le Zhang Jike True Carbon concurrence directement les bois carbone Butterfly et Tibhar dans le même segment de prix. Un choix d''excellence pour les joueurs ambitieux qui veulent associer leur équipement au niveau le plus élevé du tennis de table mondial.'
WHERE nom ILIKE '%Zhang Jike True Carbon%'
  AND nom NOT ILIKE '%Inner%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Zhang Jike New Era ────────────────────────────────────
UPDATE produits SET description =
'Le Donic Zhang Jike New Era est le bois dédiée aux joueurs offensifs modernes qui recherchent un outil de progression vers le haut niveau sans les exigences techniques des bois carbone premium. Portant le nom du champion Zhang Jike, la New Era incarne une approche plus accessible de l''école offensive chinoise, adaptée aux joueurs en progression ou cherchant un intermédiaire entre tout-bois et carbone pur.

Sa construction tout-bois en 7 plis soigneusement sélectionnés offre une sensation chaleureuse et communicative à chaque frappe. Le bois est légèrement plus rapide qu''un allround classique sans atteindre la vitesse des constructions carbone, ce qui en fait un choix idéal pour les joueurs qui souhaitent développer leur jeu offensif sans se retrouver dépassés par leur propre bois.

Le Zhang Jike New Era excelle dans les topspins construits avec technique, les contre-attacks à mi-distance et les frappes directes sur balles semi-longues. Sa tolérance élevée et son bon retour d''information en font également un excellent choix pédagogique pour les joueurs en développement technique qui souhaitent affiner leur coup droit et leur revers dans les meilleures conditions.

Recommandée pour les joueurs de niveau intermédiaire à avancé voulant progresser vers un jeu plus offensif avec un équipement de qualité, la Donic Zhang Jike New Era représente un excellent rapport qualité-prix. Un point de départ idéal avant de passer aux constructions carbone plus exigeantes de la gamme Donic.'
WHERE nom ILIKE '%Zhang Jike New Era%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Classic Offensive ─────────────────────────────────────
UPDATE produits SET description =
'Le Donic Classic Offensive est l''une des bois tout-bois les plus connues du catalogue Donic, conçue spécifiquement pour les joueurs qui pratiquent un jeu offensif basé sur le topspin et les frappes directes. Son nom résume parfaitement sa philosophie : revenir aux fondamentaux de le bois offensive en bois massif, sans couche composite, pour une sensation de jeu authentique et une progressivité naturelle.

Sa composition 5 plis en bois sélectionnés lui confère une vitesse offensive notable tout en conservant le ressenti et la maniabilité d''un bois tout-bois. Le temps de contact avec la balle est plus long qu''avec un bois carbone, ce qui favorise les topspins très spinés et la précision dans le placement. Le bois communique clairement les effets reçus, permettant au joueur de s''adapter rapidement au jeu adverse.

Le Classic Offensive est particulièrement adapté aux joueurs qui souhaitent développer un topspin solide et régulier avant de passer aux bois composite. Sa tolérance à l''erreur est élevée et sa réponse prévisible, ce qui en fait un excellent outil pédagogique. Elle convient également aux joueurs confirmés qui préfèrent la sensation bois à la puissance carbone.

Reconnue pour sa durabilité et son équilibre, la Donic Classic Offensive est proposée à un prix très accessible, en faisant un bois idéale pour les clubs de formation et les joueurs en apprentissage du jeu offensif. Un indémodable du catalogue Donic, que des générations de joueurs ont utilisé pour construire leurs bases techniques.'
WHERE nom ILIKE '%Classic Offensive%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Original No.1 Senso ───────────────────────────────────
UPDATE produits SET description =
'Le Donic Original No.1 Senso est l''une des bois allround les plus respectées du catalogue Donic, alliant la polyvalence d''un jeu complet à la précision et la sensation offertes par la technologie Senso de Donic. Conçue pour les joueurs qui valorisent le contrôle, la régularité et la capacité à varier leur jeu, elle s''impose comme un outil d''excellence pour les compétiteurs techniques.

La technologie Senso intégrée dans le manche modifie la résonance vibratoire de le bois à l''impact, réduisant les vibrations parasites et amplifiant le retour d''information pertinent. Le joueur ressent plus clairement la qualité de chaque frappe — rotation reçue, vitesse de la balle, zone de contact — ce qui améliore la précision du placement et la construction tactique des points.

Sa composition tout-bois soigneusement équilibrée entre vitesse et contrôle la rend efficace dans un large spectre de situations : topspins construits, blocs actifs, contre-topspins, frappes directes et récupérations techniques. Elle s''adapte aussi bien au jeu près de la table qu''à mi-distance, avec une régularité que les bois plus rapides ont souvent du mal à maintenir.

Recommandée pour les joueurs de tous niveaux qui cherchent à développer leur jeu complet en s''appuyant sur un équipement fiable et communicatif, la Donic Original No.1 Senso est un excellent investissement à long terme. Sa durabilité reconnue et son prix raisonnable complètent un profil déjà très attrayant. Une référence incontournable dans l''univers des bois allround.'
WHERE nom ILIKE '%Original No%1%Senso%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ─── Donic Waldner Gold Edition ──────────────────────────────────
UPDATE produits SET description =
'Le Donic Waldner Gold Edition est un hommage au plus grand joueur de tennis de table de l''histoire européenne : Jan-Ove Waldner, surnommé "Mozart" pour l''élégance et la créativité de son jeu. Bois de la légende suédoise conçu en collaboration avec Donic, ce bois dorée incarne l''esthétique et la philosophie de jeu d''un champion hors normes, deux fois champion du monde et champion olympique.

Construite dans la tradition des bois allround offensif de Waldner, la Gold Edition propose une composition tout-bois équilibrée qui privilégie la sensation et la précision sur la vitesse brute. Le bois transmet parfaitement la balle, communique clairement les effets adverses et offre une maniabilité exceptionnelle dans toutes les situations de jeu — des courtes balles au jeu à mi-distance.

Son profil de jeu correspond au style légendaire de Waldner : variations de rythme imprévisibles, services complexes, retours déviants et topspins placés avec une précision chirurgicale. Le bois encourage la réflexion tactique et la diversité des coups plutôt que la puissance brute.

Bois iconique pour les joueurs qui admirent le style "old school" du tennis de table européen ou pour les collectionneurs de matériel de légende, la Donic Waldner Gold Edition est aussi une excellente bois de compétition pour les joueurs de niveau avancé qui préfèrent le contrôle à la vitesse. Un objet d''art autant qu''un instrument de jeu.'
WHERE nom ILIKE '%Waldner Gold%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Donic');

-- ══════════════════════════════════════════════════════════════════
-- TIBHAR
-- ══════════════════════════════════════════════════════════════════

-- ─── Tibhar Stratus Power Wood ───────────────────────────────────
UPDATE produits SET description =
'Le Tibhar Stratus Power Wood est le bois tout-bois offensive emblématique de la marque allemande Tibhar, conçue pour les joueurs qui souhaitent combiner puissance de frappe et sensation authentique du bois massif. Avec sa composition 5 plis sélectionnés, elle offre une vitesse offensive notable sans les compromis de sensation imposés par les bois composite.

Sa flexibilité est l''un de ses atouts distinctifs : Tibhar décrit la Stratus Power Wood comme un bois à "flexibilité illimitée", ce qui signifie qu''elle s''adapte à une très large palette de coups — des topspins construits en douceur aux frappes directes puissantes en passant par les flips agressifs. Cette polyvalence la rend aussi pertinente au revers qu''en coup droit.

Le Stratus Power Wood offre un temps de contact balle-raquette relativement long pour un bois de catégorie offensive, ce qui se traduit par une excellente capacité à charger les topspins en rotation. Les effets générés sont conséquents et difficiles à défendre, surtout lorsqu''ils sont combinés avec un revêtement tensor performant comme les revêtements de la gamme Evolution.

Recommandée pour les joueurs de niveau avancé à compétiteur national qui souhaitent progresser dans leur jeu offensif avec un bois tout-bois de qualité professionnelle, la Tibhar Stratus Power Wood est également largement utilisée par les entraîneurs comme bois de référence pour développer la technique de leurs élèves. Un incontournable du catalogue Tibhar.'
WHERE nom ILIKE '%Stratus Power Wood%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ─── Tibhar Samsonov Stratus Carbon ─────────────────────────────
UPDATE produits SET description =
'Le Tibhar Samsonov Stratus Carbon est la version composite de la célèbre gamme Stratus, portant le nom de Vladimir Samsonov — l''un des joueurs européens les plus talentueux et les plus complets de son époque. Ce bois carbone incarne la philosophie de jeu du Biélorusse : vitesse élevée au service d''un jeu varié, précis et redoutablement efficace.

L''intégration de fibres carbone dans la construction Stratus décuple la puissance de frappe tout en conservant une partie de la sensation caractéristique de la gamme bois. La rigidité supplémentaire offerte par le carbone accélère la balle et rend les topspins plus pénétrants et difficiles à défendre. Le bois est légère pour son niveau de vitesse, facilitant la récupération entre les frappes dans les échanges rapides.

Sa composition est étudiée pour maximiser le transfert d''énergie à l''impact tout en maintenant un feedback suffisant pour ajuster la trajectoire et la rotation. Ce profil la rend particulièrement efficace dans les exchanges rythmés à mi-distance, où la vitesse du carbone et la précision héritée de la Stratus se combinent de manière optimale.

Recommandée pour les joueurs offensifs de niveau avancé à national qui souhaitent faire le pas vers un bois carbone sans perdre entièrement les repères sensoriels du bois, la Tibhar Samsonov Stratus Carbon représente un excellent compromis. Elle conviendra notamment aux joueurs qui admirent le style de Samsonov et qui cherchent un bois rapide mais lisible.'
WHERE nom ILIKE '%Samsonov Stratus Carbon%' OR nom ILIKE '%Stratus Carbon%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ══════════════════════════════════════════════════════════════════
-- JOOLA
-- ══════════════════════════════════════════════════════════════════

-- ─── Joola Fever ─────────────────────────────────────────────────
UPDATE produits SET description =
'La Joola Fever est l''une des bois allround offensif les plus appréciées du catalogue Joola, conçue pour les joueurs qui cherchent un outil polyvalent capable de soutenir un jeu complet — attaque, défense active, variation de rythme — sans les contraintes des bois très rapides. Son nom évoque l''intensité et la passion du jeu de compétition.

Sa composition tout-bois équilibrée offre une sensation chaleureuse et communicative à chaque frappe. Le temps de contact prolongé avec la balle permet de charger efficacement les topspins et de viser précisément les zones adverses, tandis que la vitesse modérée laisse le temps d''ajuster les trajectoires et d''évaluer les retours. Ces qualités en font un bois idéale pour développer la technique offensive dans de bonnes conditions.

La Fever excelle particulièrement dans les phases d''échange régulier à mi-distance, où sa régularité et sa prévisibilité permettent de construire des points méthodiquement. Elle est également très efficace au service-réception, phase où la sensation du bois aide à ressentir les effets adverses et à y répondre avec précision.

Recommandée pour les joueurs de niveau intermédiaire à avancé souhaitant un bois polyvalent et durable, la Joola Fever représente un excellent rapport qualité-prix dans la gamme Joola. Sa durabilité éprouvée et sa facilité de prise en main en font aussi un choix populaire dans les clubs pour les séances d''entraînement intensif. Un classique de la marque allemande.'
WHERE nom ILIKE '%Fever%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ─── Joola Evoke Carbon ──────────────────────────────────────────
UPDATE produits SET description =
'La Joola Evoke Carbon est le bois carbone offensive de Joola destinée aux joueurs qui franchissent le cap du composite pour la première fois ou qui recherchent un bois carbone abordable sans sacrifier les performances. Son profil équilibré entre vitesse carbone et maniabilité accessible en fait l''une des introductions les plus réussies au jeu carbone dans le catalogue Joola.

L''intégration de couches carbone dans sa construction multiplie l''effet catapulte et la vitesse de sortie de balle par rapport aux bois tout-bois de la marque. Les topspins deviennent plus pénétrants et les frappes directes plus tranchantes, sans pour autant atteindre la brutalité des bois carbone haut de gamme qui exigent un niveau technique élevé. La transition depuis un bois tout-bois reste gérable pour la plupart des joueurs en progression.

Sa légèreté et son équilibre soigné facilitent les reprises rapides et la gestion des échanges à rythme élevé. Les joueurs apprécient la réponse directe et assez communicative, qui leur permet de garder le contrôle du jeu malgré l''augmentation de vitesse. Elle s''adapte bien à différents types de revêtements, du tensor souple au tensor dur.

Recommandée pour les joueurs de niveau avancé ou les joueurs de club qui souhaitent intégrer un bois carbone dans leur pratique sans un investissement trop important, la Joola Evoke Carbon est une porte d''entrée cohérente et performante dans l''univers composite Joola.'
WHERE nom ILIKE '%Evoke%' AND nom ILIKE '%Carbon%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ══════════════════════════════════════════════════════════════════
-- Vérification : bois mis à jour avec une description
-- ══════════════════════════════════════════════════════════════════
SELECT p.nom, m.nom AS marque, LEFT(p.description, 80) AS extrait
FROM produits p
JOIN marques m ON m.id = p.marque_id
WHERE p.description IS NOT NULL
ORDER BY m.nom, p.nom;
