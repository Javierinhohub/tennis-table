import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Zyre 03 vs Dignics 09C vs Dignics 05 : le grand comparatif Butterfly

Si vous avez regardé les équipements des meilleurs joueurs mondiaux ces deux dernières années, vous avez forcément croisé ces trois noms. Ensemble, le Zyre 03, le Dignics 09C et le Dignics 05 équipent une part écrasante du top mondial masculin et féminin. Ils partagent la même maison — Butterfly — et la même technologie de mousse de base — le Spring Sponge X. Mais ils ont des personnalités radicalement différentes, et confondre l'un avec l'autre peut coûter cher à votre jeu.

Ce comparatif n'est pas une liste de chiffres marketing. C'est une tentative honnête d'expliquer ce qui distingue réellement ces trois plaques, à qui elles sont destinées, et pourquoi tant de joueurs d'élite ont fait des choix différents alors qu'ils avaient accès aux mêmes revêtements.

## La famille Spring Sponge X : un point de départ commun

Avant d'entrer dans le détail, il faut comprendre pourquoi ces trois plaques sonnent si souvent "pareil" dans les discussions en ligne. Elles partagent toutes le Spring Sponge X, la mousse haute performance de Butterfly introduite pour remplacer le Spring Sponge d'origine. Cette mousse est réputée pour sa capacité à accumuler de l'énergie lors du contact avec la balle — une élasticité quasi instantanée qui produit une accélération franche au moment de la décompression.

C'est la base. Ce qui les différencie, c'est tout ce qui est au-dessus : la composition de la feuille de caoutchouc, son degré de friction, sa rigidité, et la façon dont elle interagit avec la mousse à l'impact. Et ces différences, sur une balle qui voyage à 80 km/h, changent absolument tout.

## Butterfly Dignics 05 : la machine à rotation pure

### La philosophie

Le Dignics 05 est sorti en 2018 et il a rapidement imposé un nouveau standard pour les revêtements européens haut de gamme. Sa feuille de caoutchouc est non collante — typiquement "européenne" dans ses sensations — mais d'une friction exceptionnellement élevée. Quand vous brossez la balle, les picots accrochent et transmettent un effort de rotation considérable vers la mousse, puis vers la balle. C'est cet accrochage qui fait la réputation du 05.

### Ce qu'il produit sur la balle

Le Dignics 05 génère un arc haut et lourd. Quand il est bien utilisé, les topspins ont une trajectoire qui monte, passe haut au-dessus du filet, et plonge brusquement de l'autre côté — un profil de balle que les adversaires décrivent souvent comme "difficile à relire" parce que le rebond est imprévisible en vitesse et en angle. La rotation est l'outil principal : c'est avec elle que vous contrôlez la table, pas avec la vitesse brute.

Ce profil de balle en arc haut offre aussi une marge de sécurité confortable au-dessus du filet. Pour des joueurs comme Timo Boll ou Hugo Calderano — tous deux reconnus pour des topspins construits, précis et très chargés en rotation —, c'est exactement ce qu'il faut.

### La limite

Le Dignics 05 est exigeant. Sa dureté de mousse et la précision requise dans le geste signifient que les balles mal frappées ne sont pas "rattrapées" par la plaque — elles partent dans le filet ou hors de la table. Il ne pardonne pas les approximations de timing. Sur les balles très coupées au service adverse, il faut une gestuelle propre pour ouvrir sans que la balle glisse sous la raquette. C'est une plaque qui demande un engagement physique constant et une technique solide.

### Pour qui ?

Le Dignics 05 est le choix du loopeur pur, celui qui construit ses points autour d'une rotation massive et d'un arc sécurisant. C'est une plaque pour joueurs avancés, techniquement fiables, qui veulent maximiser l'effet mis dans chaque frappe.

---

## Butterfly Dignics 09C : le mariage du Est et de l'Ouest

### La philosophie

