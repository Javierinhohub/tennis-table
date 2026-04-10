"""
import_nittaku_donic.py — Bois Nittaku + Donic pour TT-Kip
=============================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_nittaku_donic.py
"""

import os, re, sys
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ─── Données ──────────────────────────────────────────────────────────────────

BOIS = [

    # ══════════════════════════════════════════════════════════════════════
    # NITTAKU
    # ══════════════════════════════════════════════════════════════════════

    # ── Gamme signatures Nittaku ─────────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Mima Ito Carbon",
        "nb_plis": 7,
        "poids_g": 90,
        "epaisseur_mm": 5.5,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "Construction identique à l'Acoustic Carbon — 5 bois + 2 FE Carbon outer. Limber-FE Carbon-Ayous-Kiri-Ayous-FE Carbon-Limber",
        "pli1": "Limber", "pli2": "FE Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "FE Carbon", "pli7": "Limber",
    },
    {
        "marque": "Nittaku",
        "nom": "Hina Hayata H2",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 5.8,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 bois + 2 PKC inner (Kevlar haute module + carbone). Limba extérieur, core Ayous",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "PKC",
        "pli4": "Ayous", "pli5": "PKC", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── Série « Instruments à cordes » ────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Acoustic",
        "nb_plis": 5,
        "poids_g": 83,
        "epaisseur_mm": 5.8,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois pur — placage spécial inspiré de la lutherie. Kiso Hinoki extérieur",
        "pli1": "Kiso Hinoki", "pli2": "Ayous", "pli3": "Kiri",
        "pli4": "Ayous", "pli5": "Kiso Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Acoustic Carbon",
        "nb_plis": 7,
        "poids_g": 90,
        "epaisseur_mm": 5.5,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 FE Carbon outer — Kiso Hinoki-FE Carbon-Ayous-Kiri-Ayous-FE Carbon-Kiso Hinoki",
        "pli1": "Kiso Hinoki", "pli2": "FE Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "FE Carbon", "pli7": "Kiso Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Violin",
        "nb_plis": 5,
        "poids_g": 85,
        "style": "OFF-",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois pur — face Hinoki/Ash avec noyau Kiri rigide, série instrument à cordes Nittaku",
        "pli1": "Hinoki", "pli2": "Ash", "pli3": "Kiri",
        "pli4": "Ash", "pli5": "Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Violin Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 carbone — version carbone du Violin",
        "pli1": "Hinoki", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Violoncello",
        "nb_plis": 5,
        "poids_g": 92,
        "epaisseur_mm": 5.3,
        "style": "DEF",
        "note_vitesse": 4,
        "note_controle": 10,
        "composition": "5 plis bois pur — lame de défense, bois denses, série instrument à cordes Nittaku (164×154mm)",
    },
    {
        "marque": "Nittaku",
        "nom": "Guitar",
        "nb_plis": 5,
        "poids_g": 82,
        "style": "ALL",
        "note_vitesse": 6,
        "note_controle": 9,
        "composition": "5 plis bois pur — face Hinoki, série instrument à cordes Nittaku",
        "pli1": "Hinoki", "pli2": "Ayous", "pli3": "Kiri",
        "pli4": "Ayous", "pli5": "Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Jazz",
        "nb_plis": 5,
        "poids_g": 84,
        "style": "ALL-",
        "note_vitesse": 5,
        "note_controle": 10,
        "composition": "5 plis bois pur — lame de contrôle, série instrument à cordes Nittaku",
    },

    # ── Gamme composite Actec / Basaltec ──────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Actec",
        "nb_plis": 5,
        "poids_g": 84,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "3 bois + 2 Arylate-Carbon outer — Epicéa extérieur avec Arylate-Carbon sandwich",
        "pli1": "Epicéa", "pli2": "Arylate-Carbon", "pli3": "Kiri",
        "pli4": "Arylate-Carbon", "pli5": "Epicéa",
    },
    {
        "marque": "Nittaku",
        "nom": "Basaltec Inner",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 fibres de Basalte inner — basalte naturel volcanique pour une touche douce et contrôlée",
        "pli1": "Hinoki", "pli2": "Ayous", "pli3": "Basalte",
        "pli4": "Kiri", "pli5": "Basalte", "pli6": "Ayous", "pli7": "Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Basaltec Outer",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 fibres de Basalte outer — version plus rapide avec basalte en position extérieure",
        "pli1": "Basalte", "pli2": "Hinoki", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Hinoki", "pli7": "Basalte",
    },

    # ── Série Septear (Hinoki 7 plis) ────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Septear",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "7 plis Hinoki pur — très léger malgré 7 plis, attaque topspin dynamique",
        "pli1": "Kiso Hinoki", "pli2": "Hinoki", "pli3": "Hinoki",
        "pli4": "Hinoki", "pli5": "Hinoki", "pli6": "Hinoki", "pli7": "Kiso Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Septear Feel",
        "nb_plis": 7,
        "poids_g": 84,
        "style": "OFF-",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "7 plis Hinoki — version Feel plus souple et contrôlée du Septear",
    },
    {
        "marque": "Nittaku",
        "nom": "Septear Feel Inner",
        "nb_plis": 9,
        "poids_g": 86,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "7 bois Hinoki + 2 Carbon inner — version carbone inner du Septear Feel",
    },

    # ── Série Flyatt ──────────────────────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Flyatt Carbon Pro",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 Carbon outer — lame offensive premium Nittaku",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Nittaku",
        "nom": "Flyatt Soft",
        "nb_plis": 7,
        "poids_g": 84,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 fibres souples inner — version contrôle de la gamme Flyatt",
    },
    {
        "marque": "Nittaku",
        "nom": "Flyatt Spin",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 Aramide inner — optimisé pour la rotation (spin), réponse douce",
    },

    # ── Gamme Ludeack ─────────────────────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Ludeack",
        "nb_plis": 5,
        "poids_g": 84,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois pur — proche de l'Acoustic en sensation, meilleur bloc, face spéciale",
    },
    {
        "marque": "Nittaku",
        "nom": "Ludeack Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 Carbon inner — version carbone du Ludeack",
    },

    # ── Alnade (7 plis bois pur) ──────────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Alnade",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "7 plis bois pur — Aulne extérieur, noyau Kiri, série bois massif Nittaku",
        "pli1": "Aulne", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Aulne",
    },
    {
        "marque": "Nittaku",
        "nom": "Alnade Inner",
        "nb_plis": 9,
        "poids_g": 88,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "7 bois + 2 Carbon inner — version carbone inner de l'Alnade",
    },

    # ── Autres Nittaku ─────────────────────────────────────────────────────

    {
        "marque": "Nittaku",
        "nom": "Best Carbon",
        "nb_plis": 5,
        "poids_g": 82,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "3 bois + 2 Carbon outer — Kiso Hinoki-Carbon-Kiri-Carbon-Kiso Hinoki",
        "pli1": "Kiso Hinoki", "pli2": "Carbone", "pli3": "Kiri",
        "pli4": "Carbone", "pli5": "Kiso Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Alteel",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "5 bois + 2 Inox (acier inoxydable) outer — très rigide, ultra-rapide, touche particulière",
        "pli1": "Koto", "pli2": "Inox", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Inox", "pli7": "Koto",
    },
    {
        "marque": "Nittaku",
        "nom": "Hino Carbon",
        "nb_plis": 5,
        "poids_g": 84,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "3 bois + 2 Carbon — Kiso Hinoki extérieur avec carbon outer",
        "pli1": "Kiso Hinoki", "pli2": "Carbone", "pli3": "Kiri",
        "pli4": "Carbone", "pli5": "Kiso Hinoki",
    },
    {
        "marque": "Nittaku",
        "nom": "Large Blast",
        "nb_plis": 7,
        "poids_g": 92,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "5 bois + 2 Carbon — lame offensive puissante, grande surface de frappe",
    },
    {
        "marque": "Nittaku",
        "nom": "Resist II",
        "nb_plis": 5,
        "poids_g": 72,
        "style": "DEF",
        "note_vitesse": 3,
        "note_controle": 10,
        "composition": "5 plis bois pur — lame de défense, légère et maniable",
    },


    # ══════════════════════════════════════════════════════════════════════
    # DONIC
    # ══════════════════════════════════════════════════════════════════════

    # ── Gamme Waldner ─────────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Waldner Senso Carbon",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 Carbon outer — Limba-Ayous-Carbon-Ayous-Carbon-Ayous-Limba",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Carbone",
        "pli4": "Ayous", "pli5": "Carbone", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Donic",
        "nom": "Waldner Senso Ultra Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "5 bois + 2 Ultra Carbon outer — version premium et plus rigide du Senso Carbon",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ultra Carbone",
        "pli4": "Ayous", "pli5": "Ultra Carbone", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Donic",
        "nom": "Waldner Legend",
        "nb_plis": 5,
        "poids_g": 86,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 plis bois pur — lame signature Jan-Ove Waldner, classique suédois",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Waldner Dotec Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 Dotec Carbon outer — technologie Donic avec microfibres carbon",
    },

    # ── Gamme Persson ─────────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Persson Powerplay",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "7 plis bois + pli amortisseur sous le Koto extérieur — technique suédoise, touche bois avec dynamisme",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Persson Senso Carbon",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 Carbon — version carbon de la gamme Persson",
    },

    # ── Gamme Ovtcharov ───────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Ovtcharov Carbospeed",
        "nb_plis": 5,
        "poids_g": 80,
        "epaisseur_mm": 7.0,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "3 bois + 2 Energy Carbon outer — Kiso Hinoki-Carbon-Kiri-Carbon-Kiso Hinoki. Ultra-rigide, très épais (7mm)",
        "pli1": "Kiso Hinoki", "pli2": "Energy Carbone", "pli3": "Kiri",
        "pli4": "Energy Carbone", "pli5": "Kiso Hinoki",
    },
    {
        "marque": "Donic",
        "nom": "Ovtcharov Senso Carbon V1",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "5 bois + 2 Carbon inner — Limba extérieur, carbon inner, touche équilibrée",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Carbone",
        "pli4": "Ayous", "pli5": "Carbone", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── Gamme Zhang Jike ──────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Zhang Jike Original Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "5 bois + 2 Aramide-Carbon outer — Koto-Aramide Carbon-Ayous-Kiri-Ayous-Aramide Carbon-Koto",
        "pli1": "Koto", "pli2": "Aramide-Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Aramide-Carbon", "pli7": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Zhang Jike New Era",
        "nb_plis": 7,
        "poids_g": 87,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "5 bois + 2 New Era Carbon — version améliorée du Zhang Jike Original Carbon (2023)",
        "pli1": "Koto", "pli2": "New Era Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "New Era Carbon", "pli7": "Koto",
    },

    # ── Anders Lind ───────────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Anders Lind Hexa Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 bois + 2 Hexa Carbon inner — structure inner, touche plus douce que le Zhang Jike OC. Signature du joueur suédois Anders Lind",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Hexa Carbone",
        "pli4": "Kiri", "pli5": "Hexa Carbone", "pli6": "Ayous", "pli7": "Koto",
    },

    # ── Flavien Coton (utilise le Donic Relevant) ─────────────────────────

    {
        "marque": "Donic",
        "nom": "Relevant",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "5 bois + 2 Certran (Dyneema) inner — Limba-Certran-Limba-Ayous-Limba-Certran-Limba. Utilisé par Flavien Coton",
        "pli1": "Limba", "pli2": "Certran", "pli3": "Limba",
        "pli4": "Ayous", "pli5": "Limba", "pli6": "Certran", "pli7": "Limba",
    },

    # ── Gamme Appelgren ───────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Appelgren Allplay",
        "nb_plis": 5,
        "poids_g": 82,
        "style": "ALL+",
        "note_vitesse": 6,
        "note_controle": 9,
        "composition": "5 plis bois pur — lame all-round suédoise, idéale pour la progression",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Appelgren Allplay Senso",
        "nb_plis": 5,
        "poids_g": 82,
        "style": "ALL+",
        "note_vitesse": 6,
        "note_controle": 9,
        "composition": "5 plis bois pur avec technologie Senso (grip amélioré) — dérivé de l'Appelgren Allplay",
    },

    # ── Gamme Baum ────────────────────────────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Baum Turbo",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 7,
        "composition": "7 plis bois pur — lame signature Zoltan Baum, très rapide, 7 plis denses",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Baum Torpedo Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "5 bois + 2 Carbon outer — Koto-Carbon-Ayous-Kiri-Ayous-Carbon-Koto",
        "pli1": "Koto", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Koto",
    },

    # ── Gamme Classic / Originaux Donic ───────────────────────────────────

    {
        "marque": "Donic",
        "nom": "Classic Allround",
        "nb_plis": 5,
        "poids_g": 78,
        "style": "ALL",
        "note_vitesse": 5,
        "note_controle": 10,
        "composition": "5 plis bois pur — lame de contrôle polyvalente, idéale pour débutants et intermédiaires",
    },
    {
        "marque": "Donic",
        "nom": "Cayman",
        "nb_plis": 5,
        "poids_g": 85,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "5 plis bois pur — lame all-round avec bon punch, très populaire en club",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Koto",
    },
    {
        "marque": "Donic",
        "nom": "Original True Carbon",
        "nb_plis": 7,
        "poids_g": 86,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 6,
        "composition": "5 bois + 2 True Carbon outer — Donic True Carbon technology, très rapide",
    },
    {
        "marque": "Donic",
        "nom": "Epox Offensive",
        "nb_plis": 7,
        "poids_g": 90,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "7 plis bois pur — classique Donic, très bonne touche bois",
        "pli1": "Koto", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Koto",
    },

]

