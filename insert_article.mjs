import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://zrwobhblvyxqqarilxde.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd29iaGJsdnl4cXFhcmlseGRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyOTIzMiwiZXhwIjoyMDkwNzA1MjMyfQ.3fgXBZB6B2CR1kyeH1O7yraBTWy31X0rfO4zk5CEM70"
)

const AUTEUR_ID = "f0ff87c6-8b4d-4f3b-a5d4-d9b6a63ffc78" // ttkip.pro@gmail.com

const contenu = `Au tennis de table, choisir sa raquette — et plus particulièrement son bois — est souvent une affaire de sensations personnelles. On entend fréquemment parler de bois « secs », « flexibles », « rapides » ou encore de bois offrant davantage de contrôle. Mais ces sensations peuvent-elles être mesurées objectivement ?

C'est là qu'intervient l'analyse de la fréquence de résonance acoustique.

_Remarque : le terme « spectrométrie » est parfois employé par vulgarisation, mais « analyse de résonance acoustique » ou « analyse fréquentielle » est scientifiquement plus exact._

En termes simples, le son produit par un bois lorsqu'il vibre contient une mine d'informations sur sa structure et son comportement mécanique.

## Qu'est-ce que la fréquence de résonance d'un bois ?

La méthode consiste à analyser les vibrations sonores produites par le bois de la raquette. Pour effectuer la mesure, on tient généralement le bois nu (sans revêtements) par le manche, puis on frappe légèrement le centre de la palette avec un doigt ou une balle. Le son est ensuite enregistré à l'aide d'un microphone ou d'un smartphone.

Un logiciel d'analyse fréquentielle permet alors d'identifier la fréquence de résonance principale du bois, exprimée en Hertz (Hz). Cette valeur constitue un indicateur caractéristique du comportement vibratoire du bois.

## Ce que révèle la fréquence de résonance

D'un point de vue physique, la fréquence de résonance dépend principalement de la rigidité et de la masse du système. La relation simplifiée peut s'écrire :

**f ∝ √(k/m)**

où **f** représente la fréquence, **k** la rigidité et **m** la masse.

De cette relation découlent deux observations importantes :

- un bois plus rigide tend à présenter une fréquence plus élevée ;
- un bois plus lourd tend à présenter une fréquence plus faible.

Une fréquence élevée est donc généralement associée à une plus grande rigidité et souvent à une sensation de vitesse supérieure. Cependant, la fréquence seule ne suffit pas à définir les performances globales d'un bois.

La vitesse réelle dépend également de nombreux autres paramètres : l'épaisseur de la palette, la nature des plis, la répartition des masses, les propriétés élastiques des différentes essences utilisées ainsi que la présence éventuelle de fibres composites.

## Ordres de grandeur observés

Les fréquences mesurées sur des bois nus se répartissent souvent selon les plages suivantes :

| Type de bois | Fréquence indicative (Hz) | Caractéristiques générales |
|---|---|---|
| DEF | 1000 – 1150 | Flexible, forte absorption de l'énergie |
| ALL | 1150 – 1300 | Équilibre entre contrôle et dynamisme |
| OFF | 1300 – 1450 | Rigidité plus élevée, réponse plus directe |
| OFF+ | 1450 et plus | Réponse très rapide et structure très rigide |

_Note : ces plages constituent des repères fréquemment observés et non des frontières strictes. Certains bois ALL+ peuvent dépasser 1300 Hz tandis que certains OFF restent en dessous. Les valeurs indiquées correspondent à des mesures réalisées sur des bois nus selon les méthodes de résonance acoustique couramment utilisées par la communauté des passionnés de matériel._

## L'influence des fibres composites

Les fibres synthétiques comme le carbone, l'ALC (Arylate-Carbone) ou le ZLC (Zylon-Carbone) modifient fortement les propriétés mécaniques du bois.

Dans la majorité des cas, elles augmentent la rigidité de l'ensemble et tendent à élever la fréquence de résonance.

Cependant, cette augmentation n'est pas systématique. La nature de la fibre, son épaisseur et surtout sa position dans la structure influencent fortement le résultat. Par exemple, les bois dits **Inner Carbon**, dans lesquels les fibres composites sont placées autour du pli central, conservent souvent des fréquences relativement proches de celles de bois offensifs traditionnels tout en bois.

## Pourquoi mesurer la fréquence de son bois ?

L'intérêt principal de cette démarche réside dans l'obtention d'une mesure objective.

### Retrouver un exemplaire similaire

Le bois étant un matériau naturel, sa densité et sa rigidité peuvent varier légèrement d'un exemplaire à l'autre, même au sein d'une même référence. Deux bois du même modèle peuvent ainsi présenter des comportements légèrement différents.

Mesurer la fréquence permet d'identifier un exemplaire proche de celui que l'on apprécie déjà et facilite le remplacement d'un bois devenu introuvable ou endommagé.

### Mieux comprendre ses préférences

Un joueur qui constate que ses bois favoris se situent systématiquement autour de 1250 à 1300 Hz disposera d'un indicateur précieux pour orienter ses futurs achats.

### Compléter les informations marketing

Les cotations de vitesse et de contrôle fournies par les fabricants reposent sur des référentiels propres à chaque marque. Une mesure physique apporte un point de comparaison indépendant et reproductible.

## Les limites de la méthode

Si la fréquence de résonance constitue un indicateur particulièrement utile, elle ne résume pas à elle seule toutes les caractéristiques d'un bois.

Elle ne permet pas de mesurer directement :

- les vibrations résiduelles ressenties dans la main ;
- la taille de la zone d'impact optimale (sweet spot) ;
- l'équilibre en tête ou en manche de la raquette ;
- le comportement du bois à différentes intensités de jeu ;
- le temps de contact réel (dwell time) entre la balle et la raquette.

Ce dernier dépend également des revêtements utilisés, de la balle et du geste du joueur.

Ainsi, deux bois affichant exactement la même fréquence à nu peuvent procurer des sensations sensiblement différentes une fois les revêtements collés et la balle en jeu.

## Conclusion

L'analyse de la fréquence de résonance montre que les sensations recherchées par les pongistes reposent sur des bases physiques bien réelles. Sans remplacer les essais à la table, elle constitue un outil moderne et pertinent pour comparer le matériel, mieux comprendre ses préférences et rationaliser le choix de sa raquette.

La prochaine fois que vous changerez vos revêtements, pourquoi ne pas faire « chanter » votre bois ? Quelques secondes d'enregistrement suffisent pour obtenir une véritable carte d'identité mécanique de votre matériel.

Derrière chaque sensation de jeu se cache une réalité mesurable. La fréquence de résonance n'explique pas tout, mais elle offre aux pongistes un rare pont entre le ressenti subjectif et la physique du matériel.`

const { data, error } = await supabase.from("articles").insert({
  titre: "Quand la Science Frappe la Balle : Mesurer les Bois de Tennis de Table par Résonance Acoustique",
  slug: "mesurer-les-bois-par-resonance-acoustique",
  extrait: "Savez-vous que le son de votre bois peut révéler sa rigidité, sa classe et son comportement mécanique ? Découvrez comment l'analyse de fréquence de résonance acoustique permet de mesurer objectivement ce que les joueurs ressentent à la table.",
  contenu,
  categorie: "conseil",
  produit_id: null,
  auteur_id: AUTEUR_ID,
  publie: true,
}).select("id, slug")

if (error) {
  console.error("Erreur :", error.message)
  process.exit(1)
}
console.log("Article créé :", data)
