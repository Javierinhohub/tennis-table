import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// One-time seeding route — delete this file once the article is inserted
const SECRET = "ttkip2026seed"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if article already exists
  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("slug", "tennis-de-table-2026-mondiaux-equipes-londres")
    .single()

  if (existing) {
    return NextResponse.json({ message: "Article already exists", id: existing.id })
  }

  // Find the admin user
  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const admin = users?.users?.find(u => u.email?.toLowerCase() === "nasser.gasmi@gmail.com")

  const contenu = `La saison 2026 de tennis de table s'annonce particulièrement dense pour les passionnés, avec plusieurs compétitions majeures au calendrier international. Après une Coupe du monde individuelle disputée à Macao fin mars-début avril, l'attention se tourne désormais vers l'événement phare du printemps : les **Championnats du monde par équipes 2026**.

## Un rendez-vous historique à Londres

Les Championnats du monde par équipes se dérouleront du **28 avril au 10 mai 2026 à Londres**. Cette édition est symbolique puisqu'elle célèbre le centenaire de la première édition organisée en 1926 — une compétition qui a façonné l'histoire du tennis de table mondial pendant un siècle.

La compétition réunira **64 équipes masculines et 64 équipes féminines**, réparties en groupes pour une première phase, avant un tableau final à élimination directe. La ExCeL London Arena accueillera ce spectacle de très haut niveau pendant deux semaines.

## Format de la compétition

Le tournoi débute par une phase de poules :

- 16 groupes par tableau (hommes et femmes)
- Groupes de 3 ou 4 équipes
- Matchs en format round-robin (toutes les équipes se rencontrent)

À l'issue de cette phase :

- Les meilleures équipes accèdent directement au tableau final
- D'autres passent par un tour préliminaire pour tenter leur chance

## Les poules de la France

Le tirage au sort a placé la France dans des groupes relevés, aussi bien chez les hommes que chez les femmes. Les détails complets des poules confirment un niveau extrêmement dense, avec plusieurs nations majeures du circuit mondial.

La phase de groupes sera déterminante pour les Bleus, avec l'objectif de se qualifier rapidement pour le tableau principal et éviter les matchs pièges. Chaque rencontre comptera double dans cette course à la qualification.

## Calendrier des matchs de la France

Les rencontres de l'équipe de France se dérouleront principalement durant la première semaine de compétition, lors de la phase de poules (fin avril – début mai).

- **28 avril – 1er mai :** matchs de poules
- **2 – 4 mai :** phase finale (début du tableau)
- **5 – 10 mai :** phases finales et finales

Le programme détaillé des rencontres dépendra des résultats en poules, mais les supporters français pourront suivre les matchs tout au long de la compétition, avec une montée en intensité progressive jusqu'aux phases finales.

## Une équipe de France ambitieuse

La France arrive avec de grandes ambitions après ses performances lors de la précédente édition, où elle avait décroché une **médaille d'argent chez les hommes** et une **médaille de bronze chez les femmes**. Ces résultats témoignent du dynamisme du tennis de table français.

La sélection 2026 s'appuie sur une génération talentueuse, notamment portée par les **frères Lebrun** — Alexis et Félix — qui continuent leur montée en puissance sur le circuit mondial. Entourés de joueurs expérimentés, les Bleus visent haut : monter à nouveau sur le podium, voire décrocher l'or lors de cette édition du centenaire.

## Les autres échéances à suivre en 2026

Avant et après les Mondiaux, plusieurs compétitions rythment la saison :

- **30 mars – 5 avril :** Coupe du monde individuelle à Macao — déjà terminée
- **28 avril – 10 mai :** Championnats du monde par équipes à Londres
- **juin 2026 :** Championnats de France
- **été 2026 :** circuit WTT (Contender, Star Contender, Champions)

## Conclusion

Les Championnats du monde par équipes 2026 représentent un moment clé pour le tennis de table français. Avec une génération en pleine progression et des ambitions élevées, les Bleus auront une belle carte à jouer à Londres lors de cette édition du centenaire.

Les prochaines semaines s'annoncent donc passionnantes pour tous les amateurs de ping, avec des matchs à fort enjeu et un spectacle de très haut niveau. Rendez-vous du 28 avril au 10 mai à Londres !`

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Tennis de table 2026 : cap sur les Mondiaux par équipes",
    slug: "tennis-de-table-2026-mondiaux-equipes-londres",
    extrait: "Les Championnats du monde par équipes 2026 se tiennent à Londres du 28 avril au 10 mai. La France, vice-championne du monde chez les hommes, vise le podium avec les frères Lebrun en tête de proue.",
    contenu,
    categorie: "actualite",
    publie: true,
    auteur_id: admin?.id || null,
  }).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, article: data?.[0] })
}