# ─── Utilitaires ──────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text)[:100]

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis")
        sys.exit(1)

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Charger marques
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map = {m["nom"].lower(): m["id"] for m in marques_res.data}
    print(f"📋 {len(marques_map)} marques trouvées : {', '.join(marques_map.keys())}")

    # Charger slugs existants
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs = {r["slug"] for r in existing_res.data}
    print(f"📋 {len(existing_slugs)} produits existants")

    inserted = 0
    skipped = 0
    errors = []

    for bois in BOIS:
        marque_nom = bois["marque"]
        nom = bois["nom"]
        slug = slugify(f"{marque_nom}-{nom}")

        if slug in existing_slugs:
            print(f"⏭️  Déjà présent : {nom}")
            skipped += 1
            continue

        # Trouver la marque
        marque_id = marques_map.get(marque_nom.lower())
        if not marque_id:
            for k, v in marques_map.items():
                if marque_nom.lower() in k or k in marque_nom.lower():
                    marque_id = v
                    break
        if not marque_id:
            try:
                res = sb.table("marques").insert({"nom": marque_nom}).execute()
                marque_id = res.data[0]["id"]
                marques_map[marque_nom.lower()] = marque_id
                print(f"   ➕ Marque créée : {marque_nom}")
            except Exception as e:
                errors.append(f"Marque '{marque_nom}' introuvable : {e}")
                continue

        try:
            # Insérer produit
            prod_res = sb.table("produits").insert({
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }).execute()
            produit_id = prod_res.data[0]["id"]
            existing_slugs.add(slug)

            # Construire ligne bois
            bois_row = {"produit_id": produit_id}
            for field in ["nb_plis", "poids_g", "epaisseur_mm", "style", "prix",
                          "composition", "note_vitesse", "note_controle",
                          "note_flexibilite", "note_durete", "note_qualite_prix",
                          "pli1", "pli2", "pli3", "pli4", "pli5", "pli6", "pli7"]:
                if field in bois:
                    bois_row[field] = bois[field]

            sb.table("bois").insert(bois_row).execute()
            print(f"✅ {marque_nom} — {nom}")
            inserted += 1

        except Exception as e:
            errors.append(f"Erreur '{nom}' : {e}")

    print("\n" + "="*50)
    print(f"✅ Insérés   : {inserted}")
    print(f"⏭️  Skippés   : {skipped}")
    print(f"❌ Erreurs   : {len(errors)}")
    for e in errors:
        print(f"  - {e}")
    print("="*50)
    nittaku_count = sum(1 for b in BOIS if b["marque"] == "Nittaku")
    donic_count = sum(1 for b in BOIS if b["marque"] == "Donic")
    print(f"\n📊 Total script : {nittaku_count} Nittaku + {donic_count} Donic = {len(BOIS)} bois")

if __name__ == "__main__":
    main()
