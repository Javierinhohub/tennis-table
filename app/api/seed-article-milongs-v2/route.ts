import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Le Guide Ultime des Picots Mi-Longs : Notre Sélection Pour Casser le Jeu

Si le monde du tennis de table était un jeu de poker, le picot mi-long serait sans conteste le joker. Souvent méconnu et redouté, le picot mi-long (PML) est le parfait hybride : il offre une partie de la vitesse et de la capacité de frappe d'un "soft", combinée à la gêne et aux trajectoires aléatoires d'un "picot long".

La signature du mi-long ? La fameuse balle qui s'écrase.

Si vous cherchez à pourrir le jeu de votre adversaire, à casser le rythme ou à garder une capacité d'initiative redoutable, vous êtes au bon endroit. Voici la sélection de la rédaction des meilleurs picots mi-longs du marché, classés par profil pour vous aider à faire votre choix.

---

## 🌪️ Les Maîtres de la Gêne : Trajectoires Toxiques

Ces revêtements sont conçus pour maximiser l'effet flottant, inverser subtilement les rotations et produire des balles aux trajectoires erratiques. Ce sont de véritables cauchemars pour les relanceurs.

**Dr. Neubauer Aggressor PRO** — Attention, arme de destruction massive. Avec ses picots particulièrement longs pour cette catégorie, l'Aggressor PRO produit un effet de gêne monumental. La balle s'arrête littéralement en l'air avant de tomber. Il demande un certain temps d'adaptation, mais une fois maîtrisé, vos adversaires détesteront jouer contre vous.

**Dr. Neubauer K.O. PRO** — Une version survitaminée du célèbre K.O. classique. Il offre un peu plus de vitesse pour finir les points, tout en conservant cet écrasement de balle phénoménal sur les blocs et les contre-initiatives. Si votre jeu est basé sur l'étouffement de l'adversaire à la table avec un maximum de toxicité, c'est un incontournable.

---

## 🛡️ Les Orfèvres du Contrôle et du Faux-Rythme

Ici, on ne cherche pas la trajectoire chaotique, mais plutôt la précision chirurgicale et la distribution de balles "mortes" pour forcer l'adversaire à la faute de filet.

**Nittaku Do Knuckle** — Son nom annonce la couleur ("Knuckle" signifie balle sans effet/flottante). Plutôt que d'être toxique par ses trajectoires, il l'est par sa subtilité. Il brille par sa sécurité et sa capacité à renvoyer des balles totalement vides et linéaires qui plongent subitement. Idéal pour un jeu de bloc précis, de poussettes agressives et pour les tacticiens qui aiment la régularité.

**Barna Original Half Long** — Un revêtement qui sent bon le tennis de table de tradition, remis au goût du jour. C'est le picot de notre sélection qui offre la prise en main la plus douce. Il pardonne les erreurs de placement et excelle dans le jeu de placement, l'absorption de la vitesse adverse et le changement de rythme.

---

## ⚡ Les Offensifs : Vitesse et Pression

Pour les joueurs qui utilisent le picot mi-long non pas pour subir, mais pour agresser la balle dès que l'occasion se présente.

**Spinlord Keiler** — Un picot mi-long très rapide, presque comparable à un soft sur les frappes à plat, mais avec cet effet plongeant typique du mi-long qui surprend en fin de trajectoire. Parfait pour prendre le jeu à son compte et dicter le rythme.

**Spinlord Gipfelsturm** — Un ovni dans le monde des mi-longs. Ses picots sont larges, ce qui lui permet de générer des rotations surprenantes (vous pouvez presque faire de vrais topspins avec !). C'est le revêtement idéal pour déstabiliser l'adversaire par des variations d'effets insoupçonnées tout en gardant un gros potentiel offensif.

**Dawei 388 C-3** — Une excellente évolution de la série 388. C'est un picot extrêmement polyvalent, très facile à prendre en main pour un joueur venant d'un backside ou d'un soft. Il offre un excellent compromis entre contrôle en bloc et dynamisme en attaque.

---

## 🧪 Le Laboratoire "Der Materialspezialist"

La marque allemande est réputée pour ses revêtements atypiques. Leur gamme de mi-longs s'adresse aux joueurs qui aiment imposer un jeu de rupture.

**Der Materialspezialist Hellcat** — Un picot féroce et imprévisible. Il excelle dans les blocs passifs très courts et permet des démarrages "faux-tops" qui obligent l'adversaire à remonter la balle avec beaucoup de marge sous peine de finir dans le bas du filet.

**Der Materialspezialist Flashback** — Conçu pour un jeu de contre-attaque explosif. La balle rebondit extrêmement bas. Sur les blocs appuyés, le Flashback renvoie une balle tendue et fusante qui laisse très peu de temps de réaction à l'adversaire.

**Der Materialspezialist Wildfire** — La carte de la disruption totale. Ce revêtement joue sur la destruction du rythme. Il absorbe merveilleusement bien les attaques adverses tout en permettant de repartir de manière sèche. Un calvaire pour les joueurs qui aiment s'appuyer sur la vitesse adverse.

---

## 🏛️ La Légende Intemporelle

Parce que l'efficacité ne se démode jamais, ce revêtement a fait ses preuves et reste une référence historique.

**RITC 563 (Friendship)** — La légende absolue du picot mi-long. Utilisé par des générations de pongistes, il reste l'un des meilleurs rapports qualité/prix au monde. Sa frappe sèche est légendaire et la balle s'écrase de manière très abrupte. Il est exigeant techniquement, mais d'une efficacité redoutable entre les mains d'un joueur actif.

---

## 💡 Le Conseil de la Rédaction

Le passage au picot mi-long demande de la patience. Contrairement à un picot long où l'on utilise souvent la force de l'adversaire de manière passive, le mi-long nécessite de rester actif. Ne subissez pas : portez la balle, claquez à plat, variez l'inclinaison de votre raquette.

**Quel est votre profil ?**

Vous venez du soft ? Optez pour le Spinlord Keiler ou le Dawei 388 C-3.

Vous venez du picot long ? Tournez-vous vers l'Aggressor PRO.

Vous cherchez le contrôle et le placement avant tout ? Le Nittaku Do Knuckle ou le Barna Half Long seront vos meilleurs alliés.

Vous voulez juste rendre fou votre adversaire ? Le Hellcat et le K.O. PRO vous tendent les bras.

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
    .eq("slug", "guide-ultime-picots-mi-longs-notre-selection")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Le Guide Ultime des Picots Mi-Longs : Notre Sélection Pour Casser le Jeu",
    slug: "guide-ultime-picots-mi-longs-notre-selection",
    extrait: "Aggressor PRO, Do Knuckle, Keiler, RITC 563... Le picot mi-long est l'arme la plus sous-estimée du tennis de table. Notre sélection complète de 10 revêtements classés par profil : maîtres de la gêne, orfèvres du contrôle, offensifs et légendes.",
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
