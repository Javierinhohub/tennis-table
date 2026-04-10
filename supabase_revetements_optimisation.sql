-- ============================================================
-- OPTIMISATION TABLE REVETEMENTS — TT-KIP
-- À exécuter dans : Supabase > SQL Editor
-- Sources : Tibhar, Butterfly, Joola, Stiga, Dr Neubauer (2024/2025)
-- Notes normalisées sur /10 depuis les échelles officielles des marques
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PARTIE 1 — AJOUT DES COLONNES MANQUANTES
-- ════════════════════════════════════════════════════════════

-- Notes MARQUE (officielles des fabricants)
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_durabilite  NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_rejet        NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_qualite_prix NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_adherence    NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_gene         NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_inversion    NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_marque_globale      NUMERIC(3,1);

-- Notes TT-KIP (James TT-Kip uniquement — complément aux 3 existants)
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_durabilite      NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_durete          NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_rejet           NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_qualite_prix    NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_adherence       NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_gene            NUMERIC(3,1);
ALTER TABLE revetements ADD COLUMN IF NOT EXISTS note_ttk_inversion       NUMERIC(3,1);


-- ════════════════════════════════════════════════════════════
-- PARTIE 2 — FONCTION HELPER D'INJECTION DES NOTES MARQUE
-- Identifie le produit par correspondance approx. sur nom + marque
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_note_marque(
  p_nom      TEXT,
  p_marque   TEXT,
  p_vitesse  NUMERIC DEFAULT NULL,
  p_spin     NUMERIC DEFAULT NULL,
  p_controle NUMERIC DEFAULT NULL,
  p_durete   NUMERIC DEFAULT NULL,
  p_gene     NUMERIC DEFAULT NULL,
  p_inversion NUMERIC DEFAULT NULL,
  p_adherence NUMERIC DEFAULT NULL,
  p_globale  NUMERIC DEFAULT NULL,
  p_commentaire TEXT DEFAULT NULL
) RETURNS INT LANGUAGE plpgsql AS $$
DECLARE updated_count INT;
BEGIN
  UPDATE revetements r
  SET
    note_marque_vitesse    = COALESCE(p_vitesse,    note_marque_vitesse),
    note_marque_spin       = COALESCE(p_spin,       note_marque_spin),
    note_marque_controle   = COALESCE(p_controle,   note_marque_controle),
    note_marque_durete     = COALESCE(p_durete,     note_marque_durete),
    note_marque_gene       = COALESCE(p_gene,       note_marque_gene),
    note_marque_inversion  = COALESCE(p_inversion,  note_marque_inversion),
    note_marque_adherence  = COALESCE(p_adherence,  note_marque_adherence),
    note_marque_globale    = COALESCE(p_globale,    note_marque_globale),
    commentaire_marque     = COALESCE(p_commentaire, commentaire_marque)
  FROM produits p
  JOIN marques m ON p.marque_id = m.id
  WHERE r.produit_id = p.id
    AND LOWER(p.nom) ILIKE '%' || LOWER(p_nom) || '%'
    AND LOWER(m.nom) ILIKE '%' || LOWER(p_marque) || '%';
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;


