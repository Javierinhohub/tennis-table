import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026essences"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = "essences-de-bois-tennis-de-table-guide-complet"

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

  const contenu = `Quand on parle d'un bois de tennis de table, on pense souvent à sa vitesse ou à son nombre de plis. Mais derrière chaque bois se cache quelque chose de plus fondamental : l'**essence** dont il est fait. Le choix du bois, de son cœur à ses faces externes, conditionne tout — la vitesse, la sensation dans la main, la façon dont la balle "mord" le revêtement, et la tolérance aux erreurs de frappe.

Ce guide détaille les principales essences utilisées en lutherie de raquette de ping, leur comportement physique, et comment elles se marient aux différents styles de jeu.

## La structure d'un bois de raquette

Un bois de raquette est un **panneau multicouche** (de 3 à 7 plis, parfois plus avec des fibres composites). Chaque couche a un rôle précis :

- **Le cœur (pli central)** : donne la rigidité globale et absorbe les vibrations
- **Les plis internes** : transmettent l'énergie entre cœur et faces
- **Les faces externes** : au contact direct du revêtement, elles déterminent le toucher de balle et la "prise" du revêtement

L'association intelligente de ces couches, avec des essences différentes orientées perpendiculairement (grain croisé), donne au bois ses caractéristiques définitives.

![Coupe transversale d'un bois de raquette montrant les 5 plis](https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Plywood_layers.jpg/640px-Plywood_layers.jpg)

## Les grandes familles d'essences

### Le Kiri (Paulownia)

Le **Kiri**, ou Paulownia tomentosa, est l'essence la plus légère utilisée en lutherie de raquette. Son bois est extrêmement poreux, tendre et léger (densité ≈ 0,27 g/cm³ — soit la moitié du chêne). C'est l'essence la plus répandue dans les bois défensifs et all-round lents.

![Arbre Paulownia en fleurs, donnant le bois Kiri utilisé dans les raquettes défensives](https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Paulownia_tomentosa_flowers.jpg/640px-Paulownia_tomentosa_flowers.jpg)

**Propriétés techniques :**
- Densité très faible → bois très léger
- Forte absorption des vibrations → sensation de contrôle prononcée
- Flexibilité élevée → trajectoires basses et sécurisées
- Peu de catapulte → la balle ne "part" pas toute seule

**Styles de jeu associés :** défense classique (chop loin de la table), blockers, joueurs polyvalents cherchant le contrôle. Des bois comme le **Butterfly Primorac** ou le **STIGA Defensive Classic** utilisent du kiri en cœur.

---

### L'Ayous (Obeche / Samba)

L'**Ayous** (Triplochiton scleroxylon), également appelé Obeche ou Samba selon les régions, est l'essence reine du tennis de table. On la retrouve dans la très grande majorité des bois all-round et offensifs du marché.

![Grain de l'Ayous (Obeche), essence la plus répandue dans les raquettes de tennis de table](https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Triplochiton_scleroxylon.jpg/640px-Triplochiton_scleroxylon.jpg)

**Propriétés techniques :**
- Densité modérée (≈ 0,38 g/cm³)
- Grain droit, homogène → bonne constance de frappe
- Bonne résonance → transmission efficace de l'énergie
- Toucher doux et équilibré

**Styles de jeu associés :** all-round, topspin offensif, polyvalence. Des références comme le **STIGA Allround Classic**, le **Butterfly Timo Boll ALC** ou le **Donic Appelgren Allplay** utilisent de l'ayous dans leur construction.

---

### Le Limba

Le **Limba** (Terminalia superba) est souvent confondu avec l'Ayous en raison de leur aspect similaire, mais il est légèrement plus lourd et plus rigide. Il donne une sensation plus "incisive" et directe dans la balle.

**Propriétés techniques :**
- Densité légèrement supérieure à l'ayous (≈ 0,42 g/cm³)
- Rigidité accrue → plus de vitesse directe
- Toucher plus "sec" que l'ayous
- Bonne tenue dans le temps

**Styles de jeu associés :** topspin offensif, joueurs recherchant un toucher plus direct. Très présent chez **Butterfly** (Schlager Carbon, ZHANG Jike ZLC).

---

### Le Hinoki (Cyprès du Japon)

L'**Hinoki** (Chamaecyparis obtusa) est l'essence emblématique de la lutherie japonaise. Ce cyprès à croissance lente produit un bois aux fibres exceptionnellement serrées, avec un effet de catapulte unique et une résonnance très prononcée.

![Forêt de Hinoki (cyprès japonais), essence emblématique des raquettes japonaises haut de gamme](https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Chamaecyparis_obtusa_forest.jpg/640px-Chamaecyparis_obtusa_forest.jpg)

**Propriétés techniques :**
- Densité modérée mais fibres très serrées
- Effet catapulte très marqué → vitesse avec peu d'efforts
- Vibrations caractéristiques → excellent "ressenti" de la balle
- Bois massif (souvent utilisé en pli unique mono-bois hinoki)

**Styles de jeu associés :** penholder japonais, joueurs recherchant le ressenti et la vitesse naturelle. Les bois **hinoki mono** sont très appréciés des défenseurs de haut niveau (chopper) qui cherchent du ressenti loin de la table. Les bois **Yasaka Ma Lin**, **Nittaku Violin** ou les constructions Tamasu utilisent du hinoki.

---

### Le Koto

Le **Koto** (Pterygota bequaertii) est un bois plus dur que l'ayous, utilisé principalement comme **pli externe** dans les bois offensifs rapides. Sa dureté confère une surface de frappe très directe et une bonne prise du revêtement.

**Propriétés techniques :**
- Densité élevée (≈ 0,55–0,65 g/cm³)
- Grande rigidité en surface → toucher sec et précis
- Peu de flexion → bonne transmission de l'énergie vers la balle
- Souvent associé à un cœur souple (ayous ou balsa) pour équilibrer

**Styles de jeu associés :** topspin offensif pur, contre-attaquants. Très utilisé par **Butterfly** en pli externe (ex. : Timo Boll Spirit, Viscaria).

---

### Le Balsa

Le **Balsa** (Ochroma pyramidale) est le bois le plus léger au monde (densité ≈ 0,12–0,20 g/cm³). Son usage en raquette de ping est cantonné aux **plis internes** pour alléger l'ensemble et donner de la flexibilité, parfois en cœur des bois "speed".

![Bois de Balsa, le plus léger au monde, utilisé en cœur de certains bois offensifs](https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Balsa_wood_model.jpg/640px-Balsa_wood_model.jpg)

**Propriétés techniques :**
- Densité extrêmement faible
- Compressibilité élevée → effet catapulte important sous la frappe
- Légèreté remarquable

**Styles de jeu associés :** certains bois offensifs très légers, bois de vitesse pure.

---

### Les fibres composites : Carbone, ALC, ZLC

Les **fibres composites** ne sont pas des essences à proprement parler, mais elles s'insèrent dans les constructions multicouches pour augmenter la rigidité et la vitesse.

![Tissu de fibres de carbone, matériau utilisé en plis intermédiaires dans les bois offensifs modernes](https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Woven_carbon_fibre.jpg/640px-Woven_carbon_fibre.jpg)

- **Carbone pur (CF)** : fibre très rigide, maximise la vitesse, réduit fortement le ressenti. Balle "dure" au toucher.
- **ALC (Arylate-Carbon)** : tissage mixte arylate + carbone. Plus souple que le CF pur, meilleur ressenti, très utilisé en compétition moderne. Ex. : Butterfly Timo Boll ALC, Zhang Jike ALC.
- **ZLC (Zylon-Carbon)** : fibre Zylon haute performance de Butterfly. Vitesse très élevée avec un ressenti légèrement meilleur que l'ALC. Ex. : Butterfly Innerforce ZLC.
- **Textreme (T5000)** : fibre de carbone à tressage 45° de Stiga. Transmission d'énergie maximale, très rapide.
- **Kevlar** : fibre aramide, amortit davantage que le carbone — utilisée dans certains bois pour adoucir la trajectoire.

## Impact des essences sur le jeu : synthèse

| Essence | Densité | Vitesse | Contrôle | Ressenti | Vibrations |
|---------|---------|---------|----------|----------|------------|
| Kiri | Très faible | Lente | Excellent | Doux | Amorties |
| Balsa | Extrême. faible | Moyenne+ | Bon | Neutre | Faibles |
| Ayous | Faible | Moyenne | Bon | Naturel | Normales |
| Limba | Faible-moyen | Moyenne+ | Bon | Direct | Normales |
| Hinoki | Moyen | Rapide | Moyen | Excellent | Marquées |
| Koto | Élevée | Rapide | Moyen | Sec | Transmises |
| Carbone | — | Très rapide | Faible | Peu | Très fortes |
| ALC | — | Rapide | Moyen | Moyen | Fortes |

## Essences et styles de jeu

### Joueur défensif (chop loin de la table)

Le défenseur classique a besoin d'un bois **lent, flexible et absorbant**. Il joue loin de la table et doit contrôler des balles très chargées en rotation.

**Construction idéale :** cœur en **kiri** ou **ayous léger**, faces en **ayous** ou **hinoki** fin. Peu ou pas de composite. 5 plis maximum.

**Exemples :** STIGA Defensive Pro, Butterfly Primorac (5 plis ayous/kiri), Donic Defplay Senso.

**Pourquoi ?** Le kiri absorbe l'énergie de la balle adverse. La flexibilité du bois permet un temps de contact long → meilleur contrôle de la trajectoire en coupé.

### Joueur all-round (polyvalent topspin/bloc)

L'all-rounder veut un compromis entre vitesse et contrôle. Il joue à mi-table ou à la table, attaque et défend.

**Construction idéale :** 5 plis **ayous** ou **lima/ayous** mixte, sans composite. Parfois un pli de **carbone intérieur** très fin pour légèrement augmenter la vitesse sans perdre le toucher.

**Exemples :** STIGA Allround Classic (5 plis ayous), Butterfly Primorac Carbon (ayous + carbone intérieur léger).

**Pourquoi ?** L'ayous donne un toucher équilibré, ni trop lent ni trop rapide. Le grain homogène offre une bonne régularité de frappe.

### Joueur offensif (topspin agressif)

L'attaquant cherche vitesse et catapulte. Il prend la balle tôt et génère des topspins puissants.

**Construction idéale :** faces en **koto** ou **limba**, cœur **ayous** ou **balsa**, avec **ALC** ou **carbone** en plis intermédiaires.

**Exemples :** Butterfly Timo Boll ALC (ayous/ALC/koto), Zhang Jike ZLC (lima/ZLC/koto), Donic Waldner Senso Ultra Carbon.

**Pourquoi ?** Le koto en face externe crée une zone de frappe ferme qui projette la balle. L'ALC ou le ZLC amplifient la vitesse sans rendre le bois incontrôlable.

![Comparatif de coupes transversales de bois : à gauche un 5 plis all-round en ayous, à droite un bois carbone offensif](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Plywood_cross_section.jpg/640px-Plywood_cross_section.jpg)

### Joueur picots longs (perturbateur)

Le joueur picots longs a besoin d'un bois très **souple et absorbant**, pour maximiser la flexion du picot et l'inversion d'effet.

**Construction idéale :** bois souple, 5 plis **kiri/ayous**, sans aucun composite. Le bois doit "plier" sous le choc pour laisser le picot faire son travail.

**Exemples :** Butterfly Primorac, STIGA Allround Classic, bois classiques sans carbone.

**Pourquoi ?** Un bois rigide (carbone) "casse" le mouvement du picot et réduit l'inversion. La souplesse du bois laisse le picot se déformer → effet perturbateur maximal.

### Joueur backside (défenseur moderne / looper)

Le défenseur moderne joue avec du backside des deux côtés mais adopte un style mixte : il coupe en revers et loope en coup droit.

**Construction idéale :** compromis entre souplesse (pour le chop) et vitesse (pour le loop). **5 plis ayous** avec éventuellement un très léger composite intérieur.

**Exemples :** Butterfly Primorac Carbon, STIGA Clipper Wood, Donic Waldner Allplay.

### Penholder japonais

Le penholder JP frappe fort des deux côtés avec un seul revêtement.

**Construction idéale :** **hinoki** mono-bois (pli unique) ou 3 plis hinoki. Le ressenti du hinoki est crucial pour le feeling naturel de la frappe smashée et des flicks.

## Comment choisir selon son niveau

- **Débutant :** ayous all-round 5 plis. Indulgent, polyvalent, peu cher.
- **Intermédiaire :** ayous 5 plis ou carbone léger intérieur (ALC). Commence à jouer plus vite sans perdre le contrôle.
- **Confirmé offensif :** ALC ou ZLC, face koto/limba. Vitesse élevée, nécessite une technique solide.
- **Défenseur :** kiri/ayous sans composite. Absorbe tout, permet les contre-effets.
- **Picoteur :** bois souple all-round classique. La rigidité est l'ennemi du picot long.

## Conclusion

Le choix de l'essence est une décision aussi importante que le choix du revêtement. Un bois en kiri absorbe et contrôle, un bois en koto propulse, un hinoki résonne et donne du ressenti, un composite rigidifie et accélère. La compréhension de ces matériaux permet de choisir une raquette vraiment adaptée à son style — et pas uniquement en se fiant à la note de vitesse affichée sur la boîte.

La prochaine fois que vous tenez un bois en main, regardez ses plis en tranche : vous saurez maintenant lire ce que chaque couche vous dit.`

  const { data, error } = await supabaseAdmin.from("articles").insert({
    titre: "Les essences de bois au tennis de table : guide complet",
    slug,
    extrait: "Kiri, ayous, hinoki, koto, carbone, ALC… Découvrez comment chaque essence de bois influence le style de jeu : vitesse, contrôle, ressenti et inversion d'effet. Guide technique illustré pour choisir le bon bois selon votre jeu.",
    contenu,
    categorie: "conseil",
    publie: true,
    auteur_id: admin?.id || null,
  }).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, article: data?.[0] })
}
