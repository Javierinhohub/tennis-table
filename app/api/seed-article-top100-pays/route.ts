import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# Classement mondial : la France à égalité avec la Chine chez les hommes, le Japon domine chez les femmes

Il y a des chiffres qui méritent qu'on s'arrête. Parmi les 200 meilleurs joueurs et joueuses du monde — 100 hommes, 100 femmes — la France place **10 représentants dans le top 100 masculin**, soit exactement autant que la Chine. Pour un pays qui n'a jamais été une puissance historique du tennis de table, c'est une statistique qui dit beaucoup sur la révolution silencieuse que le ping français est en train de vivre.

## Top 100 masculin : la carte du monde du tennis de table

| Pays | Joueurs dans le top 100 |
|---|---|
| Japon | 12 |
| Chine | 10 |
| **France** | **10** |
| Corée du Sud | 7 |
| Allemagne | 7 |
| Inde | 6 |
| Taipei | 5 |
| Suède | 5 |
| Australie | 4 |
| Hong Kong | 3 |

Au total, ce sont **35 nations différentes** qui sont représentées dans le top 100 masculin. Un chiffre qui illustre mieux que n'importe quel discours la mondialisation spectaculaire du tennis de table depuis deux décennies.

Le Japon domine légèrement avec 12 joueurs, dont Tomokazu Harimoto (3e mondial) et Sora Matsushima (8e). La Chine maintient une présence de haut rang — Wang Chuqin est numéro 1 mondial — mais elle n'occupe plus le terrain de façon hégémonique comme ce fut le cas pendant trente ans. L'Europe résiste bien, avec la France et l'Allemagne en tête de peloton. L'Inde, avec 6 représentants, confirme sa montée en puissance sur la scène mondiale.

## La France : une génération hors norme

Dix joueurs dans le top 100 mondial, c'est le meilleur résultat de l'histoire du tennis de table français. Et la qualité est au rendez-vous autant que la quantité.

**Félix Lebrun (4e mondial)** est la tête de liste. À 18 ans, il est déjà le meilleur joueur européen et l'un des rares à pouvoir regarder Wang Chuqin dans les yeux dans les grands tournois. Son style — agressif, explosif, avec une capacité à élever son niveau dans les moments décisifs — en fait l'un des joueurs les plus suivis du circuit.

**Alexis Lebrun (12e mondial)**, son frère aîné, complète un duo fraternel unique dans l'histoire du sport de haut niveau. Deux frères dans le top 15 mondial dans la même discipline — c'est une configuration rarissime, et elle est française.

**Simon Gauzy (19e mondial)** représente la continuité. Vétéran de l'équipe de France, il a ouvert la voie à la génération actuelle et continue d'occuper une place de choix au classement mondial après des années de régularité au plus haut niveau.

**Flavien Coton (23e)** et **Thibault Poret (26e)** forment la troisième ligne de cette armée bleue, deux joueurs dont la présence dans le top 30 mondial passerait pour un exploit dans presque n'importe quel autre pays, mais qui semblent presque normaux dans le contexte actuel du ping français.

Derrière eux, **Joe Seyfried (43e)**, **Lilian Bardet (49e)**, **Léo De Nodrest (56e)**, **Jules Rolland (85e)** et **Florian Bourrassaud (93e)** complètent un top 100 d'une profondeur inédite. La France n'a pas une tête d'affiche et un vide derrière — elle a dix joueurs répartis sur l'ensemble du classement, ce qui est le signe d'une vraie filière, pas d'un accident.

## Top 100 féminin : le Japon écrase, la Chine reste, la France progresse

| Pays | Joueuses dans le top 100 |
|---|---|
| Japon | 17 |
| Chine | 16 |
| Corée du Sud | 9 |
| Inde | 5 |
| Allemagne | 5 |
| Taipei | 5 |
| **France** | **4** |
| États-Unis | 4 |
| Égypte | 3 |
| Roumanie | 3 |
| Hong Kong | 3 |
| Australie | 3 |

Le tableau féminin est une autre histoire. Ici, le Japon et la Chine se livrent une course en tête dont le reste du monde peine à suivre le rythme. Le Japon place 17 joueuses dans le top 100, la Chine 16 — et surtout, les Chinoises trustent 6 des 10 premières places mondiales, avec Sun Yingsha numéro 1, Wang Manyu numéro 2 et Chen Xingtong numéro 3. C'est une domination d'une nature différente : moins extensive que chez les hommes, mais encore plus concentrée au sommet.

**Du côté de la France**, quatre joueuses font partie de l'élite mondiale. **Jia Nan Yuan (24e mondiale)** ouvre le bal, devant **Prithika Pavade (28e)**, deux joueuses qui ont le profil et l'expérience pour intégrer le top 20 dans les années qui viennent. **Charlotte Lutz (54e)** et **Camille Lutz (87e)** — les deux sœurs — complètent une délégation française qui, là encore, ne repose pas sur une seule individualité.

## Ce que ces chiffres disent vraiment

La domination japonaise et chinoise dans les deux tableaux n'est pas une surprise. Ces deux pays investissent massivement dans la formation depuis des décennies, et leurs structures de développement sont parmi les plus élaborées au monde.

Ce qui est surprenant, c'est la France. Dixième chez les hommes à égalité avec la Chine — une phrase qu'il aurait été difficile d'écrire sans être moqué il y a dix ans. La France n'a pas de tradition culturelle profonde dans ce sport, pas de millions de pratiquants quotidiens comme en Asie, pas de complexes nationaux dédiés au ping depuis l'enfance. Elle a des clubs, des entraîneurs, une fédération qui a su identifier et développer des talents, et une génération qui a eu la chance de se retrouver au bon endroit au bon moment.

Le résultat est là : **la meilleure nation européenne chez les hommes**, à égalité avec le géant chinois. C'est peut-être le fait sportif le plus sous-estimé du tennis de table mondial en 2025.

_Retrouvez les fiches complètes de tous les joueurs du top 100 mondial sur TT-Kip._`

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
    .eq("slug", "france-top-100-mondial-egalite-chine-analyse")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Classement mondial : la France à égalité avec la Chine chez les hommes",
    slug: "france-top-100-mondial-egalite-chine-analyse",
    extrait: "10 Français dans le top 100 mondial masculin — autant que la Chine. Félix Lebrun 4e mondial, les frères Lebrun dans le top 15, Gauzy, Coton, Poret... L'analyse complète d'un fait sportif historique trop souvent sous-estimé.",
    contenu: CONTENU,
    categorie: "actualite",
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