-- ════════════════════════════════════════════════════════════
-- PARTIE 3 — INJECTION DES NOTES OFFICIELLES DES MARQUES
-- Normalisées sur /10 depuis les catalogues officiels 2024/2025
-- V=Vitesse  S=Spin  C=Contrôle  H=Dureté  G=Gêne  I=Inversion
-- ════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────────
-- TIBHAR — Catalogue 2024/2025 (échelle ~0-140, normalisé /10)
-- Source : tibhar.info
-- ────────────────────────────────────────────────────────────
SELECT set_note_marque('Evolution MX-P',   'Tibhar', 9.5, 9.0, 5.5, 7.5, NULL, NULL, NULL, 9.0, 'Puissance explosive, idéal attaquant pur. Éponge énergétique 47.5°.');
SELECT set_note_marque('Evolution MX - P', 'Tibhar', 9.5, 9.0, 5.5, 7.5, NULL, NULL, NULL, 9.0, 'Puissance explosive, idéal attaquant pur. Éponge énergétique 47.5°.');
SELECT set_note_marque('Evolution MX-S',   'Tibhar', 9.0, 9.5, 6.0, 7.5, NULL, NULL, NULL, 9.0, 'Maximum de rotation pour jeu topspin intense. Éponge 47.3°.');
SELECT set_note_marque('Evolution MX-D',   'Tibhar', 9.0, 9.5, 5.5, 7.5, NULL, NULL, NULL, 9.0, 'Compromis parfait vitesse/spin, éponge Red Energy.');
SELECT set_note_marque('Evolution EL-P',   'Tibhar', 8.5, 8.5, 6.5, 7.0, NULL, NULL, NULL, 8.5, 'Puissance avec plus de contrôle. Éponge 44.8°.');
SELECT set_note_marque('Evolution EL-S',   'Tibhar', 8.5, 9.0, 6.5, 6.5, NULL, NULL, NULL, 8.5, 'Spin intense, accessible. Éponge 44.8°.');
SELECT set_note_marque('Evolution FX-P',   'Tibhar', 8.0, 8.5, 7.5, 6.0, NULL, NULL, NULL, 8.0, 'Souplesse et puissance. Idéal joueurs intermédiaires. Éponge 42°.');
SELECT set_note_marque('Evolution FX - P', 'Tibhar', 8.0, 8.5, 7.5, 6.0, NULL, NULL, NULL, 8.0, 'Souplesse et puissance. Éponge 42°.');
SELECT set_note_marque('Evolution FX-S',   'Tibhar', 8.0, 9.0, 7.5, 5.5, NULL, NULL, NULL, 8.0, 'Spin maximal dans la gamme FX. Éponge souple 40.1°.');
SELECT set_note_marque('Evolution FX-D',   'Tibhar', 8.0, 9.0, 7.0, 6.0, NULL, NULL, NULL, 8.0, 'Version D (Dense) de la gamme FX.');
SELECT set_note_marque('Evolution EL-D',   'Tibhar', 8.5, 9.0, 6.5, 7.0, NULL, NULL, NULL, 8.5, 'Version D (Dense) de la gamme EL.');
SELECT set_note_marque('Hybrid K1 Pro',    'Tibhar', 9.5, 9.5, 5.0, 8.5, NULL, NULL, NULL, 9.5, 'Top de gamme Tibhar. Hybrid K1 Pro, caoutchouc japonais + éponge allemande.');
SELECT set_note_marque('Hybrid K1 J',      'Tibhar', 9.0, 9.5, 5.0, 8.0, NULL, NULL, NULL, 9.0, 'Version japonaise du K1.');
SELECT set_note_marque('Hybrid K-1',       'Tibhar', 9.0, 9.0, 5.5, 8.0, NULL, NULL, NULL, 9.0, 'Gamme Hybrid K1, technologie hybride.');
SELECT set_note_marque('Hybrid K2',        'Tibhar', 9.0, 9.0, 6.0, 7.5, NULL, NULL, NULL, 8.5, 'Accessible, technologie hybride K2.');
SELECT set_note_marque('Hybrid K2 Pro',    'Tibhar', 9.0, 9.5, 5.5, 8.0, NULL, NULL, NULL, 9.0, 'Version Pro du K2.');
SELECT set_note_marque('Aurus Prime',      'Tibhar', 9.0, 9.0, 6.0, 7.5, NULL, NULL, NULL, 8.5, 'Haut de gamme accessible. Spin et vitesse élevés.');
SELECT set_note_marque('Aurus Select',     'Tibhar', 8.5, 8.5, 6.5, 7.0, NULL, NULL, NULL, 8.0, 'Gamme Aurus, bon équilibre.');
SELECT set_note_marque('Aurus',            'Tibhar', 8.0, 8.0, 7.0, 6.5, NULL, NULL, NULL, 7.5, 'Version entrée de gamme Aurus.');
SELECT set_note_marque('Quantum X Pro',    'Tibhar', 9.5, 9.0, 5.0, 8.5, NULL, NULL, NULL, 9.5, 'Ultra offensif. Technologie Quantum.');
SELECT set_note_marque('1Q',               'Tibhar', 8.5, 8.5, 6.5, 7.0, NULL, NULL, NULL, 8.0, NULL);
SELECT set_note_marque('5Q',               'Tibhar', 9.0, 9.0, 5.5, 7.5, NULL, NULL, NULL, 8.5, NULL);
SELECT set_note_marque('Genius',           'Tibhar', 7.5, 8.0, 7.5, 6.0, NULL, NULL, NULL, 7.5, NULL);
SELECT set_note_marque('Genius +',         'Tibhar', 8.0, 8.5, 7.0, 6.5, NULL, NULL, NULL, 8.0, NULL);
SELECT set_note_marque('Dang',             'Tibhar', 8.5, 9.0, 6.0, 7.0, NULL, NULL, NULL, 8.5, 'Revêtement de Fan Zhendong (anciennement).');
SELECT set_note_marque('Beluga',           'Tibhar', 8.0, 8.5, 7.0, 6.0, NULL, NULL, NULL, 8.0, NULL);
-- Picots Tibhar
SELECT set_note_marque('Grass D. TecS',   'Tibhar', 3.5, 2.0, 8.5, NULL, 9.0, 8.5, 6.0, 7.0, 'Picots longs Herbe. Effet déstabilisateur puissant.');
SELECT set_note_marque('Extra Long',       'Tibhar', 3.5, 2.0, 8.0, NULL, 9.0, 8.5, 5.5, 6.5, 'Picots longs, perturbateur.');
SELECT set_note_marque('Grass',            'Tibhar', 3.0, 2.0, 8.0, NULL, 9.0, 8.5, 5.0, 6.5, 'Picots longs classic.');


