"""
import_tibhar_stiga.py — Bois Tibhar + Stiga pour TT-Kip
==========================================================
Lancement :
    SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=votre_service_role_key python3 import_tibhar_stiga.py
"""

import os, re, sys
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

# ─── Données ──────────────────────────────────────────────────────────────────

BOIS = [

    # ══════════════════════════════════════════════════════════════════════
    # TIBHAR
    # ══════════════════════════════════════════════════════════════════════

    # ── Gamme Samsonov ────────────────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Samsonov Force Pro",
        "nb_plis": 5,
        "poids_g": 85,
        "epaisseur_mm": 5.7,
        "style": "ALL+",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Kiri-Ayous-Kiri-Ayous-Kiri (5 plis bois)",
        "pli1": "Kiri", "pli2": "Ayous", "pli3": "Kiri", "pli4": "Ayous", "pli5": "Kiri",
    },
    {
        "marque": "Tibhar",
        "nom": "Samsonov Force Pro Black Edition",
        "nb_plis": 5,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF-",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "5 plis bois — version plus légère du Force Pro avec teinte noire sur le manche",
        "pli1": "Kiri", "pli2": "Ayous", "pli3": "Kiri", "pli4": "Ayous", "pli5": "Kiri",
    },
    {
        "marque": "Tibhar",
        "nom": "Samsonov Alpha",
        "nb_plis": 5,
        "poids_g": 86,
        "epaisseur_mm": 5.8,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois — extérieur Limba, core Ayous, version plus rigide du Force Pro",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Samsonov Alpha SGS",
        "nb_plis": 5,
        "poids_g": 80,
        "epaisseur_mm": 5.5,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois — version allégée du Samsonov Alpha (SGS = Special Grip System)",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },

    # ── Gamme Stratus ─────────────────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Stratus Power Wood",
        "nb_plis": 5,
        "poids_g": 87,
        "epaisseur_mm": 5.8,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "5 plis bois tout-bois pour jeu offensif polyvalent. Flexibilité maximale.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Stratus Power Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "Limba-Carbone-Ayous-Kiri-Ayous-Carbone-Limba",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Stratus Samsonov Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "Limba-Kevlar Carbon-Ayous-Kiri-Ayous-Kevlar Carbon-Limba. Signature Vladimir Samsonov.",
        "pli1": "Limba", "pli2": "Kevlar Carbon", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Kevlar Carbon", "pli7": "Limba",
    },

    # ── Gamme IV (Inner Fiber) ─────────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "IV-S",
        "nb_plis": 7,
        "poids_g": 87,
        "epaisseur_mm": 5.9,
        "style": "ALL+",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Limba-Ayous-Fibre inner-Ayous-Fibre inner-Ayous-Limba. Inner fiber pour sensation bois avec plus de vitesse.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Fibre",
        "pli4": "Ayous", "pli5": "Fibre", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "IV-L",
        "nb_plis": 7,
        "poids_g": 83,
        "epaisseur_mm": 5.7,
        "style": "ALL",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Version légère du IV-S. Fibre intérieure pour contrôle accru.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Fibre",
        "pli4": "Ayous", "pli5": "Fibre", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── Signatures joueurs ────────────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Dang Qiu",
        "nb_plis": 7,
        "poids_g": 84,
        "epaisseur_mm": 5.6,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Bois signature de Qiu Dang (Allemagne). Inner carbon, équilibre vitesse/contrôle.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Carbone",
        "pli4": "Kiri", "pli5": "Carbone", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "Szocs",
        "nb_plis": 5,
        "poids_g": 80,
        "epaisseur_mm": 5.5,
        "style": "ALL+",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Bois signature de Bernadette Szocs (Roumanie). 5 plis tout-bois, léger et maniable.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Tibhar",
        "nom": "MK",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 7,
        "composition": "7 plis avec fibres carbone. Bois Tibhar gamme MK, jeu offensif explosif.",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },

    # ── Gamme Kratos ──────────────────────────────────────────────────────
    {
        "marque": "Tibhar",
        "nom": "Kratos",
        "nb_plis": 7,
        "poids_g": 87,
        "epaisseur_mm": 6.0,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Hinoki-Carbone-Kiri-Hinoki-Kiri-Carbone-Hinoki. Association Hinoki + carbone pour puissance et sensations.",
        "pli1": "Hinoki", "pli2": "Carbone", "pli3": "Kiri",
        "pli4": "Hinoki", "pli5": "Kiri", "pli6": "Carbone", "pli7": "Hinoki",
    },


    # ══════════════════════════════════════════════════════════════════════
    # STIGA — bois principaux
    # ══════════════════════════════════════════════════════════════════════

    # ── Série Carbonado (TeXtreme®) ───────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Carbonado 45",
        "nb_plis": 7,
        "poids_g": 78,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Limba-TeXtreme® 45°-Ayous-Ayous-Ayous-TeXtreme® 45°-Limba. TeXtreme® à 45° pour le toucher.",
        "pli1": "Limba", "pli2": "TeXtreme® 45°", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme® 45°", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Carbonado 90",
        "nb_plis": 7,
        "poids_g": 78,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 8,
        "composition": "Limba-TeXtreme® 90°-Ayous-Ayous-Ayous-TeXtreme® 90°-Limba. TeXtreme® à 90° pour la vitesse.",
        "pli1": "Limba", "pli2": "TeXtreme® 90°", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme® 90°", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Carbonado 145",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba. Version équilibrée et populaire.",
        "pli1": "Limba", "pli2": "TeXtreme®", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme®", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Carbonado 190",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba. TeXtreme® tissu plus fin = plus de contrôle.",
        "pli1": "Limba", "pli2": "TeXtreme®", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme®", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Carbonado 245",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 5.9,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 9,
        "composition": "Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba. Plus épais et plus lourd = puissance maximale.",
        "pli1": "Limba", "pli2": "TeXtreme®", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme®", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Carbonado 290",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 5.9,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba. Version la plus contrôlée des 245/290.",
        "pli1": "Limba", "pli2": "TeXtreme®", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "TeXtreme®", "pli7": "Limba",
    },

    # ── Cybershape ────────────────────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Cybershape Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Forme trapézoïdale unique. 5 bois + 2 Carbone. Agrandit la sweet zone.",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Cybershape Carbon CWT",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.9,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 9,
        "composition": "Cybershape avec technologie CWT (Counter Weight Technology). Équilibre parfait.",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Cybershape Carbon CWT Truls Edition",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.9,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Edition Truls Möregård. Cybershape CWT personnalisé selon les préférences du joueur suédois.",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Cybershape Wood",
        "nb_plis": 5,
        "poids_g": 82,
        "epaisseur_mm": 5.7,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Forme trapézoïdale Cybershape en tout-bois. Plus doux et maniable que la version carbone.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },

    # ── Dynasty & Legacy ──────────────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Dynasty Carbon",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-Carbone-Ayous-Ayous-Ayous-Carbone-Limba. Grand classique Stiga.",
        "pli1": "Limba", "pli2": "Carbone", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Carbone", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Legacy Carbon 12k",
        "nb_plis": 7,
        "poids_g": 89,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 8,
        "composition": "Limba-Energy Carbon 12k-Pin-Ayous-Pin-Energy Carbon 12k-Limba. Carbone haute densité 12k pour puissance maximale.",
        "pli1": "Limba", "pli2": "Energy Carbon 12k", "pli3": "Pin",
        "pli4": "Ayous", "pli5": "Pin", "pli6": "Energy Carbon 12k", "pli7": "Limba",
    },

    # ── Inspira ───────────────────────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Inspira CCF",
        "nb_plis": 7,
        "poids_g": 87,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Carbon Control Fiber inner. Excellent équilibre pour le jeu offensif moderne.",
        "pli1": "Ayous", "pli2": "Ayous", "pli3": "CCF",
        "pli4": "Ayous", "pli5": "CCF", "pli6": "Ayous", "pli7": "Ayous",
    },
    {
        "marque": "Stiga",
        "nom": "Inspira Hybrid Carbon",
        "nb_plis": 7,
        "poids_g": 87,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Hybrid Carbon inner — mix carbone et fibres naturelles pour contrôle accru.",
    },
    {
        "marque": "Stiga",
        "nom": "Inspira Plus",
        "nb_plis": 7,
        "poids_g": 86,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Évolution de l'Inspira, couche outer plus rigide pour plus de puissance.",
    },

    # ── Intensity & Clipper ───────────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Intensity NCT",
        "nb_plis": 7,
        "poids_g": 90,
        "epaisseur_mm": 6.1,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "7 plis tout-bois épais. Sensation directe et puissance sans carbone.",
        "pli1": "Aniégré", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Aniégré",
    },
    {
        "marque": "Stiga",
        "nom": "Clipper WRB",
        "nb_plis": 7,
        "poids_g": 89,
        "epaisseur_mm": 5.9,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-Ayous-Ayous-Ayous-Ayous-Ayous-Limba. WRB = Wood Recovery Body. Grand classique Stiga.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Clipper Classic",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 6.0,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limba-Ayous-Ayous-Ayous-Ayous-Ayous-Limba. Version classique du Clipper légendaire.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Clipper CR",
        "nb_plis": 7,
        "poids_g": 97,
        "epaisseur_mm": 6.2,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Limbа-Ayous-Ayous-Ayous-Ayous-Ayous-Limba. CR = Concave-Round grip. Version lourde.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── VPS series (bois nobles) ──────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Eternity VPS V",
        "nb_plis": 5,
        "poids_g": 86,
        "epaisseur_mm": 5.8,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "5 plis tout-bois. VPS = Vibration Peripheral System. Bois extérieur spécial pour feeling amélioré.",
        "pli1": "Aniégré", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Aniégré",
    },
    {
        "marque": "Stiga",
        "nom": "Emerald VPS V",
        "nb_plis": 5,
        "poids_g": 85,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "5 plis, bois extérieur précieux. VPS pour vibration optimisée.",
        "pli1": "Aniégré", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Aniégré",
    },
    {
        "marque": "Stiga",
        "nom": "Infinity VPS V Diamond Touch",
        "nb_plis": 5,
        "poids_g": 85,
        "epaisseur_mm": 5.6,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "5 plis tout-bois avec traitement Diamond Touch sur la surface. Grip amélioré.",
    },

    # ── Bois exotiques (Ebenholz, Rosewood) ──────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Ebenholz NCT V",
        "nb_plis": 5,
        "poids_g": 92,
        "epaisseur_mm": 5.5,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Ebène-Epicéa-Ayous-Epicéa-Ebène. Bois d'ébène extérieur, très dense et rapide.",
        "pli1": "Ebène", "pli2": "Epicéa", "pli3": "Ayous", "pli4": "Epicéa", "pli5": "Ebène",
    },
    {
        "marque": "Stiga",
        "nom": "Ebenholz NCT VII",
        "nb_plis": 7,
        "poids_g": 96,
        "epaisseur_mm": 6.1,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Ebène-Ayous-Ayous-Ayous-Ayous-Ayous-Ebène. Version 7 plis. Très lourd, très rapide.",
        "pli1": "Ebène", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Ebène",
    },
    {
        "marque": "Stiga",
        "nom": "Rosewood NCT V",
        "nb_plis": 5,
        "poids_g": 88,
        "epaisseur_mm": 5.5,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Palissandre-Ayous-Ayous-Ayous-Palissandre. Bois de palissandre extérieur, sensation unique.",
        "pli1": "Palissandre", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Palissandre",
    },
    {
        "marque": "Stiga",
        "nom": "Rosewood NCT VII",
        "nb_plis": 7,
        "poids_g": 97,
        "epaisseur_mm": 6.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Palissandre-Ayous-Ayous-Ayous-Ayous-Ayous-Palissandre. Version 7 plis, très lourd.",
        "pli1": "Palissandre", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Palissandre",
    },
    {
        "marque": "Stiga",
        "nom": "Maplewood NCT V",
        "nb_plis": 5,
        "poids_g": 88,
        "epaisseur_mm": 5.6,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Érable-Ayous-Ayous-Ayous-Érable. Bois d'érable extérieur, bonne sensation.",
        "pli1": "Érable", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Érable",
    },
    {
        "marque": "Stiga",
        "nom": "Maplewood NCT VII",
        "nb_plis": 7,
        "poids_g": 90,
        "epaisseur_mm": 6.0,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "Érable-Ayous-Ayous-Ayous-Ayous-Ayous-Érable. Version 7 plis.",
        "pli1": "Érable", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Érable",
    },

    # ── Classiques polyvalents ────────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Allround Classic",
        "nb_plis": 5,
        "poids_g": 82,
        "epaisseur_mm": 5.6,
        "style": "ALL",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "Limba-Ayous-Ayous-Ayous-Limba. Le classique suédois par excellence, référence tout-public.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Allround Evolution",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "ALL+",
        "note_vitesse": 7,
        "note_controle": 9,
        "composition": "Limba-Ayous-Ayous-Ayous-Ayous-Ayous-Limba. Version évoluée, 7 plis pour plus de vitesse.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Ayous", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Allround NCT",
        "nb_plis": 5,
        "poids_g": 84,
        "epaisseur_mm": 5.7,
        "style": "ALL",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "5 plis NCT (Nano Composite Technology). Amélioration du classique Allround.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Offensive Classic",
        "nb_plis": 5,
        "poids_g": 82,
        "epaisseur_mm": 5.7,
        "style": "OFF-",
        "note_vitesse": 8,
        "note_controle": 8,
        "composition": "Limba-Ayous-Ayous-Ayous-Limba. Version offensive de l'Allround Classic.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Defensive Classic",
        "nb_plis": 5,
        "poids_g": 75,
        "epaisseur_mm": 5.2,
        "style": "DEF",
        "note_vitesse": 6,
        "note_controle": 10,
        "composition": "5 plis légers. Conçu pour le jeu défensif, parfait contrôle.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Limba",
    },

    # ── Pure, Titanium, Hybrid Wood ───────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Pure",
        "nb_plis": 5,
        "poids_g": 82,
        "epaisseur_mm": 5.6,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "5 plis tout-bois. Conçu pour offrir une sensation pure, sans artifice.",
        "pli1": "Ayous", "pli2": "Ayous", "pli3": "Ayous", "pli4": "Ayous", "pli5": "Ayous",
    },
    {
        "marque": "Stiga",
        "nom": "Pure Cybershape",
        "nb_plis": 5,
        "poids_g": 80,
        "epaisseur_mm": 5.5,
        "style": "OFF",
        "note_vitesse": 8,
        "note_controle": 9,
        "composition": "Pure en forme trapézoïdale Cybershape. Sweet zone agrandie.",
    },
    {
        "marque": "Stiga",
        "nom": "Titanium",
        "nb_plis": 7,
        "poids_g": 89,
        "epaisseur_mm": 5.8,
        "style": "OFF",
        "note_vitesse": 9,
        "note_controle": 8,
        "composition": "7 plis avec couche de Titanium inner. Rigidité et vitesse accrues.",
    },
    {
        "marque": "Stiga",
        "nom": "Hybrid Wood NCT",
        "nb_plis": 7,
        "poids_g": 88,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 10,
        "note_controle": 9,
        "composition": "7 plis avec NCT. Bois hybride haute performance.",
    },

    # ── Signature Truls Möregård ──────────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Truls Möregård Carbon",
        "nb_plis": 7,
        "poids_g": 84,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Bois signature du champion du monde Truls Möregård (Suède). Inner carbon, léger et explosif.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Carbone",
        "pli4": "Kiri", "pli5": "Carbone", "pli6": "Ayous", "pli7": "Limba",
    },

    # ── Destiny & Aura (nouveautés) ───────────────────────────────────────
    {
        "marque": "Stiga",
        "nom": "Destiny Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.7,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Nouveauté Stiga. Carbon inner pour jeu offensif moderne.",
        "pli1": "Limba", "pli2": "Ayous", "pli3": "Carbone",
        "pli4": "Kiri", "pli5": "Carbone", "pli6": "Ayous", "pli7": "Limba",
    },
    {
        "marque": "Stiga",
        "nom": "Aura Hybrid Carbon",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Nouveauté 2024/2025. Hybrid Carbon outer pour une puissance sans compromis.",
        "pli1": "Hybrid Carbon", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Hybrid Carbon",
    },
    {
        "marque": "Stiga",
        "nom": "Aura Hybrid Carbon Cybershape",
        "nb_plis": 7,
        "poids_g": 85,
        "epaisseur_mm": 5.8,
        "style": "OFF+",
        "note_vitesse": 9,
        "note_controle": 9,
        "composition": "Aura Hybrid Carbon en format Cybershape. Forme trapézoïdale + Hybrid Carbon outer.",
        "pli1": "Hybrid Carbon", "pli2": "Ayous", "pli3": "Ayous",
        "pli4": "Kiri", "pli5": "Ayous", "pli6": "Ayous", "pli7": "Hybrid Carbon",
    },
]