Le Dignics 09C, sorti en 2019, est probablement le revêtement le plus fascinant — et le plus discuté — du tennis de table moderne. Son nom contient le "C" de "Chinese" : sa feuille de caoutchouc est collante (tacky), comme les revêtements chinois traditionnels. Mais elle est montée sur le Spring Sponge X, une mousse à l'énergie typiquement japonaise. C'est un hybride délibéré.

### Ce qu'il produit sur la balle

La surface collante change fondamentalement la relation avec la balle au moment du contact. Là où le 05 accroche principalement à travers la friction lors du brossage, le 09C colle et retient la balle une fraction de seconde supplémentaire — ce qui permet d'imprimer une rotation monstrueuse, y compris sur des balles très coupées ou très courtes. L'ouverture sur balle coupée, exercice redouté avec le 05, devient beaucoup plus naturelle avec le 09C parce que la surface attrape la balle avant même que le geste ne soit parfait.

La trajectoire est différente : plus catapultée, plus directe que le 05. La balle part vite, avec beaucoup d'effet, mais avec un arc légèrement moins haut. Elle est perçue comme plus "lourde" par les adversaires car la rotation imprimée par la surface collante est d'un type particulier — elle "mord" davantage sur la raquette de l'adversaire.

C'est la plaque de Tomokazu Harimoto, de Truls Möregård et d'une génération de joueurs qui aiment une balle agressive dès la troisième frappe, capable d'ouvrir sur n'importe quelle longueur et n'importe quel effet reçu.

### La limite

La surface collante demande de l'entretien : elle ramasse la poussière, elle se salit, elle perd de son adhérence si elle n'est pas protégée entre les séances. Elle réagit aussi différemment selon l'humidité ambiante. Dans certaines salles sèches ou très humides, le comportement peut varier. Par ailleurs, les blocs et les poussettes demandent une légère adaptation par rapport au 05 : la colle "accroche" différemment lors des touches courtes, et il faut quelques séances pour trouver les bons angles.

### Pour qui ?

Le Dignics 09C est fait pour le joueur qui veut maximiser la rotation à toutes les hauteurs de balle, qui ouvre souvent le jeu sur des services courts et coupés, et qui apprécie la "prise en main" caractéristique des revêtements chinois tout en bénéficiant de la dynamique d'une mousse tensor européenne. C'est une plaque pour joueurs polyvalents, à l'aise sur toutes les hauteurs de balle, qui font du service et de l'ouverture un pilier de leur jeu.

---

## Butterfly Zyre 03 : la modernité sans compromis

### La philosophie

Le Zyre 03 est le plus récent des trois. Là où les deux Dignics sont clairement positionnés comme des outils de rotation maximum, le Zyre 03 adopte une philosophie différente : vitesse, linéarité, et un équilibre entre attaque et contrôle qui correspond au tennis de table actuel, de plus en plus rapide et de moins en moins "construit".

### Ce qu'il produit sur la balle

Le Zyre 03 produit une trajectoire plus tendue que les deux Dignics — moins d'arc, plus de ligne droite vers la cible. La balle arrive plus vite chez l'adversaire, avec une rotation suffisante pour être dangereuse mais pas nécessairement aussi chargée que celle d'un 05 ou d'un 09C bien frappé. En contrepartie, le timing est plus permissif : la plaque "pardonne" davantage les contacts imparfaits et permet de jouer plus vite sans perdre la maîtrise.

Ce profil en fait une arme redoutable dans le contre-topspin et le jeu au rebond rapide, où la vitesse prime sur la rotation pure. C'est aussi un revêtement plus polyvalent dans le petit jeu : les touches courtes, les poussettes et les blocs sont plus faciles à doser qu'avec les deux Dignics.

La popularité explosive du Zyre 03 au plus haut niveau — il est aujourd'hui le deuxième revêtement le plus utilisé par le top 100 masculin — n'est pas un hasard. Elle reflète une tendance du jeu d'élite vers des échanges plus rapides, plus directs, où être prêt à frapper à n'importe quel rythme est plus important que de construire la rotation maximum sur chaque balle.

### La limite