-- ────────────────────────────────────────────────────────────
-- BUTTERFLY — Catalogue 2024/2025
-- Source : butterfly-global.com (échelle propre, normalisée /10)
-- ────────────────────────────────────────────────────────────
SELECT set_note_marque('Dignics 05',    'Butterfly', 8.5, 9.5, 6.5, 8.0, NULL, NULL, NULL, 9.5, 'Top mondial. Spin + puissance. 40°. Utilisé par les meilleurs joueurs mondiaux.');
SELECT set_note_marque('Dignics 09C',   'Butterfly', 8.0, 9.5, 7.0, 9.0, NULL, NULL, NULL, 9.5, 'Tacky, spin extrême. 44°. Préféré des joueurs en style chinois en Europe.');
SELECT set_note_marque('Dignics 64',    'Butterfly', 9.5, 8.0, 6.0, 8.0, NULL, NULL, NULL, 9.0, 'Vitesse maximale Butterfly. 40°. Idéal jeu explosif proche de la table.');
SELECT set_note_marque('Dignics 80',    'Butterfly', 9.0, 9.0, 6.5, 8.0, NULL, NULL, NULL, 9.0, 'Équilibre vitesse/spin premium. 40°.');
SELECT set_note_marque('Tenergy 05',    'Butterfly', 8.5, 8.5, 7.0, 6.5, NULL, NULL, NULL, 8.5, 'Référence absolue depuis 2008. Spring Sponge 36°.');
SELECT set_note_marque('Tenergy 25',    'Butterfly', 8.0, 9.0, 7.5, 6.5, NULL, NULL, NULL, 8.5, 'Plus de rotation que le 05. Idéal jeu à mi-distance.');
SELECT set_note_marque('Tenergy 64',    'Butterfly', 9.0, 7.5, 6.5, 6.5, NULL, NULL, NULL, 8.5, 'Le plus rapide de la gamme Tenergy. Très direct.');
SELECT set_note_marque('Tenergy 80',    'Butterfly', 9.0, 8.0, 7.0, 6.5, NULL, NULL, NULL, 8.5, 'Équilibre vitesse/spin dans la gamme Tenergy.');
SELECT set_note_marque('Tenergy 05 FX', 'Butterfly', 8.0, 8.5, 8.0, 5.0, NULL, NULL, NULL, 8.0, 'Version souple du Tenergy 05. Plus de contrôle.');
SELECT set_note_marque('Tenergy 19',    'Butterfly', 8.0, 9.0, 7.5, 6.5, NULL, NULL, NULL, 8.5, 'Nouveau Tenergy 2024. Excellente rotation.');
SELECT set_note_marque('Glayzer',       'Butterfly', 8.5, 9.0, 7.0, 7.5, NULL, NULL, NULL, 8.5, 'Successeur du Tenergy. Nouveau caoutchouc Glayzer.');
SELECT set_note_marque('Glayzer 09C',   'Butterfly', 8.0, 9.5, 7.0, 8.5, NULL, NULL, NULL, 9.0, 'Version 09C du Glayzer. Tacky, spin ultime.');
SELECT set_note_marque('Rozena',        'Butterfly', 7.5, 7.5, 8.0, 5.5, NULL, NULL, NULL, 7.5, 'Spring Sponge X. Accessible, polyvalent. Bon rapport qualité/prix.');
SELECT set_note_marque('Bryce Highspeed','Butterfly',9.0, 7.0, 6.0, 7.0, NULL, NULL, NULL, 8.0, 'Vitesse extrême, jeu très offensif.');
SELECT set_note_marque('Sriver',        'Butterfly', 7.0, 7.0, 8.0, 5.5, NULL, NULL, NULL, 7.0, 'Classique Butterfly. Bon pour débutants/intermédiaires.');
-- Picots Butterfly
SELECT set_note_marque('Feint Long II',   'Butterfly', 3.5, 1.5, 8.5, NULL, 9.0, 8.5, 5.0, 6.5, 'Picots longs Butterfly. Effet perturbateur.');
SELECT set_note_marque('Feint Long III',  'Butterfly', 3.0, 1.5, 8.0, NULL, 9.0, 9.0, 5.0, 6.5, 'Picots longs version III.');
SELECT set_note_marque('Feint AG',        'Butterfly', 3.5, 1.5, 8.5, NULL, 8.5, 8.5, 5.5, 6.5, 'Picots longs Feint AG.');
SELECT set_note_marque('Impartial XS',    'Butterfly', 6.5, 5.0, 8.0, NULL, 8.0, NULL, NULL, 7.0, 'Picots courts Butterfly. Jeu varié.');
SELECT set_note_marque('Impartial XB',    'Butterfly', 7.0, 5.5, 7.5, NULL, 8.5, NULL, NULL, 7.0, 'Picots courts offensifs.');