# ─── Utilitaires ──────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àáâãä]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[îï]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ùûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[®™°]", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis")
        print("   export SUPABASE_URL=https://xxxx.supabase.co")
        print("   export SUPABASE_KEY=votre_service_role_key")
        sys.exit(1)

    sb: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Charger les slugs existants (pour éviter doublons)
    existing_slugs: set = set()
    page = 0
    while True:
        res = sb.table("produits").select("slug").range(page * 1000, (page + 1) * 1000 - 1).execute()
        if not res.data:
            break
        for r in res.data:
            existing_slugs.add(r["slug"])
        if len(res.data) < 1000:
            break
        page += 1
    print(f"📋 {len(existing_slugs)} produits existants chargés")

    # Charger les marques existantes
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map = {m["nom"].lower(): m["id"] for m in marques_res.data}
    print(f"📋 {len(marques_map)} marques : {[m['nom'] for m in marques_res.data]}")

    inserted = 0
    skipped = 0
    errors = []

    tibhar_count = sum(1 for b in BOIS if b["marque"] == "Tibhar")
    stiga_count  = sum(1 for b in BOIS if b["marque"] == "Stiga")
    print(f"\n🚀 Import de {len(BOIS)} bois ({tibhar_count} Tibhar, {stiga_count} Stiga)")
    print("=" * 60)

    for bois in BOIS:
        marque_nom = bois["marque"]
        nom = bois["nom"]
        slug = slugify(f"{marque_nom}-{nom}")

        # Récupérer / créer la marque
        marque_id = marques_map.get(marque_nom.lower())
        if not marque_id:
            try:
                res = sb.table("marques").insert({"nom": marque_nom}).execute()
                marque_id = res.data[0]["id"]
                marques_map[marque_nom.lower()] = marque_id
                print(f"  ➕ Marque créée : {marque_nom}")
            except Exception as e:
                errors.append(f"Marque '{marque_nom}' : {e}")
                continue

        try:
            # Upsert dans produits (gère les doublons de slug proprement)
            produit_res = sb.table("produits").upsert({
                "nom": nom,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }, on_conflict="slug").execute()
            produit_id = produit_res.data[0]["id"]

            # Vérifier si une entrée bois existe déjà pour ce produit
            existing_bois = sb.table("bois").select("id").eq("produit_id", produit_id).execute()

            # Construire le payload bois
            bois_payload: dict = {"produit_id": produit_id}
            for field in [
                "nb_plis", "poids_g", "epaisseur_mm", "style", "composition",
                "note_vitesse", "note_controle", "note_flexibilite", "note_durete", "note_qualite_prix",
                "pli1", "pli2", "pli3", "pli4", "pli5", "pli6", "pli7",
            ]:
                if field in bois:
                    bois_payload[field] = bois[field]

            if existing_bois.data:
                # Mettre à jour les specs si l'entrée bois existe déjà
                sb.table("bois").update(bois_payload).eq("produit_id", produit_id).execute()
                print(f"  🔄 Mis à jour  : {marque_nom} {nom}")
                skipped += 1
            else:
                sb.table("bois").insert(bois_payload).execute()
                inserted += 1
                print(f"  ✅ Inséré      : {marque_nom} {nom}")

        except Exception as e:
            errors.append(f"{nom} : {e}")
            print(f"  ❌ {nom} : {e}")

    print("\n" + "=" * 60)
    print(f"✅ Insérés   : {inserted}")
    print(f"⏭️  Ignorés   : {skipped} (déjà présents)")
    print(f"❌ Erreurs   : {len(errors)}")
    if errors:
        print("\nDétail des erreurs :")
        for e in errors:
            print(f"  • {e}")

if __name__ == "__main__":
    main()
