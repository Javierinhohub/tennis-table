import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026collesupdate"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = "colles-tennis-de-table-comparatif-revolution-3-dhs"

  const contenu = `Souvent négligée, la colle est pourtant l'un des maillons les plus importants de votre setup. Elle conditionne la transmission des vibrations, l'accroche du revêtement sur le bois, et peut même influencer légèrement la sensation de jeu. Depuis l'interdiction des colles à solvant par l'ITTF en 2008, le marché s'est réorienté vers les **colles à l'eau** (VOC free), et les formulations ont considérablement évolué.

Dans ce comparatif, on met à l'honneur deux colles incontournables — la **Revolution N°3** et la **DHS N°15** — et on les confronte à trois autres références du marché : la Butterfly Free Chack II, la Donic Vario Clean et la Neottec Aqua Glue.

## Pourquoi la colle à l'eau est devenue un art

Avant 2008, les colles à solvant (speed glue) étaient utilisées par tous les joueurs de haut niveau pour leurs effets boosters : la colle dilatait le sponge du revêtement et augmentait l'effet catapulte. Depuis l'interdiction, les fabricants ont développé des colles à l'eau performantes qui cherchent à maximiser :

- **L'élasticité** de la couche de colle (pour préserver la nature du revêtement)
- **La tenue** (solidité de l'adhésion pendant le jeu)
- **La facilité de dégommage** (retrait propre sans déchirer le sponge)
- **La compatibilité** avec les différents types de sponge (tension, mousse chinoise, picots)

La viscosité joue un rôle clé : une colle trop fluide pénètre trop profondément dans les pores du sponge et peut fragiliser la mousse au dégommage. Une colle trop épaisse est difficile à étaler uniformément.

## Comparatif des 5 colles

| Colle | Viscosité | Tenue | Dégommage | Temps de séchage | Prix indicatif |
|-------|-----------|-------|-----------|-----------------|----------------|
| Revolution N°3 | 3 options (fine/médium/épaisse) | Bonne | Excellent | ~15-20 min | ~17 € / 100 ml |
| DHS N°15 | Épaisse | Très bonne | Excellent | ~10-15 min | ~10 € / 98 ml |
| Butterfly Free Chack II | Fine à médium | Moyenne | Très bon | ~15 min | ~12 € / 50 ml |
| Donic Vario Clean | Fine | Bonne | Bon | ~12 min | ~12 € / 90 ml |
| Neottec Aqua Glue | Médium | Très bonne | Très bon | ~15-20 min | ~12 € / 100 ml |

---

## Revolution N°3 — la colle à l'eau la plus aboutie du marché européen

La **Revolution N°3** (TTRevolution) est sans conteste la colle à l'eau qui a le plus fait parler d'elle ces dernières années. Elle est produite en **trois viscosités distinctes** — normale (fine), médium et épaisse — ce qui en fait une solution polyvalente pour tous les types de revêtements.

### Construction et technologie

La Revolution N°3 repose sur une **formulation bio-élastique sans COV** (Composés Organiques Volatils). L'élasticité de la couche sèche est sa caractéristique principale : une fois collée, la colle forme un film souple qui amortit les vibrations tout en maintenant une adhésion ferme. C'est ce film élastique qui distingue la Rev3 de la plupart des colles standards.

Elle bénéficie également d'un **effet auto-lissant** : une fois appliquée, elle se nivelle d'elle-même pour donner une couche parfaitement homogène, sans bulles ni irrégularités.

### Viscosité : laquelle choisir ?

- **Normale (fine)** : idéale pour les revêtements europèens à tension et les sponges à petits pores (Butterfly Tenergy, Dignics, Tibhar Evolution). La colle pénètre légèrement sans saturer.
- **Médium** : le meilleur équilibre pour la grande majorité des setups. Convient aux revêtements chinois de type Hurricane avec sponge bleu ou orange, et aux tensions europèennes standard.
- **Épaisse (high)** : recommandée pour les sponges à larges pores (Hurricane 3 pro bleu, sponge très poreux) où une colle fine disparaîtrait trop rapidement.

### Dégommage

C'est l'un des points forts absolus de la Revolution N°3. Le revêtement se décolle **en un seul morceau**, proprement, sans résidu ni déchirure. La lame reste parfaitement propre après dégommage — même après de nombreux recollages. Un point particulièrement apprécié des joueurs qui changent souvent de revêtements.

### Pour qui ?

Joueurs qui changent régulièrement de revêtements, joueurs utilisant des revêtements tension ou des revêtements chinois, clubs cherchant une colle polyvalente pour tous profils de joueurs.

**Prix :** ~17 € / 100 ml — disponible chez la plupart des revendeurs français spécialisés (tabletennis11.fr, vsport, misterping.com).

---

## DHS N°15 Aquatic — la référence pour les revêtements chinois

La **DHS N°15 Aquatic** est la colle phare du géant chinois Double Happiness (DHS). C'est la **première colle sans COV approuvée par l'ITTF en Chine**, et elle reste la colle de référence des joueurs utilisant des revêtements chinois comme le Hurricane 3, Hurricane 8 ou National Hurricane.

### Caractéristiques techniques

La DHS N°15 est une colle **à viscosité épaisse**, spécifiquement conçue pour les sponges à larges pores des revêtements chinois. Elle crée une couche d'adhésif dense qui remplit parfaitement les cavités du sponge, assurant une cohésion optimale avec le bois.

Son élasticité est supérieure à la moyenne des colles à l'eau : la couche de colle reste souple après séchage, ce qui contribue à préserver le "dôme" naturel du revêtement lors du collage sous pression. C'est ce qui en fait le choix privilégié des joueurs pratiquant le jeu chinois et cherchant à optimiser la catapulte de leur Hurricane.

### Viscosité et application

La DHS N°15 est **épaisse dès la sortie du tube**. Elle s'applique avec le pinceau fourni de manière uniforme, en une ou deux couches selon le type de revêtement. Attention : certains lots ont tendance à sécher rapidement sur l'éponge d'application si l'on n'est pas assez rapide — il vaut mieux travailler par petites sections.

### Dégommage

Excellent. Le film de colle se retire **en une seule prise**, sans résidu sur le bois ni sur le sponge. La DHS N°15 laisse les deux surfaces parfaitement propres, y compris après de nombreuses utilisations successives.

### Pour qui ?

Joueurs utilisant des revêtements chinois (Hurricane 3, H8, DHS Legend, Skyline...), joueurs penholder pratiquant le jeu asiatique, joueurs cherchant une colle épaisse fiable à prix accessible.

**Prix :** ~10 € / 98 ml — l'un des meilleurs rapports qualité-prix du marché. Disponible sur tabletennis11.fr, misterping.com et amazon.fr.

---

## Butterfly Free Chack II — optimisée pour les Spring Sponge

La **Butterfly Free Chack II** est la colle officielle de Butterfly, conçue spécifiquement pour les revêtements à **sponge de printemps (Spring Sponge)** comme les Tenergy et Dignics. Elle est la successeure de la Free Chack originale, avec une formulation renforcée pour une meilleure adhésion.

### Caractéristiques

Colle fluide à médium, sans COV, homologuée ITTF. Elle génère un bond plus solide que la Free Chack première génération tout en conservant une excellente facilité de retrait. La compatibilité avec les sponges Butterfly est sa force principale : Butterfly ayant conçu ses revêtements et sa colle en symbiose, les performances sont optimisées ensemble.

### Limites

La Free Chack II n'est **pas la meilleure option pour les revêtements chinois** à sponge épais et poreux : sa viscosité fine ne permet pas de remplir correctement les larges pores. Pour un Hurricane, mieux vaut se tourner vers la DHS N°15 ou la Revolution N°3 médium/épaisse.

**Prix :** ~12 € / 50 ml · ~20 € / 100 ml. Plus chère au ml que ses concurrentes.

---

## Donic Vario Clean — le meilleur rapport qualité-prix

La **Donic Vario Clean** est la colle économique de référence en Europe. Disponible dans la plupart des clubs et shops, elle est accessible, facile à appliquer et suffisamment performante pour les joueurs occasionnels à intermédiaires.

### Caractéristiques

Colle fine, fluide, à séchage rapide (~12 minutes). Elle convient principalement aux sponges à petits pores (tension européenne, picots courts). Sa viscosité basse lui permet de s'étaler facilement, mais elle peut saturer un sponge chinois poreux si on l'applique en trop grande quantité.

### Dégommage

Correct mais moins propre que la Revolution N°3 ou la DHS N°15, notamment sur les sponges plus poreux où la colle pénètre davantage. Sur les revêtements tension standard, le dégommage reste satisfaisant.

**Prix :** ~12 € / 90 ml. Très accessible, disponible en grandes surfaces sportives (Decathlon) et dans tous les shops spécialisés.

---

## Neottec Aqua Glue — la colle allemande polyvalente et fiable

La **Neottec Aqua Glue** est la colle à l'eau de la marque allemande Neottec, reconnue pour la qualité de ses équipements. Elle se distingue par son excellent équilibre entre performance et facilité d'utilisation, et s'adresse autant aux joueurs intermédiaires qu'aux compétiteurs réguliers.

### Caractéristiques techniques

Colle à **viscosité médium**, sans COV, homologuée ITTF. Sa formulation offre une **très bonne tenue** une fois sèche, avec un film élastique qui préserve bien les propriétés du revêtement. Elle convient à une large gamme de sponges : tensions européennes, revêtements japonais et revêtements chinois modérément poreux.

Son application est particulièrement agréable : la colle s'étale de façon homogène sans former de grumeaux, et le temps ouvert (avant séchage complet) est suffisamment long pour recentrer son revêtement sans stress.

### Dégommage

Très bon. Le film de colle se retire proprement en un seul morceau sur la plupart des sponges, avec peu ou pas de résidu sur la lame. Légèrement en-deçà de la Revolution N°3 sur les sponges très poreux, mais nettement au-dessus de la Donic Vario Clean.

### Pour qui ?

Joueurs intermédiaires à avancés cherchant une colle fiable et facile à utiliser, joueurs utilisant des revêtements tension européens ou japonais, clubs souhaitant une alternative de qualité à la Butterfly Free Chack II à prix équivalent.

**Prix :** ~12 € / 100 ml. Bon rapport qualité-prix, disponible sur tabletennis11.fr et les principaux revendeurs européens.

---

## Comment bien coller son revêtement

Quelle que soit la colle choisie, la technique d'application est déterminante pour le résultat :

**1. Nettoyer les surfaces.** Avant tout recollage, retirez l'ancienne colle proprement. Une surface propre est indispensable pour une adhésion optimale.

**2. Appliquer une couche fine et uniforme** sur le sponge ET sur le bois, avec une éponge ou un pinceau propre.

**3. Laisser sécher complètement.** La colle doit être transparente et non-collante au toucher (15-20 minutes selon les conditions). Ne pas coller à chaud ou humide.

**4. Coller sous pression.** Posez le revêtement sur le bois, centrez-le, et passez un rouleau ou une bouteille dessus pour éliminer les bulles d'air.

**5. Laisser reposer** 1-2 heures avant de jouer pour que la liaison soit optimale.

## Quelle colle choisir selon votre profil ?

- **Revêtements chinois (Hurricane, DHS Legend, Skyline...)** : DHS N°15 ou Revolution N°3 épaisse. La viscosité haute est indispensable pour les larges pores.
- **Revêtements tension européens ou japonais (Tenergy, Dignics, Evolution...)** : Butterfly Free Chack II (si budget) ou Revolution N°3 normale/médium.
- **Joueur occasionnel, petit budget** : Donic Vario Clean. Accessible partout, facile à utiliser.
- **Joueur changeant souvent de revêtements** : Revolution N°3. Son dégommage irréprochable préserve lame et sponge.
- **Setup mixte (un côté chinois, un côté tension)** : DHS N°15 d'un côté, Revolution N°3 médium de l'autre. Ou la Revolution N°3 médium pour les deux.
- **Joueur penholder avec Hurricane en coup droit** : DHS N°15, sans hésitation.
- **Joueur cherchant une colle polyvalente de qualité allemande** : Neottec Aqua Glue, un excellent choix pour les tensions toutes marques.

## Conclusion

Aucune colle ne convient à tous les setups : le bon choix dépend du type de sponge, de la fréquence de recollage, et du budget. La **Revolution N°3** est la colle la plus polyvalente et la plus aboutie techniquement — ses trois viscosités couvrent quasiment tous les cas. La **DHS N°15** est imbattable pour les revêtements chinois et représente un rapport qualité-prix exceptionnel. Pour le reste, la Butterfly Free Chack II reste la référence officielle Butterfly, la Donic Vario Clean le choix économique intelligent, et la **Neottec Aqua Glue** une alternative sérieuse et polyvalente méritant sa place dans tout shop qui se respecte.

Prenez le temps de choisir la bonne viscosité, respectez le temps de séchage, et votre revêtement tiendra parfaitement — match après match.`

  const { error } = await supabaseAdmin
    .from("articles")
    .update({
      titre: "Colles tennis de table : comparatif Revolution N°3, DHS N°15 et 3 alternatives",
      extrait: "Revolution N°3, DHS N°15, Butterfly Free Chack II, Donic Vario Clean, Neottec Aqua Glue : comparatif complet de 5 colles à l'eau avec viscosité, tenue, dégommage et prix. Quelle colle choisir selon votre revêtement et votre style de jeu ?",
      contenu,
    })
    .eq("slug", slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, message: "Article updated — Falco replaced by Neottec" })
}