-- ────────────────────────────────────────────────────────────
-- JOOLA — Catalogue 2024/2025
-- Source : joola.fr / joola.com
-- ────────────────────────────────────────────────────────────
SELECT set_note_marque('Dynaryz AGR',   'Joola', 9.0, 9.5, 5.5, 8.0, NULL, NULL, NULL, 9.0, 'Spin brutal. 47.5°. Pour attaquants élites cherchant rotation maximale.');
SELECT set_note_marque('Dynaryz CMD',   'Joola', 8.5, 9.5, 6.0, 7.5, NULL, NULL, NULL, 9.0, 'Le plus contrôlable des Dynaryz. Spin élevé. 45°.');
SELECT set_note_marque('Dynaryz ACC',   'Joola', 9.0, 9.0, 6.0, 7.5, NULL, NULL, NULL, 8.5, 'Accélération + spin. Successeur Rhyzer 48.');
SELECT set_note_marque('Dynaryz ZGR',   'Joola', 8.5, 9.5, 6.0, 8.0, NULL, NULL, NULL, 9.0, 'Spin maximum de la gamme Dynaryz.');
SELECT set_note_marque('Dynaryz ZGX',   'Joola', 9.0, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.5, 'Top of the line Joola 2024. Spin + vitesse extrêmes.');
SELECT set_note_marque('Dynaryz Inferno','Joola', 9.5, 9.5, 5.0, 9.0, NULL, NULL, NULL, 9.5, 'Ultra-offensif. Éponge 52.5°. Pour pros uniquement.');
SELECT set_note_marque('Rhyzen CMD',    'Joola', 9.0, 9.5, 5.5, 8.0, NULL, NULL, NULL, 9.0, 'Nouvelle gamme Rhyzen. Top spin.');
SELECT set_note_marque('Rhyzen Fire',   'Joola', 9.5, 9.5, 5.0, 9.0, NULL, NULL, NULL, 9.5, 'Rhyzen ultra-offensif.');
SELECT set_note_marque('Rhyzen Ice',    'Joola', 8.5, 9.5, 6.0, 8.0, NULL, NULL, NULL, 9.0, 'Rhyzen contrôlé, bon spin.');
SELECT set_note_marque('Rhyzen ZGR',    'Joola', 9.0, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.0, 'Spin premium gamme Rhyzen.');
SELECT set_note_marque('Rhyzen ZGX',    'Joola', 9.0, 9.5, 5.5, 9.0, NULL, NULL, NULL, 9.5, 'Top gamme Rhyzen.');
SELECT set_note_marque('Rhyzer 48',     'Joola', 8.5, 8.5, 6.5, 7.5, NULL, NULL, NULL, 8.5, 'Polyvalent offensif. 48°. Excellent rapport qualité/prix.');
SELECT set_note_marque('Rhyzer 43',     'Joola', 8.0, 8.5, 7.0, 7.0, NULL, NULL, NULL, 8.0, 'Plus souple que le 48. Bon contrôle. 43°.');
SELECT set_note_marque('Rhyzer Pro 45', 'Joola', 8.5, 8.5, 6.5, 7.5, NULL, NULL, NULL, 8.5, 'Version Pro du Rhyzer. 45°.');
SELECT set_note_marque('Rhyzer Pro 50', 'Joola', 9.0, 9.0, 6.0, 8.0, NULL, NULL, NULL, 9.0, 'Pro 50°. Très offensif.');
SELECT set_note_marque('Golden Tango',  'Joola', 8.5, 9.0, 6.0, 7.5, NULL, NULL, NULL, 8.5, 'Classique Joola. Bon spin, connu des attaquants.');
SELECT set_note_marque('Golden Tango PS','Joola', 8.5, 9.0, 6.5, 7.0, NULL, NULL, NULL, 8.5, 'Version PS (Pips Short) du Golden Tango.');
SELECT set_note_marque('Hugo Calderano Trinity Charged', 'Joola', 9.5, 9.5, 5.5, 9.0, NULL, NULL, NULL, 9.5, 'Signature Hugo Calderano. Éponge Charged ultra-offensive.');
SELECT set_note_marque('Hugo Calderano Trinity Dynamic', 'Joola', 9.0, 9.5, 6.0, 8.5, NULL, NULL, NULL, 9.0, 'Version Dynamic Calderano. Équilibre vitesse/spin.');
SELECT set_note_marque('Rhyzm',         'Joola', 8.5, 9.0, 6.0, 7.5, NULL, NULL, NULL, 8.5, NULL);
SELECT set_note_marque('Mambo',         'Joola', 8.0, 8.5, 7.0, 6.5, NULL, NULL, NULL, 8.0, NULL);
SELECT set_note_marque('Energy X-tra',  'Joola', 7.5, 8.0, 7.5, 6.0, NULL, NULL, NULL, 7.5, NULL);
-- Picots Joola
SELECT set_note_marque('CWX',           'Joola', 3.5, 2.0, 8.5, NULL, 9.0, 8.5, 5.5, 7.0, 'Picots longs Joola. Très perturbateur.');
SELECT set_note_marque('Express Ultra',  'Joola', 7.0, 5.0, 7.5, NULL, 8.5, NULL, NULL, 7.0, 'Picots courts Joola. Attaque rapide.');


