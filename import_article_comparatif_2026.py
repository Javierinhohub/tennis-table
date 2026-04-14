"""
import_article_comparatif_2026.py — Ajoute l'article comparatif revêtements 2026 sur TT-Kip
==============================================================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_article_comparatif_2026.py
"""

import os, sys
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌  Définissez SUPABASE_URL et SUPABASE_KEY avant de lancer le script.")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Contenu de l'article ─────────────────────────────────────────────────────

TITRE   = "Le Kip Comparatif 2026 : Quelle plaque choisir pour attaquer ?"
SLUG    = "kip-comparatif-2026-quelle-plaque-choisir-pour-attaquer"
CAT     = "comparatif"
EXTRAIT = (
    "En 2026, face à la jungle des revêtements hybrides et mousses dures, "
    "on passe au tamis les 10 références incontournables pour les attaquants. "
    "Rotation, puissance ou compromis : trouvez votre plaque idéale."
)

CONTENU = """\
Le tennis de table est entré dans l'ère des mousses dures et des revêtements hybrides (un peu collants). En 2026, pour percer les défenses et imposer son jeu avec la balle plastique, il faut du costaud, du rigide et mettre de la rotasse !

Mais face à la jungle des nouveautés et des classiques intouchables, comment s'y retrouver ? Pour vous, lecteurs de tt-kip.com, on a passé au tami les 10 références incontournables pour les attaquants qui veulent du sérieux.

## Le Guide Détaillé : À quel profil vous identifiez-vous ?

## 1. Les fans de rotation, c'est par ici !

Si votre jeu tourne autour du top spin, du contre-top près de la table et des services/remises ultra agressifs, vous êtes au bon endroit.

### **DHS Hurricane 3 National (Mousse Bleue)** :

L'arme fatale de l'équipe de Chine, de Wang Chuqin à Sun Yingsha. Son accroche est unique et le rejet, très haut. Le problème ? Sans booster, c'est une vraie planche... Son prix est exorbitant, la version authentique est rare, et elle ne pardonne pas les erreurs de placement.

### **Butterfly Dignics 09C** :

Le chouchou de nombreux pros comme Lin Yu Ju. C'est l'hybride idéal. Il offre un effet proche du H3, mais avec la dynamique d'un Tensor européen. Son contrôle dans le petit jeu est incroyable, grâce à sa surface collante qui "retient" la balle en poussette.

### **Butterfly Zyre03** :

Le choix d'Harimoto et d'autres joueurs sponsorisés par Butterfly. Sa mousse ultra-épaisse et son topsheet fin allient vitesse et rotation. La surface est moins collante que celle du Dignics 09C.

## 2. Pour ceux qui veulent tout exploser !

Pour les joueurs qui aiment conclure le point en un ou deux coups de raquette, et qui privilégient le jeu à mi-distance ou la frappe à plat.

### **Joola Dynaryz Inferno** :

Cette plaque porte bien son nom. C'est un vrai lance-fusées. Avec sa mousse à 50° (un peu plus souple que les autres "briques" de ce classement) et son topsheet hyper tendu, la balle repart à une vitesse folle. Le rejet plus bas favorise les frappes et les tops frappés, mais demande un excellent toucher pour éviter de tout envoyer dehors.

### **Andro NUZN 55** & **Stiga Helix Platinum XH** :

Deux bêtes de puissance. Le **Andro NUZN 55** (l'arme de Simon Gauzy et Sabine Winter) est extrêmement dur et demande un bras solide pour compresser la mousse, mais une fois activé, la lourdeur de balle est impressionnante. Le Stiga est un peu plus indulgent et excelle dans le jeu de contre-initiative rapide. C'est la nouvelle plaque de Truls Moregard.

## 3. Les meilleurs compromis (L'équilibre Attaque/Contrôle)

Vous cherchez l'accroche d'un hybride sans sacrifier le contrôle et votre budget ?

### **Tibhar Hybrid K3** :

Sans doute l'un des meilleurs rapports qualité-prix du marché. Adopté par les Lebrun, il offre une accroche phénoménale au service et en top spin, tout en gardant une dynamique très rassurante. Il est nettement moins cher que ses concurrents.

### **Donic Bluestar A1** & **Victas V > 15 Sticky** :

Deux excellentes alternatives. Le **Donic Bluestar A1** possède une mousse "Optimized Energy" qui lui donne une sensation unique, un peu plus "cliquante" que le K3. Flavien Coton en est fan... Le Victas est le plus abordable financièrement, offrant une transition en douceur pour ceux qui n'ont jamais testé de plaques collantes. C'est l'arme de Benedikt Duda !

## Le verdict TT-KIP : L'essentiel à savoir avant de craquer ($$$$$)

**1. Méfiez-vous du poids !** Toutes ces plaques pèsent entre 50 et 55 grammes (une fois découpées). En mettre deux sur un bois lourd, et vous dépassez allègrement les 195 grammes. Si vous n'avez pas l'épaule solide, attention aux tendinites.

**2. La dureté ne fait pas tout.** Jouer avec du 55° (comme le NUZN, Jekyll & Hyde) exige un engagement physique total à chaque frappe. Si vous jouez en toucher ou que vous ne frappez pas fort, vous n'exploiterez que 30% du potentiel de la plaque. Dans ce cas, orientez-vous vers des versions plus souples (les déclinaisons 50° ou 47.5° de ces mêmes modèles).

**3. Le bois st tout aussi important !** Essayez une plaque OFF+ avec un bois défensif ou en ZLC, ça n'a rien à voir... Marier donc bien votre revêtement avec le bois. Plutôt un bois en fibre de carbone ou aramide.

**4. Notre coup de cœur 2026 :** Le **Tibhar Hybrid K3** pour son équilibre parfait et son prix qui reste "raisonnable" comparé aux envolées de Butterfly ou DHS, et le **Dignics 09C** si le budget n'est pas un souci et que vous voulez la référence absolue du moment.
"""

