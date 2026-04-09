"""
import_bois.py — Import en masse des bois dans Supabase pour TT-Kip
=====================================================================
Prérequis :
    pip install supabase python-dotenv

Variables d'environnement (.env ou export) :
    SUPABASE_URL=https://xxxx.supabase.co
    SUPABASE_KEY=your_service_role_key   ← clé "service_role", pas "anon"

Lancement :
    python import_bois.py

Le script :
  1. Lit le CSV BOIS.csv
  2. Récupère les marques existantes dans Supabase (ou les crée)
  3. Insère chaque bois dans `produits` puis `bois`
  4. Skip les bois déjà présents (par slug)
  5. Affiche un résumé final
"""

import os
import re
import csv
import sys
from typing import Optional, Dict, Set
from supabase import create_client, Client

# ─── CONFIG ──────────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")  # service_role key

CSV_FILE = "BOIS.csv"   # chemin vers le fichier CSV

# ─── ENRICHISSEMENT : specs connues par modèle ────────────────────────────────
# Clé = nom exact comme dans le CSV (sans la marque, en minuscules strip)
# Valeur = dict avec les champs bois

ENRICHISSEMENT: dict = {

    # ── STIGA ──────────────────────────────────────────────────────────────
    "active":                   {"nb_plis": 5, "poids_g": 85, "style": "ALL"},
    "allround classic":         {"nb_plis": 5, "poids_g": 82, "style": "ALL",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Limba"},
    "allround evolution":       {"nb_plis": 7, "poids_g": 85, "style": "ALL+"},
    "allround nct":             {"nb_plis": 5, "poids_g": 84, "style": "ALL"},
    "clipper":                  {"nb_plis": 7, "poids_g": 90, "style": "OFF",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Limba"},
    "clipper cr":               {"nb_plis": 7, "poids_g": 97, "style": "OFF",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Limba"},
    "clipper classic":          {"nb_plis": 7, "poids_g": 88, "style": "OFF"},
    "clipper wrb":              {"nb_plis": 7, "poids_g": 88, "style": "OFF"},
    "carbonado 45":             {"nb_plis": 7, "poids_g": 78, "style": "OFF+", "epaisseur_mm": 5.7,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "carbonado 90":             {"nb_plis": 7, "poids_g": 78, "style": "OFF+", "epaisseur_mm": 5.7,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "carbonado 145":            {"nb_plis": 7, "poids_g": 86, "style": "OFF+", "epaisseur_mm": 5.7,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "carbonado 190":            {"nb_plis": 7, "poids_g": 86, "style": "OFF+", "epaisseur_mm": 5.7,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "carbonado 245":            {"nb_plis": 7, "poids_g": 88, "style": "OFF+", "epaisseur_mm": 5.9,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "carbonado 290":            {"nb_plis": 7, "poids_g": 88, "style": "OFF+", "epaisseur_mm": 5.9,
                                 "pli1":"Limba","pli2":"TeXtreme®","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"TeXtreme®","pli7":"Limba",
                                 "composition":"Limba-TeXtreme®-Ayous-Ayous-Ayous-TeXtreme®-Limba"},
    "ebenholz nct v":           {"nb_plis": 5, "poids_g": 92, "style": "OFF",
                                 "pli1":"Ebène","pli2":"Epicéa","pli3":"Ayous","pli4":"Epicéa","pli5":"Ebène",
                                 "composition":"Ebène-Epicéa-Ayous-Epicéa-Ebène"},
    "ebenholz nct vii":         {"nb_plis": 7, "poids_g": 96, "style": "OFF+", "epaisseur_mm": 6.1,
                                 "pli1":"Ebène","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Ebène",
                                 "composition":"Ebène-Ayous-Ayous-Ayous-Ayous-Ayous-Ebène"},
    "rosewood nct v":           {"nb_plis": 5, "poids_g": 88, "style": "OFF",
                                 "pli1":"Palissandre","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Palissandre",
                                 "composition":"Palissandre-Ayous-Ayous-Ayous-Palissandre"},
    "rosewood nct vii":         {"nb_plis": 7, "poids_g": 97, "style": "OFF+", "epaisseur_mm": 6.8,
                                 "pli1":"Palissandre","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Palissandre",
                                 "composition":"Palissandre-Ayous-Ayous-Ayous-Ayous-Ayous-Palissandre"},
    "rosewood xo":              {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "dynasty carbon":           {"nb_plis": 7, "poids_g": 88, "style": "OFF+",
                                 "pli1":"Limba","pli2":"Carbone","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Carbone","pli7":"Limba"},
    "legacy carbon 12k":        {"nb_plis": 7, "poids_g": 89, "style": "OFF+",
                                 "pli1":"Limba","pli2":"Energy Carbon 12k","pli3":"Pin","pli4":"Ayous","pli5":"Pin","pli6":"Energy Carbon 12k","pli7":"Limba",
                                 "composition":"Limba-Energy Carbon 12k-Pin-Ayous-Pin-Energy Carbon 12k-Limba"},
    "maplewood nct v":          {"nb_plis": 5, "poids_g": 88, "style": "OFF"},
    "maplewood nct vii":        {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "intensity nct":            {"nb_plis": 7, "poids_g": 90, "style": "OFF"},
    "cybershape carbon":        {"nb_plis": 7, "poids_g": 85, "style": "OFF+"},
    "defensive classic":        {"nb_plis": 5, "poids_g": 75, "style": "DEF"},
    "defensive nct":            {"nb_plis": 5, "poids_g": 76, "style": "DEF"},
    "offensive classic (oc)":   {"nb_plis": 5, "poids_g": 82, "style": "OFF-",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Limba"},
    "emerald vps v":            {"nb_plis": 5, "poids_g": 85, "style": "OFF+"},
    "eternity vps v":           {"nb_plis": 5, "poids_g": 86, "style": "OFF"},

    # ── BUTTERFLY ──────────────────────────────────────────────────────────
    "viscaria":                 {"nb_plis": 7, "poids_g": 89, "style": "OFF+",
                                 "pli1":"Koto","pli2":"SALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"SALC","pli7":"Koto",
                                 "composition":"Koto-SALC-Limba-Kiri-Limba-SALC-Koto"},
    "viscaria super alc":       {"nb_plis": 7, "poids_g": 89, "style": "OFF+",
                                 "pli1":"Koto","pli2":"SALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"SALC","pli7":"Koto",
                                 "composition":"Koto-SALC-Limba-Kiri-Limba-SALC-Koto"},
    "timo boll alc":            {"nb_plis": 7, "poids_g": 84, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ALC","pli7":"Koto",
                                 "composition":"Koto-ALC-Limba-Kiri-Limba-ALC-Koto"},
    "timo boll spirit":         {"nb_plis": 7, "poids_g": 89, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ALC","pli7":"Koto",
                                 "composition":"Koto-ALC-Limba-Kiri-Limba-ALC-Koto"},
    "timo boll zlc":            {"nb_plis": 7, "poids_g": 85, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ZLC","pli7":"Koto",
                                 "composition":"Koto-ZLC-Limba-Kiri-Limba-ZLC-Koto"},
    "timo boll zlf":            {"nb_plis": 7, "poids_g": 83, "style": "OFF",
                                 "pli1":"Koto","pli2":"ZLF","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ZLF","pli7":"Koto"},
    "timo boll w7":             {"nb_plis": 7, "poids_g": 94, "style": "OFF",
                                 "pli1":"Koto","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Koto"},
    "zhang jike alc":           {"nb_plis": 7, "poids_g": 87, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ALC","pli7":"Koto",
                                 "composition":"Koto-ALC-Limba-Kiri-Limba-ALC-Koto"},
    "zhang jike zlc":           {"nb_plis": 7, "poids_g": 86, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ZLC","pli7":"Koto"},
    "zhang jike super zlc":     {"nb_plis": 7, "poids_g": 90, "style": "OFF+",
                                 "pli1":"Koto","pli2":"SZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"SZLC","pli7":"Koto"},
    "fan zhendong alc":         {"nb_plis": 7, "poids_g": 87, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ALC","pli7":"Koto"},
    "fan zhendong zlc":         {"nb_plis": 7, "poids_g": 86, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ZLC","pli7":"Koto"},
    "fan zhendong super zlc":   {"nb_plis": 7, "poids_g": 90, "style": "OFF+",
                                 "pli1":"Koto","pli2":"SZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"SZLC","pli7":"Koto"},
    "innerforce layer alc":     {"nb_plis": 7, "poids_g": 90, "style": "OFF",
                                 "pli1":"Limba","pli2":"Limba","pli3":"ALC","pli4":"Ayous","pli5":"ALC","pli6":"Limba","pli7":"Limba",
                                 "composition":"Limba-Limba-ALC-Ayous-ALC-Limba-Limba"},
    "innerforce layer zlc":     {"nb_plis": 7, "poids_g": 85, "style": "OFF",
                                 "pli1":"Limba","pli2":"Limba","pli3":"ZLC","pli4":"Ayous","pli5":"ZLC","pli6":"Limba","pli7":"Limba"},
    "harimoto tomokazu innerforce alc": {"nb_plis": 7, "poids_g": 88, "style": "OFF",
                                 "pli1":"Limba","pli2":"Limba","pli3":"ALC","pli4":"Ayous","pli5":"ALC","pli6":"Limba","pli7":"Limba"},
    "primorac":                 {"nb_plis": 5, "poids_g": 89, "style": "OFF-",
                                 "pli1":"Hinoki","pli2":"T5000","pli3":"Kiri","pli4":"T5000","pli5":"Hinoki"},
    "primorac carbon":          {"nb_plis": 5, "poids_g": 89, "style": "OFF",
                                 "pli1":"Hinoki","pli2":"T5000","pli3":"Kiri","pli4":"T5000","pli5":"Hinoki"},
    "sk7 classic":              {"nb_plis": 7, "poids_g": 90, "style": "OFF",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Ayous","pli6":"Ayous","pli7":"Limba"},
    "sk carbon":                {"nb_plis": 5, "poids_g": 79, "style": "OFF+",
                                 "pli1":"Koto","pli2":"T5000","pli3":"Kiri","pli4":"T5000","pli5":"Koto"},
    "sardius":                  {"nb_plis": 5, "poids_g": 92, "style": "OFF+",
                                 "pli1":"Hinoki","pli2":"T5000","pli3":"Kiri","pli4":"T5000","pli5":"Hinoki"},
    "schlager carbon":          {"nb_plis": 5, "poids_g": 93, "style": "OFF+",
                                 "pli1":"Cyprès","pli2":"T5000","pli3":"Kiri","pli4":"T5000","pli5":"Cyprès"},
    "lin gaoyuan alc":          {"nb_plis": 7, "poids_g": 87, "style": "OFF+",
                                 "pli1":"Koto","pli2":"ALC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"ALC","pli7":"Koto"},
    "lin yun-ju super zlc":     {"nb_plis": 7, "poids_g": 87, "style": "OFF+",
                                 "pli1":"Koto","pli2":"SZLC","pli3":"Limba","pli4":"Kiri","pli5":"Limba","pli6":"SZLC","pli7":"Koto"},
    "apolonia zlc":             {"nb_plis": 7, "poids_g": 90, "style": "OFF+",
                                 "pli1":"Limba","pli2":"Limba","pli3":"ZLC","pli4":"Ayous","pli5":"ZLC","pli6":"Limba","pli7":"Limba"},
    "garaydia alc":             {"nb_plis": 5, "poids_g": 85, "style": "OFF+",
                                 "pli1":"Hinoki","pli2":"ALC","pli3":"Kiri","pli4":"ALC","pli5":"Hinoki"},
    "korbel speed":             {"nb_plis": 5, "poids_g": 89, "style": "OFF",
                                 "pli1":"Koto","pli2":"Limba","pli3":"Ayous","pli4":"Limba","pli5":"Koto"},
    "supreme speed":            {"nb_plis": 5, "poids_g": 80, "style": "OFF+",
                                 "pli1":"Hinoki","pli2":"ALC","pli3":"Kiri","pli4":"ALC","pli5":"Hinoki"},
    "amultart":                 {"nb_plis": 5, "poids_g": 86, "style": "OFF+",
                                 "pli1":"Hinoki","pli2":"ZLC","pli3":"Kiri","pli4":"ZLC","pli5":"Hinoki"},
    "iolite":                   {"nb_plis": 5, "poids_g": 80, "style": "OFF+",
                                 "pli1":"Hinoki","pli2":"ALC","pli3":"Kiri","pli4":"ALC","pli5":"Hinoki"},
    "ovtcharov innerforce alc": {"nb_plis": 7, "poids_g": 91, "style": "OFF",
                                 "pli1":"Limba","pli2":"Limba","pli3":"ALC","pli4":"Ayous","pli5":"ALC","pli6":"Limba","pli7":"Limba"},

    # ── CORNILLEAU ─────────────────────────────────────────────────────────
    "aero all":                 {"nb_plis": 5, "poids_g": 70, "style": "ALL",
                                 "pli1":"Fineline","pli2":"Ayous","pli3":"Kiri","pli4":"Ayous","pli5":"Fineline"},
    "aero off":                 {"nb_plis": 5, "poids_g": 75, "style": "OFF",
                                 "pli1":"Fineline","pli2":"Ayous","pli3":"Kiri","pli4":"Ayous","pli5":"Fineline"},
    "aero off+ soft carbon":    {"nb_plis": 5, "poids_g": 75, "style": "OFF+",
                                 "pli1":"Fineline","pli2":"Carbone","pli3":"Kiri","pli4":"Carbone","pli5":"Fineline"},
    "gatien absolum off+":      {"nb_plis": 7, "poids_g": 95, "style": "OFF+",
                                 "pli1":"Ebène","pli2":"Limba","pli3":"Ayous","pli4":"Samba rouge","pli5":"Ayous","pli6":"Limba","pli7":"Ebène"},
    "gatien crown all+":        {"nb_plis": 5, "poids_g": 85, "style": "ALL+",
                                 "pli1":"Aniégré","pli2":"Noyer","pli3":"Ayous","pli4":"Noyer","pli5":"Aniégré"},
    "gauzy quest off":          {"nb_plis": 5, "poids_g": 85, "style": "OFF",
                                 "pli1":"Ovengkol","pli2":"Ayous","pli3":"Kiri","pli4":"Ayous","pli5":"Ovengkol"},
    "hinotec all+":             {"nb_plis": 5, "poids_g": 85, "style": "ALL+",
                                 "pli1":"Hinoki","pli2":"Limba","pli3":"Ayous","pli4":"Limba","pli5":"Hinoki"},
    "hinotec off":              {"nb_plis": 5, "poids_g": 85, "style": "OFF",
                                 "pli1":"Hinoki","pli2":"Limba","pli3":"Kiri","pli4":"Limba","pli5":"Hinoki"},
    "calderano foco off+":      {"nb_plis": 5, "poids_g": 85, "style": "OFF+",
                                 "pli1":"Fineline","pli2":"Ayous","pli3":"Kiri","pli4":"Ayous","pli5":"Fineline"},

    # ── DHS ────────────────────────────────────────────────────────────────
    "hurricane long 5":         {"nb_plis": 7, "poids_g": 90, "style": "OFF+",
                                 "pli1":"Koto","pli2":"Carbone","pli3":"Ayous","pli4":"Kiri","pli5":"Ayous","pli6":"Carbone","pli7":"Koto"},
    "hurricane long 5x":        {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "hurricane long 3":         {"nb_plis": 7, "poids_g": 90, "style": "OFF"},
    "hurricane long 2":         {"nb_plis": 7, "poids_g": 88, "style": "OFF"},
    "hurricane long":           {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "hurricane king":           {"nb_plis": 7, "poids_g": 88, "style": "OFF"},
    "hurricane king iii":       {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "fang bo carbon":           {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "hurricane hao iii":        {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "hurricane 301":            {"nb_plis": 7, "poids_g": 88, "style": "OFF+"},

    # ── TSP / VICTAS ────────────────────────────────────────────────────────
    "swat":                     {"nb_plis": 5, "poids_g": 87, "style": "OFF-",
                                 "pli1":"Limba","pli2":"Ayous","pli3":"Ayous","pli4":"Ayous","pli5":"Limba"},
    "swat carbon":              {"nb_plis": 7, "poids_g": 88, "style": "OFF+"},
    "swat power":               {"nb_plis": 5, "poids_g": 90, "style": "OFF"},
    "koji matsushita":          {"nb_plis": 5, "poids_g": 87, "style": "ALL+",
                                 "pli1":"Limba","pli2":"Epicéa","pli3":"Ayous","pli4":"Epicéa","pli5":"Limba"},
    "koki niwa wood":           {"nb_plis": 5, "poids_g": 88, "style": "OFF+"},
    "koki niwa":                {"nb_plis": 7, "poids_g": 90, "style": "OFF+"},
    "liam pitchford":           {"nb_plis": 7, "poids_g": 90, "style": "OFF+",
                                 "pli1":"Limba","pli2":"Zexion®","pli3":"Acajou","pli4":"Ayous","pli5":"Acajou","pli6":"Zexion®","pli7":"Limba"},
    "hino-carbon power":        {"nb_plis": 7, "poids_g": 88, "style": "OFF+"},
    "balsa 6.5 off":            {"nb_plis": 5, "poids_g": 75, "style": "OFF",
                                 "pli1":"Koto","pli2":"Carbone","pli3":"Balsa","pli4":"Carbone","pli5":"Koto"},

    # ── SAUER & TROGER ──────────────────────────────────────────────────────
    "firestart":                {"nb_plis": 5, "style": "OFF"},
    "unicorn":                  {"nb_plis": 5, "style": "ALL"},
    "black and white":          {"nb_plis": 5, "style": "DEF"},
    "zeus":                     {"nb_plis": 5, "style": "OFF+"},
}

# ─── UTILITAIRES ─────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:100]

def get_enrichissement(nom_sans_marque: str) -> dict:
    """Cherche dans le dict d'enrichissement, matching partiel tolérant."""
    key = nom_sans_marque.lower().strip()
    # Correspondance exacte
    if key in ENRICHISSEMENT:
        return ENRICHISSEMENT[key]
    # Correspondance partielle (le key commence par une clé connue)
    for k, v in ENRICHISSEMENT.items():
        if key == k or key.startswith(k + " ") or k.startswith(key + " "):
            return v
    return {}

def parse_speed_control(val: str) -> Optional[float]:
    try:
        v = float(val.strip())
        return round(v, 1)
    except (ValueError, AttributeError):
        return None

# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL et SUPABASE_KEY requis (variables d'environnement)")
        sys.exit(1)

    sb: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 1. Charger les marques existantes
    print("📋 Chargement des marques Supabase...")
    marques_res = sb.table("marques").select("id, nom").execute()
    marques_map: Dict[str, str] = {m["nom"].lower(): m["id"] for m in marques_res.data}
    print(f"   {len(marques_map)} marques trouvées : {list(marques_map.keys())}")

    # 2. Slugs déjà présents (évite les doublons)
    print("📋 Chargement des slugs existants...")
    existing_res = sb.table("produits").select("slug").execute()
    existing_slugs: Set[str] = {r["slug"] for r in existing_res.data}
    print(f"   {len(existing_slugs)} produits existants")

    # 3. Lire le CSV
    print(f"\n📄 Lecture de {CSV_FILE}...")
    rows = []
    for enc in ["latin-1", "utf-8-sig", "utf-8"]:
        try:
            tmp = []
            with open(CSV_FILE, encoding=enc) as f:
                reader = csv.reader(f, delimiter=";")
                next(reader)
                for line in reader:
                    if len(line) < 1 or not line[0].strip():
                        continue
                    name_raw = line[0].replace("\xa0", " ").replace("\u00a0", " ").replace("\u202f", " ").strip()
                    speed_raw = line[1].strip() if len(line) > 1 else "-"
                    control_raw = line[2].strip() if len(line) > 2 else "-"
                    tmp.append((name_raw, speed_raw, control_raw))
            rows = tmp
            print(f"   Encodage : {enc}")
            break
        except Exception:
            continue
    print(f"   {len(rows)} bois à traiter")

    # 4. Import
    inserted = 0
    skipped = 0
    no_marque = 0
    errors = []

    for name_raw, speed_raw, control_raw in rows:
        # Décomposer "Marque Nom"
        parts = name_raw.split(" ", 1)
        if len(parts) < 2:
            no_marque += 1
            continue

        marque_nom = parts[0].strip()
        nom_bois = parts[1].strip()

        # Chercher la marque dans Supabase
        marque_id = marques_map.get(marque_nom.lower())
        if not marque_id:
            # Essai avec correspondance partielle
            for k, v in marques_map.items():
                if marque_nom.lower() in k or k in marque_nom.lower():
                    marque_id = v
                    break
        if not marque_id:
            # Créer la marque automatiquement
            try:
                res = sb.table("marques").insert({"nom": marque_nom}).execute()
                if res.data:
                    new_id = res.data[0]["id"]
                    marques_map[marque_nom.lower()] = new_id
                    marque_id = new_id
                    print(f"   ➕ Marque créée : {marque_nom}")
            except Exception as e:
                no_marque += 1
                errors.append(f"Impossible de créer la marque {marque_nom}: {e}")
                continue
        if not marque_id:
            no_marque += 1
            continue

        # Slug
        slug = slugify(f"{marque_nom}-{nom_bois}")
        if slug in existing_slugs:
            skipped += 1
            continue

        # Données d'enrichissement
        enrichi = get_enrichissement(nom_bois)

        # Vitesse / contrôle → notes /10 (les valeurs CSV sont sur ~10)
        speed = parse_speed_control(speed_raw)
        control = parse_speed_control(control_raw)
        note_vitesse = round(speed) if speed else None
        note_controle = round(control) if control else None

        # Inférer style depuis vitesse si absent
        style = enrichi.get("style")
        if not style and speed:
            if speed >= 9.0:
                style = "OFF+"
            elif speed >= 8.0:
                style = "OFF"
            elif speed >= 7.0:
                style = "ALL+"
            elif speed >= 5.5:
                style = "ALL"
            else:
                style = "DEF"

        try:
            # Insérer dans produits
            prod_res = sb.table("produits").insert({
                "nom": nom_bois,
                "slug": slug,
                "marque_id": marque_id,
                "actif": True,
            }).execute()

            if not prod_res.data:
                errors.append(f"Echec insert produit : {nom_bois}")
                continue

            produit_id = prod_res.data[0]["id"]
            existing_slugs.add(slug)

            # Construire la ligne bois
            bois_row: dict = {
                "produit_id": produit_id,
                "style": style,
                "note_vitesse": note_vitesse,
                "note_controle": note_controle,
            }
            for field in ["nb_plis", "poids_g", "epaisseur_mm", "composition",
                          "pli1", "pli2", "pli3", "pli4", "pli5", "pli6", "pli7", "prix"]:
                if field in enrichi:
                    bois_row[field] = enrichi[field]

            sb.table("bois").insert(bois_row).execute()
            inserted += 1

            if inserted % 50 == 0:
                print(f"   ✅ {inserted} bois insérés...")

        except Exception as e:
            errors.append(f"Erreur '{nom_bois}' : {e}")

    # 5. Résumé
    print("\n" + "="*50)
    print(f"✅ Insérés      : {inserted}")
    print(f"⏭️  Déjà présents : {skipped}")
    print(f"⚠️  Marque non trouvée : {no_marque}")
    print(f"❌ Erreurs      : {len(errors)}")
    if errors:
        print("\nDétail des erreurs :")
        for e in errors[:20]:
            print(f"  - {e}")
        if len(errors) > 20:
            print(f"  ... et {len(errors)-20} autres")
    print("="*50)
    print("\n🎉 Import terminé !")


if __name__ == "__main__":
    main()