-- ────────────────────────────────────────────────────────────
-- STIGA — Catalogue 2024/2025
-- Source : stigasports.com (échelle ~0-120, normalisée /10)
-- ────────────────────────────────────────────────────────────
SELECT set_note_marque('DNA Platinum XH', 'Stiga', 9.0, 9.5, 5.0, 9.5, NULL, NULL, NULL, 9.5, 'Top de gamme Stiga 2024. DNA Platinum 55°. Puissance absolue.');
SELECT set_note_marque('DNA Platinum H',  'Stiga', 8.5, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.0, 'DNA Platinum H 50°. Très offensif.');
SELECT set_note_marque('DNA Platinum M',  'Stiga', 8.0, 9.5, 6.5, 7.5, NULL, NULL, NULL, 9.0, 'DNA Platinum M 45°. Polyvalent haut de gamme.');
SELECT set_note_marque('DNA Platinum S',  'Stiga', 7.5, 9.5, 7.0, 6.5, NULL, NULL, NULL, 8.5, 'DNA Platinum S 40°. Spin exceptionnel, contrôle élevé.');
SELECT set_note_marque('DNA Dragon Grip', 'Stiga', 9.0, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.5, 'Dragon Grip. Adhérence extrême, style chinois.');
SELECT set_note_marque('DNA Dragon Power 52.5', 'Stiga', 8.5, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.0, 'Dragon Power 52.5°.');
SELECT set_note_marque('DNA Dragon Power 55',   'Stiga', 9.0, 9.5, 5.5, 9.0, NULL, NULL, NULL, 9.5, 'Dragon Power 55°. Ultra-offensif.');
SELECT set_note_marque('DNA Dragon Power 57.5', 'Stiga', 9.5, 9.5, 5.0, 9.5, NULL, NULL, NULL, 9.5, 'Dragon Power 57.5°. Éponge la plus dure.');
SELECT set_note_marque('DNA Future M',   'Stiga', 8.0, 9.5, 6.5, 7.5, NULL, NULL, NULL, 9.0, 'DNA Future nouvelle génération.');
SELECT set_note_marque('DNA Hybrid H',   'Stiga', 8.5, 9.0, 6.0, 8.0, NULL, NULL, NULL, 8.5, 'DNA Hybrid H. Technologie hybride.');
SELECT set_note_marque('DNA Hybrid M',   'Stiga', 8.0, 9.0, 6.5, 7.5, NULL, NULL, NULL, 8.5, 'DNA Hybrid M. Équilibre parfait.');
SELECT set_note_marque('DNA Hybrid XH',  'Stiga', 9.0, 9.0, 5.5, 8.5, NULL, NULL, NULL, 9.0, 'DNA Hybrid XH. Très offensif.');
SELECT set_note_marque('DNA Hybrid Sponge 55', 'Stiga', 9.0, 9.0, 5.5, 9.0, NULL, NULL, NULL, 9.0, 'Hybrid Sponge 55°. Éponge dense.');
SELECT set_note_marque('DNA Pro H',      'Stiga', 8.5, 9.0, 6.0, 8.0, NULL, NULL, NULL, 8.5, 'DNA Pro H. Gamme Pro accessible.');
SELECT set_note_marque('DNA Pro M',      'Stiga', 8.0, 9.0, 6.5, 7.0, NULL, NULL, NULL, 8.0, 'DNA Pro M. Bon équilibre.');
SELECT set_note_marque('DNA Pro S',      'Stiga', 7.5, 8.5, 7.0, 6.0, NULL, NULL, NULL, 8.0, 'DNA Pro S. Souplesse et contrôle.');
SELECT set_note_marque('DNA Advance',    'Stiga', 7.0, 8.0, 7.5, 5.5, NULL, NULL, NULL, 7.5, 'DNA Advance. Entrée de gamme DNA.');
SELECT set_note_marque('Helix Platinum XH', 'Stiga', 9.5, 9.5, 5.0, 9.5, NULL, NULL, NULL, 9.5, 'Helix Platinum XH. Nouveau 2024. Ultime puissance.');
SELECT set_note_marque('Helix Platinum H',  'Stiga', 9.0, 9.5, 5.5, 8.5, NULL, NULL, NULL, 9.0, 'Helix Platinum H.');
SELECT set_note_marque('Helix Platinum M',  'Stiga', 8.5, 9.5, 6.0, 7.5, NULL, NULL, NULL, 9.0, 'Helix Platinum M.');
SELECT set_note_marque('Helix Platinum 55', 'Stiga', 9.0, 9.5, 5.5, 9.0, NULL, NULL, NULL, 9.5, 'Helix Platinum 55°.');
SELECT set_note_marque('Mantra H',       'Stiga', 9.0, 9.0, 6.0, 8.0, NULL, NULL, NULL, 8.5, 'Mantra H. Technologie japonaise. 47.5°.');
SELECT set_note_marque('Mantra M',       'Stiga', 8.5, 9.0, 6.5, 7.0, NULL, NULL, NULL, 8.5, 'Mantra M. Polyvalent. 44°.');
SELECT set_note_marque('Mantra S',       'Stiga', 8.0, 8.5, 7.0, 6.0, NULL, NULL, NULL, 8.0, 'Mantra S. Souple, contrôlé. 40°.');
SELECT set_note_marque('Calibra LT',     'Stiga', 7.5, 7.5, 8.0, 5.5, NULL, NULL, NULL, 7.5, 'Classique Stiga. Bon contrôle. Idéal polyvalent.');
SELECT set_note_marque('Calibra LT Sound','Stiga', 7.0, 7.5, 8.5, 5.0, NULL, NULL, NULL, 7.0, 'Version Sound, plus douce.');
SELECT set_note_marque('Asteria S',      'Stiga', 8.0, 8.5, 7.0, 6.5, NULL, NULL, NULL, 8.0, 'Asteria S. Nouveau revêtement Stiga offensif.');
SELECT set_note_marque('Eco Future',     'Stiga', 6.5, 7.0, 8.5, 5.0, NULL, NULL, NULL, 6.5, 'Éco Future. Entrée de gamme.');
-- Picots Stiga
SELECT set_note_marque('Horizontal 20',  'Stiga', 4.0, 2.5, 8.5, NULL, 9.0, 8.0, 5.0, 7.0, 'Picots longs Stiga.');
SELECT set_note_marque('Horizontal 55',  'Stiga', 4.5, 2.5, 8.0, NULL, 8.5, 8.5, 5.0, 7.0, 'Picots longs version 55.');


