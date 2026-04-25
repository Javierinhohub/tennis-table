import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026vvip"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = "test-yinhe-vvip-cured-non-cured-picot-long"

  const { data: existing } = await supabaseAdmin
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .single()

  if (existing) {
    return NextResponse.json({ message: "Article already exists", id: existing.id })
  }

  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const admin = users?.users?.find(u => u.email?.toLowerCase() === "nasser.gasmi@gmail.com")

  const contenu = `Le Yinhe VVIP (édition Huang Jianjiang) est un picot long qui suscite de plus en plus d'intérêt chez les joueurs de ping. Disponible en version **cured (traitée)** et **non-cured (non traitée)**, il est réputé pour sa capacité à produire une balle gênante et difficile à lire.

Dans ce test du Yinhe VVIP, nous analysons les performances réelles des deux versions : contrôle, gêne, bloc, défense et facilité de prise en main.

## Présentation du Yinhe VVIP

Le Yinhe VVIP est un picot long OX léger conçu pour absorber l'énergie de la balle adverse et générer un effet flottant prononcé. Il s'adresse principalement aux joueurs à la table ou en défense moderne.

- **Version cured :** picots traités, plus rigides et plus lisses
- **Version non-cured :** picots naturels, plus souples et légèrement adhérents

Le traitement des picots vise à renforcer la gêne et l'inversion d'effet, au prix d'un contrôle plus délicat.

## Sensations générales en jeu

Le Yinhe VVIP se distingue par une forte inversion d'effet et une trajectoire de balle difficile à anticiper. Il reste relativement tolérant en bloc, ce qui le rend accessible pour un picot long orienté gêne.

Comparé à d'autres picots longs offensifs, il est légèrement plus lent mais offre une meilleure sécurité dans le jeu passif.

## Test du Yinhe VVIP non-cured

### Avantages

- Excellent contrôle en bloc à la table
- Très bonne absorption de la vitesse
- Trajectoires basses en défense coupée
- Effet flottant naturel
- Bonne tolérance aux erreurs de timing

### Inconvénients

- Sensibilité aux tops très chargés en rotation
- Moins efficace loin de la table
- Moins rigide pour la défense classique

La version non-cured du Yinhe VVIP est la plus équilibrée. Elle conviendra à la majorité des joueurs recherchant un picot long gênant mais contrôlable.

## Test du Yinhe VVIP cured

### Avantages

- Gêne maximale à la table
- Effet flottant accentué
- Inversion d'effet plus marquée
- Balles imprévisibles pour l'adversaire

### Inconvénients

- Contrôle plus difficile
- Prise en main exigeante
- Sensations plus sèches
- Comportement parfois irrégulier

Le Yinhe VVIP cured s'adresse à des joueurs expérimentés cherchant un maximum de gêne, notamment en bloc actif et en jeu perturbateur.

## Comparatif Yinhe VVIP Cured vs Non-Cured

| Critère | Non-cured | Cured |
|---------|-----------|-------|
| Contrôle | Élevé | Moyen |
| Gêne | Bonne | Très élevée |
| Facilité | Accessible | Exigeante |
| Bloc à la table | Très performant | Performant |
| Défense loin de la table | Limitée | Limitée |
| Effet flottant | Important | Très important |

## Performances en match

### Bloc à la table

Le Yinhe VVIP excelle dans le bloc. Il permet de produire des balles basses, fusantes et difficiles à relever. La version non-cured offre plus de sécurité, tandis que la version cured maximise la gêne.

### Défense coupée

En chop, le revêtement produit une inversion correcte avec des trajectoires basses. Cependant, il n'est pas le plus adapté pour un jeu de défense classique loin de la table.

### Jeu actif

Les coups actifs comme le piston ou le faux top sont particulièrement efficaces, avec des trajectoires plongeantes et difficiles à anticiper.

## Quel Yinhe VVIP choisir ?

Le choix entre version cured et non-cured dépend du style de jeu :

- **Non-cured :** idéal pour un jeu contrôlé, polyvalent et sécurisant
- **Cured :** recommandé pour maximiser la gêne et jouer de manière agressive à la table

## Avis final sur le Yinhe VVIP

Le Yinhe VVIP est un picot long performant qui combine gêne naturelle et facilité en bloc. Il constitue une option intéressante pour les joueurs recherchant un revêtement perturbant sans sacrifier totalement le contrôle.

La version non-cured conviendra à la majorité des joueurs, tandis que la version cured s'adresse à un public plus expérimenté.`

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Test du Yinhe VVIP : Cured vs Non-Cured",
    slug,
    extrait: "Comparatif complet du Yinhe VVIP en version cured et non-cured. Contrôle, gêne, bloc et défense : tout ce qu'il faut savoir sur ce picot long très perturbant.",
    contenu,
    categorie: "test",
    publie: true,
    auteur_id: admin?.id || null,
  }).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, article: data?.[0] })
}
