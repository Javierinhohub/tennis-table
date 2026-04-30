import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# ALC vs ZLC : Le grand duel des fibres au tennis de table

Vous cherchez un bois carbon et vous êtes tombé sur ces deux sigles : **ALC** et **ZLC**. Vous avez posé la question autour de vous… et vous avez reçu dix avis différents. Normal. Ce débat divise les compétiteurs depuis que Butterfly a lancé ces deux technologies, et il mérite une vraie réponse.

Ces deux fibres partagent le même principe de base : associer du carbone à un second matériau pour agrandir le sweet spot et gagner en vitesse. Mais ce second matériau change tout — le toucher, l'arc de balle, la gestion du petit jeu. C'est là que tout se joue.

## Ce que cachent ces trois lettres

Avant de rentrer dans le détail, voici comment ces deux technologies se comparent sur les caractéristiques qui comptent vraiment en match :

| Caractéristique | ALC | ZLC |
|---|---|---|
| Matériau | Polyarylate + Carbone | Zylon (fibre PBO) + Carbone |
| Toucher de balle | Doux, feutré | Vif, sec, direct |
| Temps de contact | Long | Court (répulsion immédiate) |
| Arc de balle | Haut, sécurisant | Tendu, rasant |
| Sensation dans la main | Vibrations amorties | Retour d'information direct |
| Sweet spot | Grand | Très grand (surtout Super ZLC) |

## L'ALC : le choix de la rotation et de la finesse

L'Arylate est une fibre de polyarylate dont la grande qualité est d'**absorber les chocs** plutôt que de les renvoyer. Associée au carbone, elle donne naissance à des bois devenus légendaires — la Viscaria, la Timo Boll ALC, la Fan Zhendong ALC. Ce n'est pas un hasard si la majorité de l'élite mondiale joue avec.

**Ce qui la rend si efficace :**

La balle reste en contact avec le bois un poil plus longtemps. Ce "dwell time" prolongé, c'est le temps qu'il faut pour l'enrouler, lui imprimer de la rotation. Résultat : des loops avec une rotation énorme et un arc haut qui passe le filet confortablement, même quand la balle n'est pas parfaite. Dans les moments de pression, l'ALC rassure.

Au petit jeu, elle est redoutable. Les poussettes taillées, les remises courtes, les blocs de contrôle — tout se dose avec précision parce que la fibre encaisse l'énergie adverse au lieu de la renvoyer d'un coup.

**Sa limite :**

Si vous reculez loin de la table pour frapper à plat et finir le point en force, l'ALC demande un engagement physique plus important — elle absorbe une partie de l'énergie du coup. Rien de bloquant pour autant, mais c'est là que le ZLC reprend la main.

**C'est fait pour vous si :** vous construisez vos points en variant les effets, vous aimez sentir la balle s'accrocher dans le bois, ou vous cherchez un bois qui pardonne les approximations.

## Le ZLC : la machine à vitesse

Le Zylon — ou fibre PBO — est un polymère synthétique aux propriétés spectaculaires : **deux fois plus résistant que le Kevlar** tout en étant ultra-léger. Sur un bois comme le Mizutani Jun ZLC, ça se traduit par une élasticité explosive. La balle arrive, repart. Quasiment aucune perte d'énergie.

**Ce qui la rend si efficace :**

La répulsion est immédiate. Pour bloquer activement, contre-topspinner ou frapper fort tôt sur le rebond, c'est une arme redoutable. Même à trois mètres de la table, vous envoyez des balles lourdes et profondes sans avoir l'impression de forcer. Le ZLC dicte l'échange par la vitesse — et ça, ça met une pression énorme sur l'adversaire.

**Sa limite :**

Le toucher est sec et peu permissif. Si votre main n'est pas parfaitement relâchée sur une poussette, la balle partira trop loin — le ZLC ne pardonne pas. Son arc de balle plus tendu oblige aussi à avoir d'excellentes jambes pour remonter les balles très coupées. C'est une fibre qui récompense la technique irréprochable.

**C'est fait pour vous si :** vous attaquez agressivement, vous jouez tôt sur le rebond et vous dictez le rythme de l'échange par la puissance pure.

## Le duel, point par point

**Top-spin sur balle coupée → Avantage ALC.** L'arc haut et le temps de contact prolongé permettent de gratter la balle en sécurité. Avec un ZLC, si l'angle de raquette ou l'engagement du bras ne sont pas parfaits, la balle finit dans le filet.

**Finition et frappe à plat → Avantage ZLC.** Pour conclure en force ou enchaîner un contre-topspin dévastateur, la restitution d'énergie du Zylon n'a pas d'égale.

**Contrôle et petit jeu → Avantage ALC.** La sensation feutrée rassure dans les moments de tension. Le jeu court est maîtrisé, les transitions sont fluides.

## Un point souvent oublié : Inner ou Outer ?

La position de la fibre dans le bois est aussi déterminante que son type. En **Outer** (juste sous le pli extérieur), la fibre s'active dès le premier contact — c'est puissant, très "carbone" dans les sensations. En **Inner** (plus proche du cœur du bois), une couche de bois filtre le choc — le toucher se rapproche d'un bois 5 plis, le petit jeu est nettement plus fin.

Un **Inner ALC** peut surprendre de confort. Un **Outer ZLC** peut surprendre de vitesse. À garder en tête avant tout achat.

## En résumé

**L'ALC** reste le choix de la polyvalence absolue. Elle rotate, elle pardonne, elle rassure. Ce n'est pas un hasard si les meilleurs joueurs du monde l'utilisent à grande majorité.

**Le ZLC** est une Formule 1 : exceptionnelle entre les mains d'un joueur technique et agressif, capricieuse pour les autres. Elle récompense ceux qui l'apprivoisent — et elle se fait voir sur le court.

Le meilleur choix ? Celui qui correspond à votre style de jeu. Pas au classement de votre joueur préféré.

_Retrouvez tous les bois ALC et ZLC dans la base de données TT-Kip._`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== "ttkip-seed-2026") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Récupère l'ID du premier admin pour auteur_id
  const { data: admin } = await supabaseAdmin
    .from("utilisateurs")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .single()

  if (!admin) {
    return NextResponse.json({ error: "Aucun admin trouvé" }, { status: 500 })
  }

  // Vérifie si l'article existe déjà
  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("slug", "alc-vs-zlc-duel-fibres")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  // Crée l'article
  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "ALC vs ZLC : Le grand duel des fibres au tennis de table",
    slug: "alc-vs-zlc-duel-fibres",
    extrait: "Viscaria ou Mizutani Jun ? ALC ou ZLC ? Ce débat divise les compétiteurs depuis des années. On démêle ces deux fibres — leur physique, leurs forces, leurs limites — pour vous aider à faire le vrai bon choix.",
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