-- ────────────────────────────────────────────────────────────
-- DR NEUBAUER — Spécialiste défense/perturbation
-- Source : dr-neubauer.com (notes propres normalisées /10)
-- ────────────────────────────────────────────────────────────

-- Anti-spin Dr Neubauer
SELECT set_note_marque('Bison',         'Dr. Neubauer', 2.0, 1.5, 9.5, NULL, 9.0, 9.5, NULL, 8.0, 'Anti-spin ultra lent. Inversion de spin maximale. Référence blocage défensif.');
SELECT set_note_marque('Buffalo',       'Dr. Neubauer', 2.0, 1.5, 9.5, NULL, 9.0, 9.5, NULL, 8.0, 'Anti-spin. Très lent, inversion parfaite.');
SELECT set_note_marque('A - B - S',     'Dr. Neubauer', 3.0, 2.0, 9.0, NULL, 8.5, 9.0, NULL, 7.5, 'Anti-spin ABS. Classique défensif Dr Neubauer.');
SELECT set_note_marque('A-B-S 2',       'Dr. Neubauer', 3.0, 2.0, 9.0, NULL, 8.5, 9.0, NULL, 7.5, 'ABS 2. Amélioration du ABS original.');
SELECT set_note_marque('A-B-S 2 Evo',   'Dr. Neubauer', 3.5, 2.5, 9.0, NULL, 8.5, 9.0, NULL, 8.0, 'ABS 2 Evo. Version évoluée.');
SELECT set_note_marque('A-B-S 2 Pro',   'Dr. Neubauer', 3.0, 2.0, 9.5, NULL, 9.0, 9.5, NULL, 8.0, 'ABS 2 Pro. Niveau professionnel défensif.');
SELECT set_note_marque('A-B-S 2 Soft',  'Dr. Neubauer', 2.5, 2.0, 9.5, NULL, 9.0, 9.5, NULL, 7.5, 'ABS 2 Soft. Version très souple.');
SELECT set_note_marque('A-B-S 3',       'Dr. Neubauer', 3.5, 2.5, 9.0, NULL, 8.5, 9.0, NULL, 8.0, 'ABS 3. Troisième génération.');
SELECT set_note_marque('A-B-S 3 Pro',   'Dr. Neubauer', 3.5, 2.5, 9.5, NULL, 9.0, 9.5, NULL, 8.5, 'ABS 3 Pro. Haut de gamme anti-spin.');
SELECT set_note_marque('Anti Special',  'Dr. Neubauer', 3.0, 2.0, 9.0, NULL, 8.5, 9.0, NULL, 7.5, 'Anti Special. Anti-spin classique.');
SELECT set_note_marque('Django',        'Dr. Neubauer', 3.5, 2.5, 9.0, NULL, 8.5, 9.0, NULL, 8.0, 'Django. Anti-spin moderne.');
SELECT set_note_marque('Grizzly',       'Dr. Neubauer', 3.0, 2.0, 9.5, NULL, 9.0, 9.5, NULL, 8.0, 'Grizzly Anti. Inversion spin + contrôle extrêmes.');

