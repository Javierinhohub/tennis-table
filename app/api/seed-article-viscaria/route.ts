import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026viscaria"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = "alternatives-butterfly-viscaria-bois-offensifs-toucher"

  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .single()

  if (existing) {
    return NextResponse.json({ message: "Article already exists", id: existing.id })
  }

  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const admin = users?.users?.find(u => u.email?.toLowerCase() === "nasser.gasmi@gmail.com")

  const contenu = `Le **Butterfly Viscaria** est sans doute le bois de tennis de table le plus copié, analysé et commenté de l'histoire moderne. Depuis son lancement, il est devenu la référence absolue pour les joueurs offensifs recherchant un équilibre parfait entre vitesse, toucher de balle et contrôle.

Pourtant, il n'est pas le seul bois à mériter votre attention. Que vous trouviez le Viscaria trop cher, trop dur à trouver, ou simplement que vous souhaitiez explorer d'autres sensations tout en restant dans le même registre de jeu, cet article vous présente **14 alternatives sérieuses**, avec leur construction exacte couche par couche, leurs caractéristiques et leur prix.

![Raquette de tennis de table vue de profil montrant les couches de bois — chaque couche contribue à la vitesse et au toucher](https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Plywood_layers.jpg/640px-Plywood_layers.jpg)

## Le Butterfly Viscaria : la référence

Avant de comparer, il faut comprendre ce qui fait le Viscaria. Sa construction 7 plis (5 bois + 2 ALC) est devenue un standard :

**Construction :** Koto → ALC → Limba → Kiri → Limba → ALC → Koto

- **Épaisseur :** 5,8 mm
- **Poids :** ~87 g
- **Fibres :** ALC (Arylate-Carbon) placées sous le pli externe
- **Prix indicatif :** ~130 € / ~140 $

Le Koto en face externe donne un toucher sec et précis. Le Limba en couche intermédiaire apporte de la rigidité directe. Le Kiri en cœur absorbe les vibrations. Les fibres ALC placées juste sous le Koto amplifient la vitesse sans rendre le bois incontrôlable.

C'est cette alchimie que les 14 bois suivants tentent chacun à leur façon de reproduire, d'améliorer, ou de transposer à un autre niveau de budget.

![Tissu de fibres Arylate-Carbon (ALC) utilisé dans les bois offensifs modernes — mélange d'arylate et de carbone pour allier vitesse et ressenti](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Woven_carbon_fibre.jpg/640px-Woven_carbon_fibre.jpg)

## Les critères de sélection

Pour figurer dans ce comparatif, chaque bois devait répondre à ces critères :

- Style de jeu **offensif topspin** (équivalent OFF ou OFF+)
- Construction avec fibres composites (carbone, ALC ou équivalent)
- Bonne réputation en termes de **toucher de balle** et de **ressenti**
- Utilisable avec des revêtements tension européens ou japonais
- **Disponible à l'achat** avec un prix accessible

## Tableau comparatif général

| Bois | Construction (couche par couche) | Fibres | Épaisseur | Poids | Prix indicatif |
|------|-----------------------------------|--------|-----------|-------|----------------|
| Butterfly Viscaria *(réf.)* | Koto–ALC–Limba–Kiri–Limba–ALC–Koto | ALC outer | 5,8 mm | ~87 g | ~130 € |
| Butterfly Timo Boll ALC | Koto–ALC–Limba–Kiri–Limba–ALC–Koto | ALC outer | 5,7 mm | ~86 g | ~130 € |
| Yinhe Pro 01 ALC | Koto–ALC–Ayous–Kiri–Ayous–ALC–Koto | ALC outer | 5,7 mm | ~88 g | ~52 € |
| Butterfly Innerforce Layer ALC | Ayous–ALC–Ayous–Kiri–Ayous–ALC–Ayous | ALC inner | 6,0 mm | ~85 g | ~130 € |
| Butterfly Fan Zhendong ALC | Koto–ALC–Limba–Kiri–Limba–ALC–Koto | ALC outer | 5,8 mm | ~88 g | ~170 € |
| Stiga Carbonado 145 | Limba–Textreme C45°–Ayous–Ayous–Ayous–Textreme C45°–Limba | Textreme outer | ~5,9 mm | ~90 g | ~130 € |
| Andro Synteliac VCO OFF | Koto–Voltema Carbon–Ayous–Kiri–Ayous–Voltema Carbon–Koto | VC outer | ~5,8 mm | ~86 g | ~130 € |
| Donic Xtreme | Limba–STC Carbon–Ayous–Kiri–Ayous–STC Carbon–Limba | STC outer | ~5,8 mm | ~87 g | ~159 € |
| Xiom 36.5 ALX | Koto–Axylium–Limba–Kiri–Limba–Axylium–Koto | ALX outer | 5,7 mm | ~85 g | ~150 € |
| SANWEI Froster Pro | Koto–PLC–Ayous–Kiri–Ayous–PLC–Koto | PLC outer | ~5,7 mm | ~88 g | ~110 € |
| Joola Vyzaryz Freeze | Limba–AL-C–Limba–Kiri–Limba–AL-C–Limba | ALC outer | ~5,8 mm | ~85 g | 140-190 € |
| DHS Hurricane Long 5 | Limba–Arylate Carbon–Ayous–Ayous–Ayous–Arylate Carbon–Limba | AC outer | 6,0 mm | ~86 g | ~80 € |
| DHS W968 | Limba–AC inner–Ayous–Kiri–Ayous–AC inner–Limba | AC inner | ~6,0 mm | ~86 g | 350-500 € |
| Tibhar MK Carbon | Koto–Krypto Carbon–Ayous–Kiri–Ayous–Krypto Carbon–Koto | KC outer | 5,8 mm | ~86 g | ~165 € |
| OSP Virtuoso AC | Ayous–Aramid-Carbon–Ayous–Kiri–Ayous–Aramid-Carbon–Ayous | AC inner | 5,65 mm | ~85 g | ~178 € |

---

## Analyse détaillée par bois

### 1. Butterfly Timo Boll ALC

Le Timo Boll ALC est souvent décrit comme le "petit frère" du Viscaria. Sa construction est quasiment identique :

**Construction :** Koto → ALC → Limba → Kiri → Limba → ALC → Koto

- **Épaisseur :** 5,7 mm (légèrement plus fin que le Viscaria)
- **Poids :** ~86 g
- **Prix :** ~130 €

La différence avec le Viscaria est subtile : le TB ALC est très légèrement moins rigide, ce qui lui confère un poil plus de tolérance et de douceur de toucher. Il est excellent pour les joueurs qui trouvent le Viscaria un peu sec. Idéal pour le topspin à mi-table avec tension.

**Pour qui ?** Les joueurs passant du all-round au carbone, ou cherchant une sensation ALC plus douce que le Viscaria.

---

### 2. Yinhe Pro 01 ALC

Le Yinhe Pro 01 est la réponse chinoise au Viscaria, à moins de la moitié du prix. Conçu pour le joueur de Super Ligue Zhu Yi, il s'inspire directement de la structure Viscaria mais adapte les essences.

**Construction :** Koto → ALC → Ayous → Kiri → Ayous → ALC → Koto

- **Épaisseur :** 5,7 mm
- **Poids :** ~88 g (CS) / ~93 g (FL)
- **Prix :** ~52 € (directement depuis le fabricant)

La différence clé : le Yinhe remplace le Limba par de l'Ayous en couche intermédiaire. L'Ayous est légèrement plus souple que le Limba, ce qui rend le bois un peu plus indulgent et avec un toucher plus "rond". Moins de vitesse brute que le Viscaria, mais excellent rapport qualité-prix, surtout pour les joueurs en progression.

**Pour qui ?** Les joueurs recherchant la sensation ALC sans le prix Butterfly. Idéal pour les budgets serrés.

![Grain de l'Ayous (Obeche), essence intermédiaire la plus répandue dans les bois de compétition](https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Triplochiton_scleroxylon.jpg/640px-Triplochiton_scleroxylon.jpg)

---

### 3. Butterfly Innerforce Layer ALC

L'Innerforce Layer ALC adopte une philosophie radicalement différente : les fibres ALC sont placées **à l'intérieur** (inner fiber), non sous le pli externe.

**Construction :** Ayous → ALC (inner) → Ayous → Kiri → Ayous → ALC (inner) → Ayous

- **Épaisseur :** 6,0 mm
- **Poids :** ~85 g
- **Prix :** ~130 €

Résultat : un bois beaucoup plus "tendu" dans la sensation, avec un excellent temps de contact et un toucher très prononcé. L'Ayous en face externe (plus doux que le Koto) donne une sensation boisée et chaleureuse. C'est un ALC orienté toucher, pas vitesse brute. Réaction : 10,7 ; Vibration : 9,4 (données Butterfly).

**Pour qui ?** Les joueurs qui aiment le ressenti du bois tout en voulant la puissance du carbone. Parfait pour les topspins avec rebond long.

---

### 4. Butterfly Fan Zhendong ALC

Le bois officiel du n°1 mondial Fan Zhendong. Construction identique au Viscaria mais avec des matériaux encore plus sélectionnés et une fabrication au millimètre.

**Construction :** Koto → ALC → Limba → Kiri → Limba → ALC → Koto

- **Épaisseur :** 5,8 mm
- **Poids :** ~88 g
- **Prix :** ~170 € / ~185 $

C'est le Viscaria poussé à son maximum : plus rigide, plus rapide, avec une zone de frappe encore plus définie. Les plis de Koto et de Limba sont sélectionnés à la main pour leur homogénéité. La catapulte est plus franche. Ce bois demande une technique solide — il ne pardonne pas les mauvaises frappes.

**Pour qui ?** Les joueurs confirmés voulant plus que le Viscaria. Nécessite un bon niveau technique et des revêtements maîtrisés.

---

### 5. Stiga Carbonado 145

Le Carbonado 145 est l'approche Stiga du bois carbone offensif de haut niveau, avec la technologie propriétaire **Textreme** (fibre de carbone à 45°).

**Construction :** Limba → Textreme C45° → Ayous → Ayous → Ayous → Textreme C45° → Limba

- **Épaisseur :** ~5,9 mm
- **Poids :** ~90-92 g (légèrement plus lourd que la moyenne)
- **Prix :** ~130 €

Le **Textreme** est une fibre de carbone à tressage 45° de densité moyenne (100 g/m²), ce qui donne une transmission d'énergie très efficace et un son caractéristique "claqué". Le Limba en face externe (versus Koto sur le Viscaria) donne un toucher légèrement plus souple et une surface plus indulgente. Le cœur triple Ayous apporte de la flexibilité. Un bois très populaire chez les joueurs cherchant plus de puissance brute qu'avec un ALC classique.

**Pour qui ?** Les joueurs aimant les bois forts et directs, qui jouent proche de la table avec beaucoup de topspin de puissance.

---

### 6. Andro Synteliac VCO OFF

Le Synteliac VCO OFF est la réponse d'Andro à la demande en bois ALC extérieur. VCO = "Voltema Carbon Outer", la fibre propriétaire d'Andro placée directement sous le pli externe.

**Construction :** Koto → Voltema Carbon → Ayous → Kiri → Ayous → Voltema Carbon → Koto

- **Épaisseur :** ~5,8 mm
- **Poids :** ~86 g
- **Prix :** ~130 €

Le Voltema Carbon est décrit comme un ALC de haute qualité offrant une elasticité modérée. Le Koto en face externe crée une zone de frappe ferme et directe, très similaire au Viscaria. L'Ayous (versus Limba) en intermédiaire rend le bois légèrement plus doux et plus constant. Ce bois est apprécié pour sa régularité et sa polyvalence.

**Pour qui ?** Les joueurs recherchant un bois fiable et bien équilibré, intermédiaire entre le Viscaria et l'Innerforce.

---

### 7. Donic Xtreme

Le Donic Xtreme utilise la fibre STC (Super Thin Carbon), une fibre carbone ultra-fine développée en collaboration avec les industries sportives haut de gamme (cyclisme, voile, ski).

**Construction :** Limba → STC Carbon → Ayous → Kiri → Ayous → STC Carbon → Limba

- **Épaisseur :** ~5,8 mm
- **Poids :** ~85-90 g
- **Prix :** ~159 €

Le Limba en face externe donne un toucher plus doux que le Koto. La fibre STC est très fine, ce qui donne un bois avec une bonne sensibilité vibratoire — vous "sentez" vraiment la balle. C'est un bois avec un excellent feedback, moins "automatique" que certains ALC. Parfait pour les joueurs techniques qui aiment ressentir leur frappe.

**Pour qui ?** Joueurs techniques, amateurs de toucher de balle, qui jouent à mi-table ou proche de la table avec un jeu varié.

---

### 8. Xiom 36.5 ALX

Le 36.5 ALX de Xiom introduit deux technologies exclusives : **Axylium** (fibre arylate de nouvelle génération) et **Cold Press** (assemblage à basse température qui préserve les propriétés des fibres).

**Construction :** Koto → Axylium Carbon → Limba → Kiri → Limba → Axylium Carbon → Koto

- **Épaisseur :** 5,7 mm
- **Poids :** ~85 g
- **Prix :** ~150 €

L'**Axylium** est une fibre arylate offrant haute stabilité, peu de vibrations, toucher clair et puissance. La construction Cold Press préserve les propriétés élastiques du bois et des fibres. Résultat : un bois très proche du Viscaria en ressenti, avec une légère douceur supplémentaire due à la technologie Cold Press. Le son est caractéristique, très propre.

**Pour qui ?** Joueurs cherchant un ALC de haute qualité avec un son et une sensation très nets. Comparable au Viscaria avec un peu plus de douceur.

---

### 9. SANWEI Froster Pro

Le Froster Pro est l'un des meilleurs rapports qualité-prix du marché ALC haut de gamme. Il utilise des fibres PLC (Polyarylate Carbon) **fabriquées au Japon**, souvent comparées aux fibres ALC de Butterfly.

**Construction :** Koto → PLC (Arylate-Carbon JP) → Ayous → Kiri → Ayous → PLC → Koto

- **Épaisseur :** ~5,7 mm
- **Poids :** ~88 g
- **Prix :** ~110 € / 119 $

Le PLC est un matériau premium connu pour sa constance vibratoire et son retour d'énergie précis. L'Ayous (vs Limba) en intermédiaire donne un caractère légèrement plus souple que le Viscaria. Les avis le situent entre le Timo Boll ALC et le Viscaria en termes de vitesse, avec un excellent toucher. Une alternative sérieuse à moins de 120 $.

**Pour qui ?** Joueurs voulant la qualité ALC japonaise sans payer le prix Butterfly. Excellent pour les joueurs intermédiaires à avancés.

---

### 10. Joola Vyzaryz Freeze

Le Vyzaryz Freeze est la réponse premium de Joola à la demande des joueurs de haut niveau. Il utilise une technique de cuisson à basse température (**low temperature curing**) pour préserver les propriétés naturelles du bois et des fibres composites.

**Construction :** Limba → AL-C → Limba → Kiri → Limba → AL-C → Limba

- **Épaisseur :** ~5,8 mm
- **Poids :** ~85 g
- **Prix :** 140-190 €

La construction entièrement en Limba (4 plis bois) avec fibre AL-C (équivalent ALC) est unique dans ce comparatif. Le résultat est un bois très doux en toucher, avec une grande surface de frappe tolérante et un dwell time (temps de contact balle-bois) exceptionnellement long. C'est un ALC à l'âme boisée, avec une sensation presque all-round malgré sa vitesse. Son prix élevé reflète la technologie low-temperature curing.

**Pour qui ?** Joueurs experts cherchant un ALC atypique, très "bois", avec un touch exceptionnel. Budget premium.

---

### 11. DHS Hurricane Long 5

Le Hurricane Long 5 est le bois de Ma Long, légende mondiale du tennis de table. Il est conçu pour le jeu de puissance à la chinoise, avec des topspins dévastateurs.

**Construction :** Limba → Arylate Carbon → Ayous → Ayous → Ayous → Arylate Carbon → Limba

- **Épaisseur :** 6,0 mm (plus épais que la moyenne)
- **Poids :** ~86 g
- **Prix :** ~80-90 €

Avec 6,0 mm d'épaisseur et un triple cœur en Ayous, ce bois est plus lent que le Viscaria mais offre une tolérance et un contrôle supérieurs. La fibre Arylate Carbon (légèrement différente de l'ALC de Butterfly) donne de la puissance sans rigidité excessive. Il est particulièrement adapté aux revêtements chinois comme le Hurricane 3, mais fonctionne aussi avec des tensions. Son prix est très accessible.

**Pour qui ?** Joueurs inspirés par le jeu chinois, utilisant des revêtements chinois, ou cherchant un carbone plus doux et contrôlable. Excellent rapport qualité-prix.

---

### 12. DHS W968

Le W968 est le bois "National" de DHS — la version améliorée à la main, utilisée par l'équipe nationale chinoise. Il existe en plusieurs versions : commerciale, provinciale, nationale, et des éditions spéciales (Sun Yingsha, etc.).

**Construction :** Limba → Arylate Carbon (inner) → Ayous → Kiri → Ayous → Arylate Carbon (inner) → Limba

- **Épaisseur :** ~6,0 mm
- **Poids :** ~86 g
- **Prix :** 350 à 500 € (version nationale) — version commerciale ~100 €

La particularité du W968 national est que les fibres Arylate Carbon sont placées à l'intérieur (inner), plus proches du cœur. Résultat : vitesse élevée mais avec un toucher plus boisé que l'Hurricane Long 5. La sélection manuelle des plis de Limba et la fabrication au millimètre donnent une constance hors pair. C'est un bois de joueur d'élite.

**Pour qui ?** Collectors et joueurs de très haut niveau. La version commerciale est accessible mais moins performante que la nationale.

---

### 13. Tibhar MK Carbon

Développé en collaboration avec Kenta Matsudaira (penholder japonais de haut niveau), le MK Carbon est fabriqué **au Japon** avec la fibre propriétaire **Krypto Carbon**.

**Construction :** Koto → Krypto Carbon → Ayous → Kiri → Ayous → Krypto Carbon → Koto

- **Épaisseur :** 5,8 mm
- **Poids :** ~86 g
- **Prix :** ~165 € (TT11) / ~180-190 € selon revendeur

Le **Krypto Carbon** est un carbone à maillage haute densité tissé de manière innovante — très proche d'un ALC dans ses caractéristiques, avec peut-être un toucher légèrement plus cristallin. Koto en face externe + Krypto Carbon donne une sensation très similaire au Viscaria. Fabriqué au Japon, il bénéficie de la même qualité de fabrication que les bois Butterfly haut de gamme, à un prix parfois inférieur.

**Pour qui ?** Joueurs cherchant la qualité japonaise d'un bois ALC avec une identité de marque différente. Concurrent direct du Viscaria/TB ALC.

---

### 14. OSP Virtuoso AC

OSP est une marque artisanale tchèque produisant des bois **fait main** en petite série. Le Virtuoso AC est leur version composite avec fibre Aramid-Carbon en position interne.

**Construction :** Ayous → Aramid-Carbon (inner) → Ayous → Kiri → Ayous → Aramid-Carbon (inner) → Ayous

- **Épaisseur :** 5,65 mm
- **Poids :** ~85 g
- **Prix :** ~178 €

La fibre **Aramid-Carbon** est un hybride : le carbone apporte la rigidité et la vitesse, l'aramide régule le ressenti et absorbe les vibrations. En position inner, elle donne un toucher très boisé — comme si on jouait avec un 5 plis pur, mais avec la puissance du carbone. OSP revendique une épaisseur de 5,65 mm qui reproduit l'épaisseur classique de leurs bois all-wood Virtuoso, pour une continuité de sensation.

**Pour qui ?** Joueurs sensibles au toucher de balle, voulant la puissance du carbone sans perdre le feel du bois. Un bois artisanal unique.

![Structure multicouche d'un bois de raquette — les couches à gauche représentent un 5 plis all-round, à droite un bois carbone offensif](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Plywood_cross_section.jpg/640px-Plywood_cross_section.jpg)

## Synthèse : quel bois choisir selon votre profil ?

### Vous avez un petit budget (< 100 €)
**Yinhe Pro 01 ALC** (~52 €) ou **DHS Hurricane Long 5** (~80-90 €). Le Yinhe Pro 01 est remarquable pour ce prix — une construction ALC japonais inspirée du Viscaria, idéale pour les joueurs intermédiaires. Le DHS HL5 est parfait si vous utilisez des revêtements chinois ou cherchez plus de contrôle.

### Vous cherchez le clone le plus proche du Viscaria
**Butterfly Timo Boll ALC** (construction identique, légèrement plus doux), **Tibhar MK Carbon** (ALC japonais, Koto en face) ou **Andro Synteliac VCO OFF** (construction similaire, légèrement plus indulgent).

### Vous voulez plus de toucher de balle que le Viscaria
**Butterfly Innerforce Layer ALC** (ALC inner, très boisé), **OSP Virtuoso AC** (artisanal, aramide-carbone inner), ou **Joola Vyzaryz Freeze** (low temperature curing, Limba partout).

### Vous voulez plus de vitesse que le Viscaria
**Butterfly Fan Zhendong ALC** (Viscaria amélioré), **Stiga Carbonado 145** (Textreme, très punchy) ou **DHS W968 National** (vitesse d'élite).

### Vous êtes en quête de rapport qualité-prix exceptionnel
**SANWEI Froster Pro** (~110 €) offre des fibres PLC fabriquées au Japon pour bien moins cher que Butterfly. Un secret bien gardé de la communauté ping.

## Conclusion

Le Butterfly Viscaria reste une référence incontournable — et pour cause. Sa construction 7 plis avec ALC extérieur et Koto en face est une recette éprouvée. Mais il existe aujourd'hui une multitude de bois qui reprennent cette recette en y ajoutant leur touche propre : plus de douceur (Innerforce, OSP), plus de puissance (Fan Zhendong ALC, Stiga Carbonado), un meilleur rapport qualité-prix (Yinhe Pro 01, SANWEI Froster Pro), ou une âme artisanale (OSP, Joola Vyzaryz).

Le meilleur bois n'est pas celui qui ressemble le plus au Viscaria — c'est celui qui correspond le mieux à votre jeu, votre technique, et vos revêtements. Prenez le temps de lire les plis, de comprendre les fibres, et vous ferez un choix éclairé.`

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Les 14 meilleures alternatives au Butterfly Viscaria pour les offensifs",
    slug,
    extrait: "Timo Boll ALC, Fan Zhendong ALC, Stiga Carbonado 145, Yinhe Pro 01, Tibhar MK Carbon… Comparatif détaillé de 14 bois alternatifs au Butterfly Viscaria avec construction couche par couche, caractéristiques et prix pour les joueurs offensifs cherchant le toucher de balle.",
    contenu,
    categorie: "comparatif",
    publie: true,
    auteur_id: admin?.id || null,
  }).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, article: data?.[0] })
}
