import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Le guide des picots mi-longs : notre sélection pour casser le jeu

Si le monde du tennis de table était un jeu de poker, le picot mi-long serait le joker. Souvent méconnu, souvent redouté, il est le parfait hybride : une partie de la vitesse et de la capacité de frappe d'un soft, combinée à la gêne et aux trajectoires imprévisibles d'un picot long. Sa signature ? La balle qui s'écrase — cette trajectoire basse, abrupte, qui tombe comme une pierre et oblige l'adversaire à se repositionner complètement.

Si vous cherchez à casser le rythme, à pourrir le jeu adverse ou à garder une capacité d'initiative tout en semant le chaos, vous êtes au bon endroit. Voici la sélection de la rédaction des meilleurs picots mi-longs du marché, classés par profil de jeu.

---

## Les maîtres de la gêne : trajectoires toxiques

Ces revêtements sont conçus pour maximiser l'effet flottant, inverser subtilement les rotations et produire des balles aux trajectoires erratiques. Ce sont de véritables cauchemars pour les relanceurs.

**Dr. Neubauer Aggressor PRO** — Considérez ceci comme une arme de perturbation massive. Avec ses picots particulièrement longs pour cette catégorie, l'Aggressor PRO produit un effet de gêne monumental. La balle s'arrête littéralement en l'air avant de tomber de l'autre côté du filet. Il demande un vrai temps d'adaptation — les premières semaines peuvent être déroutantes — mais une fois maîtrisé, vos adversaires chercheront des excuses pour ne pas jouer contre vous.

**Dr. Neubauer K.O. PRO** — Une version survitaminée du célèbre K.O. classique. Il offre un peu plus de vitesse pour conclure les points, tout en conservant cet écrasement de balle phénoménal sur les blocs et les contre-initiatives. Si votre jeu est construit sur l'étouffement de l'adversaire à la table avec un maximum de toxicité, c'est un incontournable.

---

## Les orfèvres du contrôle et du faux rythme

Ici, on ne cherche pas la trajectoire chaotique mais la précision chirurgicale — la distribution de balles mortes qui forcent l'adversaire à la faute de filet.

**Nittaku Do Knuckle** — Son nom annonce la couleur : "Knuckle" désigne une balle sans effet, flottante. Plutôt que d'être toxique par ses trajectoires, il l'est par sa subtilité. Il brille par sa sécurité et sa capacité à renvoyer des balles totalement vides et linéaires qui plongent subitement au moment où l'adversaire ne l'attend plus. Idéal pour un jeu de bloc précis, des poussettes agressives et les tacticiens qui aiment la régularité au service de la désorganisation.

**Barna Original Half Long** — Un revêtement qui sent bon la tradition, remis au goût du jour. C'est le picot mi-long de notre sélection qui offre la prise en main la plus douce — il pardonne les erreurs de placement, excelle dans le jeu de distribution et l'absorption de la vitesse adverse. Pour ceux qui veulent changer de rythme sans avoir à tout réapprendre.

---

## Les offensifs : vitesse et pression

Pour les joueurs qui utilisent le picot mi-long non pas pour subir, mais pour agresser la balle dès que l'occasion se présente.

**Spinlord Keiler** — Un mi-long très rapide, presque comparable à un soft sur les frappes à plat, mais avec cet effet plongeant typique du mi-long qui surprend en fin de trajectoire. Parfait pour prendre le jeu à son compte et dicter le rythme sans renoncer au caractère perturbateur de la catégorie.

**Spinlord Gipfelsturm** — Un ovni dans le monde des mi-longs. Ses picots larges lui permettent de générer des rotations surprenantes — on peut presque faire de vrais topspins avec lui. C'est le revêtement idéal pour déstabiliser l'adversaire par des variations d'effets insoupçonnées, tout en gardant un vrai potentiel offensif.

**Dawei 388 C-3** — Une excellente évolution de la série 388. Extrêmement polyvalent et facile à prendre en main pour un joueur venant d'un backside ou d'un soft, il offre un excellent compromis entre contrôle en bloc et dynamisme en attaque. Un très bon point d'entrée dans le monde des mi-longs.

---

## Le laboratoire Der Materialspezialist

La marque allemande s'est bâti une réputation mondiale sur les revêtements atypiques. Leur gamme de mi-longs s'adresse aux joueurs qui aiment imposer un jeu de rupture totale.

**Der Materialspezialist Hellcat** — Un picot féroce et imprévisible. Il excelle dans les blocs passifs très courts et permet des démarrages en faux-tops qui obligent l'adversaire à remonter la balle avec beaucoup de marge sous peine de finir dans le bas du filet. Pour ceux qui veulent tendre des pièges à chaque échange.

**Der Materialspezialist Flashback** — Conçu pour la contre-attaque explosive. La balle rebondit extrêmement bas. Sur les blocs appuyés, le Flashback renvoie une balle tendue et fusante qui laisse très peu de temps de réaction à l'adversaire. Un choix radical pour les joueurs qui veulent punir chaque initiative adverse.

**Der Materialspezialist Wildfire** — La carte de la disruption totale. Ce revêtement joue sur la destruction du rythme : il absorbe merveilleusement bien les attaques adverses tout en permettant de repartir de manière sèche et directe. Un calvaire pour les joueurs qui aiment s'appuyer sur la vitesse de l'adversaire pour construire leurs propres attaques.

---

## La légende intemporelle

Parce que l'efficacité ne se démode jamais.

**RITC 563 Friendship** — La référence absolue du picot mi-long. Utilisé par des générations de pongistes, il reste l'un des meilleurs rapports qualité-prix au monde. Sa frappe sèche est légendaire, la balle s'écrase de manière très abrupte, et son comportement en bloc actif reste difficile à gérer pour n'importe quel attaquant. Il est exigeant techniquement, mais d'une efficacité redoutable entre les mains d'un joueur actif et décidé.

---

## Quel profil êtes-vous ?

Avant d'investir dans un mi-long, posez-vous la bonne question : est-ce que je veux perturber, contrôler, ou attaquer ?

**Vous venez du soft ?** Le Spinlord Keiler ou le Dawei 388 C-3 offrent la transition la plus naturelle — la vitesse est là, la gêne s'installe progressivement.

**Vous venez du picot long ?** L'Aggressor PRO sera dans la continuité de ce que vous connaissez, avec davantage de capacité à initier l'échange.

**Vous voulez le contrôle et le placement avant tout ?** Le Nittaku Do Knuckle et le Barna Half Long sont vos meilleurs alliés — réguliers, sécurisants, toxiques par subtilité.

**Vous voulez juste rendre fou votre adversaire ?** Le Hellcat et le K.O. PRO vous attendent.

---

Une dernière chose : le passage au picot mi-long demande de la patience. Contrairement au picot long où l'on utilise souvent la force de l'adversaire de manière passive, le mi-long nécessite de rester actif. Ne subissez pas. Portez la balle, claquez à plat, variez l'inclinaison de votre raquette. La gêne que vous allez créer est directement proportionnelle à l'activité que vous mettez dans chaque frappe.

_Retrouvez tous les picots mi-longs disponibles dans la base de données TT-Kip._`

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
    .eq("slug", "guide-picots-mi-longs-selection")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Le guide des picots mi-longs : notre sélection pour casser le jeu",
    slug: "guide-picots-mi-longs-selection",
    extrait: "Aggressor PRO, Do Knuckle, Keiler, RITC 563... Le picot mi-long est l'arme la plus sous-estimée du tennis de table. Notre sélection complète classée par profil : maîtres de la gêne, orfèvres du contrôle, offensifs et légendes intemporelles.",
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