-- Picots longs Dr Neubauer
SELECT set_note_marque('Gorilla',       'Dr. Neubauer', 4.0, 2.0, 8.0, NULL, 9.0, NULL, 6.5, 7.5, 'Picots longs perturbateurs. Alternative aux longs frictionless.');
SELECT set_note_marque('Desperado',     'Dr. Neubauer', 3.5, 2.0, 8.5, NULL, 9.0, 8.5, 6.0, 7.5, 'Picots longs Desperado. Très perturbateur.');
SELECT set_note_marque('Desperado 2',   'Dr. Neubauer', 3.5, 2.0, 8.5, NULL, 9.0, 8.5, 6.0, 7.5, 'Desperado 2. Version améliorée.');
SELECT set_note_marque('Desperado Reloaded', 'Dr. Neubauer', 4.0, 2.5, 8.5, NULL, 9.0, 8.5, 6.0, 8.0, 'Desperado Reloaded. Nouvelle version 2024.');
SELECT set_note_marque('Boomerang Classic', 'Dr. Neubauer', 3.5, 2.0, 8.5, NULL, 8.5, 8.5, 6.0, 7.0, 'Boomerang Classic. Picots longs classiques.');
SELECT set_note_marque('Allround Premium',  'Dr. Neubauer', 4.0, 2.5, 8.5, NULL, 8.5, 8.0, 6.5, 7.0, 'Allround Premium. Picots longs polyvalents.');
SELECT set_note_marque('Allround Premium 2','Dr. Neubauer', 4.0, 2.5, 9.0, NULL, 8.5, 8.0, 6.5, 7.5, 'Allround Premium 2. Version améliorée.');

