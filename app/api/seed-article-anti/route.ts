import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# L'art de la gêne : Anti-Top Classique vs Anti-Top Lisse, le duel décrypté

Si vous êtes un joueur qui aime faire déjouer ses adversaires, vous vous êtes probablement déjà penché sur le côté obscur — mais tellement fascinant — de la raquette : les revêtements anti-top. Longtemps perçus comme des plaques "pour ceux qui ne veulent pas subir l'effet", les anti-tops ont pourtant énormément évolué.

Aujourd'hui, une véritable frontière sépare deux mondes : les anti-tops classiques et les anti-tops lisses, les fameux "glantis". Quelles sont les différences ? Lequel correspond à votre style de jeu ? Et surtout, quelles sont les meilleures références du marché ? C'est ce que nous allons voir.

## Les Anti-Tops Classiques : le contrôle et l'absorption

### Comment ça marche ?

L'anti-top classique n'est pas totalement dépourvu d'adhérence. Si vous passez le doigt dessus, vous sentirez une très légère friction. Le secret de ces plaques réside dans l'association d'un caoutchouc peu adhérent et d'une mousse souvent très absorbante — parfois dure selon les modèles. L'objectif numéro un n'est pas d'inverser l'effet, mais de l'annuler, de l'absorber, de le rendre inexistant.

### Pour quel type de jeu ?

C'est le revêtement idéal pour le joueur allround défensif ou le bloqueur qui cherche une sécurité maximale en remise de service et en bloc. Il permet de casser le rythme de l'adversaire en renvoyant des balles "mortes" — sans consistance — très difficiles à attaquer deux fois de suite. Il autorise même de fausses attaques et des poussettes actives, ce qui lui donne une vraie polyvalence tactique.

### Les références à connaître

**Yasaka Anti Power** — C'est la légende absolue, le grand classique indémodable. Ce qui le rend si populaire, c'est sa polyvalence. Contrairement à des antis ultra-lents, l'Anti Power garde une certaine dynamique. Il permet de bloquer avec un contrôle chirurgical, mais aussi de porter la balle et de réaliser de petites attaques très gênantes qui surprennent l'adversaire au mauvais moment.

**Nittaku Best Anti** — Le concurrent direct du Yasaka. Le Best Anti est souvent considéré comme légèrement plus lent et plus sécurisant. Sa mousse est une merveille d'absorption. Il excelle dans le jeu de placement et permet de renvoyer les topspins adverses avec une balle très courte et basse, obligeant l'attaquant à relever la balle sans élan — ce qui est une très mauvaise nouvelle pour lui.

**Butterfly Super Anti** — Le choix des puristes de la défense. Avec sa surface presque sans friction pour un classique et sa mousse très amortissante, il offre une capacité d'absorption des rotations phénoménale. Il est parfait pour "casser la balle" et détruire les initiatives adverses dès leur naissance.

## Les Anti-Tops Lisses (Glantis) : l'inversion destructrice

### Comment ça marche ?

Là, on change de dimension. La surface d'un anti lisse est un véritable miroir : il n'y a strictement aucune adhérence. Le principe physique repose sur la conservation de la rotation. Quand votre adversaire vous envoie un topspin — rotation avant — et que vous bloquez, la balle glisse sur le revêtement et repart avec sa propre rotation, qui se transforme en coupe pour l'adversaire. Plus il met d'effet, plus votre bloc sera taillé. C'est sa force qui se retourne contre lui.

### Pour quel type de jeu ?

L'anti lisse est fait pour les bloqueurs à la table. Il demande une technique spécifique — le fameux "chop block" ou bloc coupé à la table. Ce sont des plaques pensées pour détruire le jeu de l'attaquant. Elles sont cependant exigeantes : elles pardonnent moins les erreurs d'inclinaison de raquette que les antis classiques et restent vulnérables sur les balles molles ou peu chargées.

### Les références à connaître

**Dr. Neubauer ABS 3** — C'est l'un des chefs-d'œuvre modernes de l'anti lisse. Le Dr. Neubauer a réussi avec l'ABS 3 à combiner une inversion d'effet cataclysmique avec une mousse extrêmement amortissante. Résultat : vous pouvez bloquer les topspins les plus violents de manière ultra-courte derrière le filet. La balle s'écrase littéralement de l'autre côté de la table, gorgée d'effet coupé que l'adversaire n'attendait pas.

**Der Materialspezialist Störkraft** — Ce revêtement est un cauchemar pour les attaquants. Il est réputé pour sa lenteur extrême et son contrôle au-dessus de la moyenne pour un anti lisse. Le Störkraft permet de garder la balle très basse avec une inversion massive, tout en offrant un sentiment de sécurité rare pour cette catégorie de plaques.

**Barna Original Super Glanti** — Un choix redoutable pour les joueurs qui cherchent une trajectoire de balle très flottante et imprévisible. Le Super Glanti se décline en plusieurs épaisseurs d'amortissement, mais sa version classique offre des blocs qui fusent ou qui s'arrêtent net selon l'impact, rendant l'anticipation presque impossible pour le joueur en face.

## Bilan : lequel choisir ?

**Choisissez un Anti Classique** — par exemple le Yasaka Anti Power ou le Best Anti — si votre jeu est basé sur la sécurité, le placement et la variation de rythme, et que vous souhaitez pouvoir attaquer de temps en temps. La prise en main est relativement rapide si vous venez du backside.

**Choisissez un Anti Lisse** — par exemple le Neubauer ABS 3 — si vous jouez collé à la table, que vous possédez un bon toucher de balle et que votre objectif ultime est d'utiliser la propre force de votre adversaire contre lui. Prévoyez quelques heures d'entraînement supplémentaires pour maîtriser l'inclinaison de la raquette : le jeu en vaut largement la chandelle.

---

Et vous, êtes-vous plutôt team absorption ou team inversion ? Partagez vos expériences et vos revêtements préférés dans les commentaires.

_Retrouvez tous les revêtements anti-top dans la base de données TT-Kip._`

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
    .eq("slug", "anti-top-classique-vs-lisse-duel")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "L'art de la gêne : Anti-Top Classique vs Anti-Top Lisse, le duel décrypté",
    slug: "anti-top-classique-vs-lisse-duel",
    extrait: "Anti Power, Best Anti, ABS 3, Störkraft… entre absorption et inversion d'effet, les anti-tops se divisent en deux familles radicalement différentes. On décrypte les mécaniques, les profils de joueurs et les meilleures références pour chaque camp.",
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
