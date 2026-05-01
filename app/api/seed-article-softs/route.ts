import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Le guide des softs (picots courts) : adhérent ou peu adhérent, comment choisir ?

Si vous lisez ces lignes, c'est que le monde des softs vous attire. Peut-être que vous en avez marre de recevoir des services et de ne pas savoir quoi en faire. Peut-être que vous voulez imposer votre rythme avec un bloc agressif plutôt que de subir les topspins adverses. Ou tout simplement que vous cherchez à pimenter votre jeu avec quelque chose de différent.

Bonne nouvelle : vous avez raison de creuser la question. Le soft (ou picot court) est une arme redoutable, sous-estimée et souvent mal comprise. Mauvaise nouvelle : tous les softs ne se ressemblent pas — loin de là.

Le marché se divise en deux grandes familles aux comportements radicalement opposés : les **softs adhérents** et les **softs peu adhérents**. Choisir le mauvais peut vous faire regretter toute l'expérience. Choisir le bon peut transformer votre jeu.

## Les softs adhérents : la transition en douceur

Un soft adhérent, c'est un peu le meilleur des deux mondes pour quelqu'un qui vient du backside. Vous gardez la capacité de mettre de l'effet, vous gagnez en vitesse d'exécution, et la balle adverse vous "colle" moins les mains qu'avant. L'arrachement du jeu d'effet pur est progressif — vous ne perdez pas tout d'un coup.

**Ce qu'ils font bien :**

- Servir avec de la rotation reste possible, parfois impressionnant.
- Démarrer sur balle coupée avec un topspin ou une frappe rotation est beaucoup plus naturel.
- Le jeu de poussette reste sécurisant et contrôlable.

**Ce qu'ils font moins bien :**

- La balle renvoyée en bloc "plonge" moins que sur un soft classique — l'adversaire s'en sort encore.
- Ils restent légèrement sensibles aux effets entrants : on n'est pas encore dans la neutralisation totale.

### Les références à connaître

**Victas Spinpips D1** (anciennement TSP Super Spinpips) — C'est la référence historique du soft adhérent. La géométrie de ses picots permet de générer une rotation surprenante pour un picot court, tout en offrant une vraie polyvalence à la table : poussettes taillées propres, démarrages sûrs, frappes placées. Un choix évident pour débuter dans les softs sans se faire violence.

**Yasaka Rakza PO** — Rendu célèbre par Mattias Falck, vice-champion du monde suédois, qui l'utilise en coup droit. Ce n'est pas un soft pour les timides : la mousse Tensor lui donne une dynamique explosive, et l'adhérence est phénoménale. Les topspins frappés deviennent dévastateurs. C'est une plaque exigeante, mais entre les bonnes mains, elle fait très mal.

**Nittaku Moristo SP** — L'arme de Mima Ito, tout simplement. Il se situe à la frontière des deux catégories : il accroche bien grâce à sa tension intégrée, permet d'ouvrir facilement le jeu, mais offre aussi une vitesse d'exécution explosive en bloc actif. Un soft complet, jouable à haut niveau dans les deux styles.

## Les softs peu adhérents : la frappe pure et la balle qui plonge

Là, on entre dans le cœur du soft "gênant" — celui dont rêvent les perturbateurs et les bloqueurs agressifs. La surface est moins rugueuse, les picots parfois plus espacés ou rigides. L'objectif n'est plus de créer l'effet, c'est de l'ignorer complètement, de casser le rythme, et de renvoyer une balle qui plonge de façon brutale sur la table adverse.

Si vous avez déjà joué contre quelqu'un qui bloque tout à plat et dont la balle s'écrase à chaque fois comme une pierre — c'est lui le coupable.

**Ce qu'ils font bien :**

- Insensibilité quasi totale aux effets adverses : les retours de service deviennent d'une simplicité déconcertante.
- La fameuse "balle qui plonge" : en bloc, la trajectoire tombe abruptement sur la table adverse, rendant le deuxième topspin extrêmement difficile à construire.
- Frappe à plat dévastatrice dès que la balle est un peu haute.

**Ce qu'ils font moins bien :**

- Démarrer en rotation sur une balle très coupée est très difficile — il faut porter la balle ou frapper à plat avec un timing parfait.
- Le service en rotation est limité : il faut s'adapter et trouver d'autres variations.

### Les références à connaître

**Victas V>101** — Une machine à contrer. Ce soft sacrifie délibérément l'adhérence pour produire des trajectoires tendues et fusantes, que l'adversaire perçoit comme "anormales". Avec sa mousse Tensor allemande très dynamique, il est redoutable en bloc actif et en frappe à plat. La balle renvoyée s'écrase, laisse très peu de temps, et désorganise n'importe quel jeu construit sur la rotation. Difficile de s'y habituer, mais difficile aussi de jouer contre.

**Friendship 802** (version classique) — Un grand classique chinois à un prix imbattable. Mousse très dure, adhérence minimale, efficacité brute. Il est fait pour claquer très fort à la table, point final. Pas de fioritures : en bloc ou en frappe directe, la balle part vite et plonge. Un cauchemar pour les joueurs qui construisent leur jeu sur l'effet de l'adversaire. Attention à ne pas confondre avec le 802-40, qui lui est adhérent et joue tout à fait différemment.

**Dr. Neubauer Explosion** — Le "Docteur" est le spécialiste mondial des plaques déstabilisantes, et l'Explosion ne fait pas exception. Sa très faible adhérence lui permet d'absorber l'énergie en bloc et de renvoyer une balle "morte" qui plonge de façon abrupte — presque comme un picot long, mais avec la capacité d'attaquer à plat avec précision. C'est le choix idéal pour créer de la panique sans renoncer à l'attaque directe. Si vous cherchez encore plus de gêne et acceptez de sacrifier un peu d'attaque, jetez un œil au légendaire **Killer** de la même marque, qui flirte avec le picot mi-long côté perturbation.

## Lequel est fait pour vous ?

**Choisissez un soft adhérent si :**
Vous venez du backside et ne voulez pas tout recommencer à zéro. Vous aimez prendre l'initiative, ouvrir le jeu vous-même, et vous avez besoin de garder un minimum de sécurité dans la transition. C'est la porte d'entrée idéale dans le monde des softs.

**Choisissez un soft peu adhérent si :**
Votre jeu est construit sur le bloc, le contre-rebond et la lecture de la balle adverse. Vous avez un bon coup d'œil pour frapper à plat sur la moindre balle un peu haute, et votre objectif principal est de déjouer l'adversaire avec des trajectoires surprenantes. Ce soft-là, ça s'assume.

---

Peu importe votre choix, préparez-vous à un ajustement technique : le geste avec un soft est plus court, plus devant soi, et la raquette plus ouverte que pour un topspin classique. Les premières semaines peuvent être déroutantes — et puis un jour, tout s'enclenche. Et là, vous ne reviendrez plus en arrière.

_Retrouvez tous les softs adhérents et peu adhérents dans la base de données TT-Kip._`

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
    .eq("slug", "guide-softs-picots-courts-adherent-peu-adherent")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Le guide des softs (picots courts) : adhérent ou peu adhérent, comment choisir ?",
    slug: "guide-softs-picots-courts-adherent-peu-adherent",
    extrait: "Spinpips, Rakza PO, V>101, Friendship 802… tous les softs ne se ressemblent pas. Le marché se divise entre softs adhérents et peu adhérents aux comportements radicalement opposés. On vous aide à choisir la plaque qui sublimera votre jeu.",
    contenu: CONTENU,
    categorie: "conseil",
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