Ce que le Zyre 03 gagne en accessibilité et en vitesse, il le cède en rotation pure face aux deux Dignics. Pour les joueurs dont le style repose sur des topspins très liftés, très lents et très chargés — typiquement des défenseurs inversés ou des joueurs qui préparent longtemps —, le Zyre 03 peut sembler moins expressif. La balle est rapide, mais elle "mord" moins sur la raquette adverse qu'un 09C bien frappé.

### Pour qui ?

Le Zyre 03 est fait pour le joueur moderne : rapide, capable de jouer à toutes les allures, qui veut une plaque qui réponde immédiatement sans demander un geste parfait à chaque frappe. C'est la plaque idéale pour les attaquants complets qui veulent réduire les risques à l'échange tout en maintenant une menace offensive constante.

---

## Le duel, point par point

| Critère | Dignics 05 | Dignics 09C | Zyre 03 |
|---|---|---|---|
| Type de feuille | Non-collante, haute friction | Collante (tacky) | Non-collante, friction modérée |
| Rotation maximum | Très élevée | Maximale | Élevée |
| Arc de balle | Haut et sécurisant | Mi-haut, catapulté | Bas à mi-haut, tendu |
| Vitesse | Élevée | Élevée | Très élevée |
| Ouverture sur balle coupée | Technique requise | Très naturelle | Naturelle |
| Petit jeu et contrôle | Exigeant | Exigeant | Plus accessible |
| Entretien | Minimal | Nettoyage régulier | Minimal |
| Profil joueur | Loopeur technique | Attaquant complet | Attaquant moderne/rapide |

---

## Comment choisir parmi les trois ?

La réponse dépend moins de votre niveau que de votre style de jeu et de ce que vous cherchez à exprimer.

**Choisissez le Dignics 05** si votre jeu est construit sur des topspins lourds et liftés, si vous aimez prendre le temps de préparer vos frappes, et si vous êtes prêt à travailler techniquement pour en extraire le maximum. C'est une plaque qui récompense l'investissement.

**Choisissez le Dignics 09C** si vous faites du service-réception un pilier de votre jeu, si vous aimez ouvrir sur n'importe quelle balle — y compris les plus coupées —, et si vous êtes à l'aise avec l'entretien d'une surface collante. C'est une plaque qui vous donne la rotation là où les autres doivent la gagner.

**Choisissez le Zyre 03** si votre jeu est rapide, si vous jouez souvent tôt sur le rebond, si vous enchaînez les frappes sans temps de préparation long, et si vous voulez réduire les risques à l'échange tout en restant dangereux. C'est une plaque qui s'adapte à votre rythme plutôt que de vous en imposer un.

---

Ces trois revêtements sont parmi les meilleurs du marché à leur poste respectif. Aucun n'est objectivement supérieur aux deux autres. Ils incarnent trois philosophies d'attaque, et le meilleur d'entre eux est simplement celui qui correspond à votre façon naturelle de jouer.

_Retrouvez les fiches complètes du Zyre 03, du Dignics 09C et du Dignics 05 dans la base de données TT-Kip._`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== "ttkip-seed-2026") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { data: admin } = await supabaseAdmin
    .from("utilisateurs")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .single()

  if (!admin) {
    return NextResponse.json({ error: "Aucun admin trouvé" }, { status: 500 })
  }

  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("slug", "zyre-03-vs-dignics-09c-vs-dignics-05-comparatif-butterfly")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Zyre 03 vs Dignics 09C vs Dignics 05 : le grand comparatif Butterfly",
    slug: "zyre-03-vs-dignics-09c-vs-dignics-05-comparatif-butterfly",
    extrait: "Trois revêtements Butterfly, une même mousse Spring Sponge X, et pourtant trois personnalités radicalement différentes. Rotation pure, surface collante ou trajectoire tendue — on décrypte ce qui distingue vraiment ces trois plaques que le top mondial s'arrache.",
    contenu: CONTENU,
    categorie: "comparatif",
    produit_id: null,
    auteur_id: admin.id,
    publie: true,
  }).select("id, slug").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: "Article créé et publié avec succès !",
    url: `https://www.tt-kip.com/articles/${data.slug}`,
    id: data.id,
  })
}