-- Picots courts Dr Neubauer
SELECT set_note_marque('Aggressor',     'Dr. Neubauer', 7.0, 5.5, 7.0, NULL, 8.0, NULL, NULL, 7.5, 'Picots courts offensifs perturbateurs.');
SELECT set_note_marque('Aggressor Evo', 'Dr. Neubauer', 7.5, 5.5, 7.0, NULL, 8.0, NULL, NULL, 7.5, 'Aggressor Evo. Version évoluée.');
SELECT set_note_marque('Aggressor Pro', 'Dr. Neubauer', 7.5, 6.0, 7.0, NULL, 8.5, NULL, NULL, 8.0, 'Aggressor Pro. Niveau pro.');
SELECT set_note_marque('Explosion',     'Dr. Neubauer', 7.0, 5.0, 6.5, NULL, 8.5, NULL, NULL, 7.5, 'Explosion. Picots courts très perturbateurs.');
SELECT set_note_marque('Diamant',       'Dr. Neubauer', 6.5, 5.0, 7.5, NULL, 8.0, NULL, NULL, 7.0, 'Diamant. Picots courts défensifs/offensifs.');

-- Backside Dr Neubauer
SELECT set_note_marque('Dominance',          'Dr. Neubauer', 7.5, 8.5, 7.0, 7.0, NULL, NULL, NULL, 7.5, 'Dominance. Backside offensif Dr Neubauer.');
SELECT set_note_marque('Dominance Speed',    'Dr. Neubauer', 8.5, 8.0, 6.5, 7.5, NULL, NULL, NULL, 8.0, 'Dominance Speed. Version rapide.');
SELECT set_note_marque('Dominance Speed Hard','Dr. Neubauer', 9.0, 8.0, 6.0, 8.0, NULL, NULL, NULL, 8.5, 'Dominance Speed Hard.');
SELECT set_note_marque('Dominance Spin',     'Dr. Neubauer', 7.0, 9.0, 7.0, 7.0, NULL, NULL, NULL, 8.0, 'Dominance Spin. Rotation prioritaire.');
SELECT set_note_marque('Dominance Spin Hard','Dr. Neubauer', 7.5, 9.0, 6.5, 7.5, NULL, NULL, NULL, 8.0, 'Dominance Spin Hard.');
SELECT set_note_marque('Defence Master',     'Dr. Neubauer', 5.0, 7.0, 9.0, 6.0, NULL, NULL, NULL, 7.5, 'Defence Master. Backside défensif.');
SELECT set_note_marque('Domination',         'Dr. Neubauer', 7.0, 8.5, 7.5, 6.5, NULL, NULL, NULL, 7.5, 'Domination. Backside polyvalent.');


-- ════════════════════════════════════════════════════════════
-- PARTIE 4 — VÉRIFICATION
-- Vérifiez le résultat sur vos produits
-- ════════════════════════════════════════════════════════════
SELECT
  p.nom,
  m.nom AS marque,
  r.note_marque_vitesse  AS vitesse,
  r.note_marque_spin     AS spin,
  r.note_marque_controle AS controle,
  r.note_marque_durete   AS durete,
  r.note_marque_globale  AS globale,
  r.commentaire_marque   AS commentaire
FROM revetements r
JOIN produits p ON p.id = r.produit_id
JOIN marques m ON m.id = p.marque_id
WHERE r.note_marque_vitesse IS NOT NULL
   OR r.note_marque_spin IS NOT NULL
ORDER BY m.nom, p.nom
LIMIT 100;