# ─── Récupération de l'auteur admin ───────────────────────────────────────────

def get_admin_id():
    res = sb.table("utilisateurs").select("id").eq("role", "admin").limit(1).execute()
    if res.data:
        return res.data[0]["id"]
    return None

# ─── Insertion de l'article ───────────────────────────────────────────────────

def main():
    print(f"\n📰  Insertion de l'article : {TITRE}")
    print(f"    Slug : {SLUG}")

    # Vérifier si l'article existe déjà
    existing = sb.table("articles").select("id").eq("slug", SLUG).execute()
    if existing.data:
        print("⚠️   Un article avec ce slug existe déjà. Mise à jour du contenu...")
        res = sb.table("articles").update({
            "titre": TITRE,
            "extrait": EXTRAIT,
            "contenu": CONTENU,
            "categorie": CAT,
        }).eq("slug", SLUG).execute()
        if res.data:
            print("✅  Article mis à jour avec succès !")
            print(f"    URL : /articles/{SLUG}")
        else:
            print("❌  Erreur lors de la mise à jour.")
        return

    auteur_id = get_admin_id()
    if not auteur_id:
        print("❌  Impossible de trouver un compte admin dans 'utilisateurs'.")
        sys.exit(1)

    res = sb.table("articles").insert({
        "titre": TITRE,
        "slug": SLUG,
        "extrait": EXTRAIT,
        "contenu": CONTENU,
        "categorie": CAT,
        "auteur_id": auteur_id,
        "publie": True,
        "vues": 0,
    }).execute()

    if res.data:
        print("✅  Article inséré et publié avec succès !")
        print(f"    URL : /articles/{SLUG}")
    else:
        print("❌  Erreur lors de l'insertion :", res)

if __name__ == "__main__":
    main()
