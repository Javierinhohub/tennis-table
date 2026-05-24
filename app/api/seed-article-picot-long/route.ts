import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const CONTENU = `# L'Art du Picot Long à la Table : Rejet, Dwell Time et Alchimie Humaine

Le jeu avec un picot long à la table (souvent utilisé sans mousse, dit « OX ») s'apparente à un jeu d'échecs à haute intensité. Ce style de « bloqueur agressif » consiste à retourner la force de l'adversaire contre lui-même en perturbant son rythme.

Pour que la magie opère et que le revêtement produise des balles flottantes et toxiques, le choix du bois est capital. Mais au-delà des caractéristiques d'un catalogue, c'est la rencontre entre la physique du bois, le dwell time (temps de contact) et la finesse biomécanique du joueur qui dicte la réalité du terrain.

---

## 1. La sainte trinité : Dureté, Rigidité et Dwell Time

Pour analyser le comportement d'un bois à la table, il faut disséquer sa structure. Dureté de surface, rigidité de l'ensemble et vitesse linéaire sont trois notions distinctes qui influencent directement le dwell time.

**L'inversion d'effet et le pli externe (Dureté)** — Face à un topspin lourd, un pli externe très dur limite l'enfoncement de la balle. Le dwell time est réduit au minimum. Les picots se plient instantanément sous l'impact, agissant comme un miroir : la rotation de l'adversaire lui est renvoyée sous forme de balle coupée.

**La trajectoire et l'absorption (Rigidité)** — L'angle de rejet dépend principalement de la flexion globale du bois. Un bois très rigide tend à rejeter la balle de manière basse et tendue. L'erreur classique est de penser qu'un bois rigide est forcément rapide. En réalité, un bois rigide mais doté d'essences de bois lentes offre un contrôle passif exceptionnel. Sans effet « trampoline » (élasticité), il absorbe l'énergie cinétique de la balle au lieu de la catapulter.

---

## 2. L'approche des fabricants : Dompter le temps de contact

Certaines marques ont développé des architectures spécifiques pour optimiser ce ratio subtil entre inversion et amortissement.

### Dr. Neubauer et la série Matador : Le rejet chirurgical

Le **Dr. Neubauer Matador** mise sur une surface très dure associée à une forte rigidité structurelle pour supprimer toute élasticité.

**La sensation en jeu** — Le temps de contact est quasi nul, ce qui favorise un angle de rejet particulièrement bas. Sur un bloc actif, l'adversaire a alors la sensation que la balle s'écrase et disparaît sous sa raquette après le rebond, le forçant à relever sa balle de manière précaire.

### Der Materialspezialist : L'amorti sélectif

À l'inverse, cette marque utilise souvent des compositions hybrides, parfois avec des cœurs en balsa ou des fibres synthétiques spécifiques.

**La sensation en jeu** — L'objectif est de dissocier l'impact. Sur un impact léger (remise courte), le bois se comporte comme un amortisseur pour réaliser des blocs « stop » juste derrière le filet. Sur un impact violent, le pli externe dur prend le relais pour conserver l'inversion. Le défi consiste ici à gérer l'effet catapulte qui peut survenir si l'adversaire frappe très fort.

### OSP et l'artisanat asymétrique : Le compromis des bois « Combi »

Le joueur à la table fait face à un dilemme : il veut un revers rigide à rejet bas pour son picot, mais un coup droit élastique à rejet haut pour attaquer en topspin. La marque artisanale OSP (Palatinus) propose une réponse particulièrement aboutie à ce problème avec l'**Immune OX Pushblocker**.

**La sensation en jeu** — La construction asymétrique permet d'avoir deux dwell times différents sur la même raquette. Le côté revers est rigidifié pour écraser la trajectoire du picot, tandis que le coup droit conserve le flex et le toucher vibrant du bois traditionnel, indispensables pour bien ressentir et accompagner la balle en attaque.

---

## 3. La dimension biomécanique : Le joueur reste le maître du jeu

Le meilleur bois du monde ne produira aucune gêne sans une action humaine précise. Le matériel ne fait qu'amplifier ou traduire l'intention du joueur. À ce niveau de jeu, le contrôle et la toxicité de la balle dépendent de détails biomécaniques subtils.

**Le relâchement de la main** — C'est la clé de voûte de l'amortissement. Pour contrer un topspin ultra-rapide avec un bois rigide, il faut savoir « ouvrir » légèrement les doigts à l'impact. Une main crispée sur le manche transforme le bois en catapulte. Une main relâchée absorbe l'énergie, prolonge artificiellement le dwell time et permet de distribuer la balle de manière chirurgicale.

**La stabilité du poignet et le transfert minimaliste** — Contrairement au jeu d'attaque, le bloc à la table exclut les grands mouvements. La stabilité du poignet garantit la régularité de l'angle de raquette. Le transfert de poids, quant à lui, est minimaliste mais vers l'avant : un léger engagement de l'épaule ou du buste au moment de l'impact permet de « casser » la trajectoire de la balle pour l'empêcher de monter.

**La lecture de rotation et le toucher fin** — Le pli externe du bois sert de capteur. Un bon bois transmet des vibrations nettes dans la main du joueur. C'est ce toucher fin qui permet de lire instantanément la quantité de rotation adverse et de décider, en une fraction de seconde, si le bloc doit être purement passif (opposition) ou actif (un léger mouvement de piston ou de chop-block du haut vers le bas) pour accentuer l'effet flottant.

---

Le bois idéal n'est donc pas une formule magique universelle. C'est celui qui offre la dureté nécessaire pour piéger l'adversaire, tout en agissant comme le prolongement naturel de votre main et de votre propre sensibilité technique.`

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
    .eq("slug", "art-picot-long-table-rejet-dwell-time")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ message: "L'article existe déjà", id: existing.id })
  }

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "L'Art du Picot Long à la Table : Rejet, Dwell Time et Alchimie Humaine",
    slug: "art-picot-long-table-rejet-dwell-time",
    extrait: "Dureté, rigidité, dwell time, biomécanique... Le jeu au picot long à la table est une discipline à part entière. Analyse des architectures de bois (Dr. Neubauer Matador, DMS, OSP Immune) et des gestes techniques qui font la différence entre une balle flottante et une balle catapultée.",
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
