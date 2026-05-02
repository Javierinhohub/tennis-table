import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Au bout du manche : le choix de la poignée change-t-il vraiment la donne ?

Au tennis de table, on parle souvent de l'importance du bois — carbone, plis, flexibilité — et des revêtements — picots, tensors, anti-top. Mais qu'en est-il du manche ? C'est pourtant la seule partie de la raquette qui est en contact direct et permanent avec le corps du joueur.

On lui prête parfois des vertus incroyables, mais soyons honnêtes : la forme du manche ne va pas magiquement transformer votre topspin ni rajouter 20 km/h à votre frappe. Dans la grande majorité des cas, son impact sur le jeu pur est minime et relève surtout du confort personnel. Il existe cependant quelques exceptions tactiques notables, des OVNIs ergonomiques, et des éléments souvent négligés comme la texture ou les grips. Passons tout cela en revue.

## Le Manche Droit (Straight / ST) : le choix des stratèges

C'est un manche cylindrique — ou légèrement rectangulaire — qui conserve la même épaisseur de la base jusqu'à la palette. La prise est plus relâchée, la raquette flotte légèrement dans la main, et le poignet bénéficie d'une liberté de mouvement que les autres profils ne permettent pas vraiment.

Ce qui le distingue réellement des autres manches occidentaux, c'est sa polyvalence tactique. Grâce à sa forme uniforme, il est possible de tourner la raquette très facilement et rapidement en plein échange — ce que la plupart des autres profils rendent quasi impossible. C'est le manche de prédilection des défenseurs et des joueurs "combi" qui jouent avec un backside d'un côté et un picot long de l'autre, et qui aiment prendre l'adversaire à contre-pied en inversant les plaques au dernier moment.

## Le Manche Concave (Flared / FL) : le standard universel

C'est le manche le plus vendu au monde, et pour cause : il est plus fin au milieu et s'évase vers la base, ce qui verrouille naturellement la raquette dans la main. L'élargissement en bas empêche la raquette de glisser lors des mouvements amples, sans demander d'effort conscient de serrage.

Il favorise une prise ferme et sécurisante, ce qui apporte une vraie tranquillité d'esprit pour relâcher l'avant-bras lors des topspins. En contrepartie, cette forme rend très difficile la rotation de la raquette en cours d'échange. Si vous jouez avec les deux faces de la même façon et n'avez aucun besoin de permuter vos plaques, c'est probablement le profil qu'il vous faut.

## Le Manche Anatomique (Anatomic / AN) : le confort absolu, mais restrictif

Il présente un renflement au milieu pour épouser parfaitement le creux de la paume. La raquette semble moulée pour votre main, la prise est extrêmement fixe. C'est idéal pour les joueurs à la prise très classique qui ne modifient jamais l'angle de leur poignet.

En revanche, cette fixité devient un obstacle dans le jeu moderne, qui demande une micro-adaptation permanente des doigts et du poignet à l'impact. Certains joueurs adorent, d'autres le trouvent trop rigide après quelques séances. La seule façon de le savoir est de l'essayer.

## Le Manche Conique (Conic / CO) : l'hybride oublié

Plus large à la base, il s'affine de façon rectiligne jusqu'à la palette, sans la courbe creusée du manche concave. C'est un compromis intermédiaire : légèrement plus de liberté au poignet que le concave, tout en sécurisant davantage la prise que le droit. Il reste cependant presque aussi difficile à tourner que le concave, ce qui le maintient à l'écart des profils "combi".

## Les OVNIs ergonomiques : quand la science s'en mêle

Certains fabricants ont tenté de réinventer la roue avec des manches pensés pour la biomécanique ou les sensations de feedback.

**Les manches à fentes (Soulspin "New Era")** — La marque allemande Soulspin propose des manches formés de disques de bois collés verticalement avec des espaces vides entre eux. L'objectif est double : ces fentes laissent passer l'air, réduisant considérablement la transpiration, et l'onde de choc de la balle "saute" de disque en disque, ce qui modifie la transmission des vibrations et offre un retour d'information extrêmement direct dans la paume.

**Le manche décalé (série "Tenaly" de Nittaku)** — Le manche n'est pas dans l'axe de la palette : il est courbé sur le côté pour aligner la palette avec l'avant-bras et supprimer la nécessité de "casser" le poignet. Cela modifie la gestuelle — idéal pour le revers — mais exige de réapprendre ses repères.

**Le manche asymétrique (série "Dotec" de Donic)** — En liège massif, sans faces plates, décliné en version droitier et gaucher. Il verrouille la main de manière encore plus absolue que le manche anatomique.

## L'exception asiatique : les prises porte-plume

Là, on ne parle plus seulement de confort : la forme du manche modifie littéralement la biomécanique du joueur.

**Porte-plume Chinois (C-Pen)** — Court et trapu, il offre une flexibilité du poignet des deux côtés, idéale pour le "revers à l'envers" popularisé par Wang Hao et les joueurs chinois modernes.

**Porte-plume Japonais (J-Pen)** — Plus long, avec un bloc de liège asymétrique pour caler l'index. C'est l'arme absolue pour le topspin coup droit surpuissant grâce à un effet de "fouet" inégalable — mais il limite considérablement le jeu en revers classique.

## La texture et les grips : un détail qui fait toute la différence

Si la forme compte, la surface du manche est un point que beaucoup de joueurs négligent à tort.

Certains bois — notamment chez Stiga ou OSP — ont des manches avec un grain très naturel, presque poreux, qui absorbe bien la transpiration et empêche la raquette de glisser. D'autres marques poncent leurs manches à l'extrême ou appliquent un léger vernis. Agréable au toucher à la sortie de la boîte, ce finish peut se transformer en savonnette pour un joueur qui transpire des mains.

Pour contrer un manche trop lisse ou inadapté, trois solutions existent :

**Le ruban de grip (type tennis)** — Absorbant et confortable, il épaissit considérablement le manche. Idéal pour ceux qui ont de grandes mains et trouvent les profils standards trop étroits.

**La gaine thermo-rétractable** — Un tube en caoutchouc fin que l'on glisse sur le manche et que l'on chauffe au sèche-cheveux pour qu'il en épouse la forme. Résultat : un grip antidérapant efficace, sans pour autant modifier le profil original.

**Le tour de raquette bricolé** — Certains joueurs enroulent simplement un morceau de ruban de bordure à la base d'un manche droit pour créer une légère butée personnalisée, évitant que la raquette ne leur échappe lors des rotations, tout en conservant la facilité de permutation.

## En définitive

Si l'on exclut les prises porte-plume, les innovations extrêmes et le manche droit — seul vrai outil tactique pour pivoter ses plaques —, la forme d'un manche occidental ne vous fera pas mieux jouer.

Le manche parfait est celui que l'on oublie. Qu'il soit droit, concave, troué, rugueux ou recouvert d'une gaine en caoutchouc, s'il permet à votre main d'être relâchée et à votre poignet d'être libre, il fait son travail. Le reste de la magie se passe dans le transfert de poids du corps, et au bout des doigts.

_Retrouvez tous les bois et leurs caractéristiques de manche dans la base de données TT-Kip._`

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
    .eq("slug", "guide-manches-poignee-tennis-de-table")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Au bout du manche : le choix de la poignée change-t-il vraiment la donne ?",
    slug: "guide-manches-poignee-tennis-de-table",
    extrait: "Droit, concave, anatomique, troué, porte-plume... la forme du manche modifie-t-elle vraiment le jeu ? On passe en revue chaque profil, les OVNIs ergonomiques, la texture et les solutions de grip pour trouver celui qu'on finit par oublier.",
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
