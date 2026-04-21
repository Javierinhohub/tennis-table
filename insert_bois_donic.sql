-- ════════════════════════════════════════════════════════════
-- INSERTION BOIS DONIC — SQL Editor > Run
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  donic_id UUID;
  prod_id  UUID;
BEGIN

  -- Récupérer ou créer la marque Donic
  SELECT id INTO donic_id FROM marques WHERE nom ILIKE 'Donic' LIMIT 1;
  IF donic_id IS NULL THEN
    INSERT INTO marques (nom) VALUES ('Donic') RETURNING id INTO donic_id;
  END IF;

  -- Donic Alligator Combi
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Alligator Combi', 'donic-alligator-combi', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 6.0, 'ALL', 'Limba / Acajou / Balsa / Ayous / White Ash');
  END IF;

  -- Donic Appelgren ALL+ World Champion 89
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Appelgren ALL+ World Champion 89', 'donic-appelgren-all-world-champion-89', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 80, 6.1, 'ALL+', 'Epicéa / Carbone Fleece Zylon® / Ayous / Kiri / Ayous / Carbone Fleece Zylon® / Epicéa');
  END IF;

  -- Donic Appelgren Allplay
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Appelgren Allplay', 'donic-appelgren-allplay', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, NULL, 'ALL', 'Limba / Limba / Ayous / Limba / Limba');
  END IF;

  -- Donic Appelgren Dotec Control
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Appelgren Dotec Control', 'donic-appelgren-dotec-control', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 70, 7.4, 'ALL', 'Limba / Dotec / Ayous / Balsa / Ayous / Dotec / Limba');
  END IF;

  -- Donic Appelgren Exclusive AR
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Appelgren Exclusive AR', 'donic-appelgren-exclusive-ar', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, NULL, 'ALL', 'Limba / Ayous / Ayous / Ayous / Limba');
  END IF;

  -- Donic Balsa Carbo Fleece 7
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Balsa Carbo Fleece 7', 'donic-balsa-carbo-fleece-7', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 73, NULL, 'ALL', 'Lati / Limba / Carbone Fleece / Balsa / Carbone Fleece / Limba / Lati');
  END IF;

  -- Donic Baum Esprit 7
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Baum Esprit 7', 'donic-baum-esprit-7', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 88, 6.0, 'ALL', 'Koto / Aramide Carbone / Ayous / Kiri / Ayous / Aramide Carbone / Koto');
  END IF;

  -- Donic Baum SawTec OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Baum SawTec OFF', 'donic-baum-sawtec-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 7.0, 'OFF', 'Ayous / Ayous / Ayous / Ayous / Ayous');
  END IF;

  -- Donic Burn ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn ALL+', 'donic-burn-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, NULL, 'ALL+', 'Acajou / Awan / Kiri / Awan / Acajou');
  END IF;

  -- Donic Burn Aratox
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn Aratox', 'donic-burn-aratox', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, NULL, 'ALL', 'Koto / Kiri / Aratox / Kiri / Aratox / Kiri / Koto');
  END IF;

  -- Donic Burn Aratox RS
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn Aratox RS', 'donic-burn-aratox-rs', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, NULL, 'ALL', 'Acajou / Kiri / Aratox / Kiri / Aratox / Kiri / Acajou');
  END IF;

  -- Donic Burn Carbotox
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn Carbotox', 'donic-burn-carbotox', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 6.2, 'ALL', 'Acajou / Kiri / Carbotox / Kiri / Carbotox / Kiri / Acajou');
  END IF;

  -- Donic Burn OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn OFF', 'donic-burn-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 90, NULL, 'OFF', 'Acajou / Awan / Kiri / Awan / Acajou');
  END IF;

  -- Donic Burn OFF-
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Burn OFF-', 'donic-burn-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, NULL, 'OFF-', 'Acajou / Awan / Kiri / Awan / Acajou');
  END IF;

  -- Donic Carbo System Offensive
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Carbo System Offensive', 'donic-carbo-system-offensive', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, NULL, 'OFF', 'Koto / Aramide Carbone / Ayous / Kiri / Ayous / Aramide Carbone / Koto');
  END IF;

  -- Donic Carbo System Offensive Plus
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Carbo System Offensive Plus', 'donic-carbo-system-offensive-plus', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, NULL, 'OFF', 'Hinoki / Carbone / Kiri / Carbone / Hinoki');
  END IF;

  -- Donic Cayman
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Cayman', 'donic-cayman', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 70, 9.3, 'ALL', 'Koto / Balsa / Balsa / Balsa / Koto');
  END IF;

  -- Donic Classic Allround
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Classic Allround', 'donic-classic-allround', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 9, 85, 5.5, 'ALL', 'Koto / Carbone / Limba / Awan / Aratox / Awan / Limba / Carbone / Koto');
  END IF;

  -- Donic Classic Offensive
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Classic Offensive', 'donic-classic-offensive', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 87, 6.0, 'OFF', 'Epicéa / Ayous / Ayous / Flax Cloth BF3 / Ayous / Ayous / Epicéa');
  END IF;

  -- Donic Classic Power Allround
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Classic Power Allround', 'donic-classic-power-allround', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 87, 6.0, 'ALL', 'Epicéa / Flax Cloth BF3 / Ayous / Ayous / Ayous / Flax Cloth BF3 / Epicéa');
  END IF;

  -- Donic Crest ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Crest ALL+', 'donic-crest-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 9, 94, 5.9, 'ALL+', 'Limba / Limba / ZLC / Carbone / Ayous / Carbone / ZLC / Limba / Limba');
  END IF;

  -- Donic Crest OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Crest OFF', 'donic-crest-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 9, 88, 5.9, 'OFF', 'Limba / ZLC / Carbone / Limba / Kiri / Limba / Carbone / ZLC / Limba');
  END IF;

  -- Donic Defplay Classic Senso
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Defplay Classic Senso', 'donic-defplay-classic-senso', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 6, 70, NULL, 'DEF', 'Aniégré / Limba / Fibre de verre / Balsa / Fibre de verre / Limba / Aniégré');
  END IF;

  -- Donic Defplay Senso
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Defplay Senso', 'donic-defplay-senso', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, NULL, 'DEF', 'Aniégré / Okoumé / Tilleul / Okoumé / Aniégré');
  END IF;

  -- Donic Dima SawTec AR
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Dima SawTec AR', 'donic-dima-sawtec-ar', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 6.3, 'ALL', 'Koto / Kiri / Kiri / Kiri / Koto');
  END IF;

  -- Donic Dotec Impuls
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Dotec Impuls', 'donic-dotec-impuls', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 9, 80, NULL, 'ALL', 'Lati / Black Cloth / Koto / Balsa / Balsa + Aratox / Balsa / Koto / Black Cloth / Lati');
  END IF;

  -- Donic Dotec True Carbon Inner
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Dotec True Carbon Inner', 'donic-dotec-true-carbon-inner', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 5.4, 'ALL', 'Koto / Ayous / Aramide Carbone / Kiri / Aramide Carbone / Ayous / Koto');
  END IF;

  -- Donic Li Ping Kitex
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Li Ping Kitex', 'donic-li-ping-kitex', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, 6.3, 'ALL', 'Hinoki / Ayous / Texalium™ / Kiri / Texalium™ / Ayous / Hinoki');
  END IF;

  -- Donic Master Ultra Power
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Master Ultra Power', 'donic-master-ultra-power', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 87, NULL, 'ALL', 'Limba / Ayous / Ayous / Ayous / Ayous / Ayous / Limba');
  END IF;

  -- Donic New Impuls 6.5
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'New Impuls 6.5', 'donic-new-impuls-6-5', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 6.5, 'ALL', 'Epicéa / Kiri / Kiri / Kiri / Epicéa');
  END IF;

  -- Donic New Impuls 7.0
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'New Impuls 7.0', 'donic-new-impuls-7-0', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 7.0, 'ALL', 'Epicéa / Kiri / Kiri / Kiri / Epicéa');
  END IF;

  -- Donic New Impuls 7.5
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'New Impuls 7.5', 'donic-new-impuls-7-5', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 90, 7.5, 'ALL', 'Epicéa / Kiri / Kiri / Kiri / Epicéa');
  END IF;

  -- Donic Opticon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Opticon', 'donic-opticon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 7.6, 'ALL', 'Hêtre / Ayous / Balsa / Ayous / Hêtre');
  END IF;

  -- Donic Opticon RS
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Opticon RS', 'donic-opticon-rs', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, NULL, 'ALL', 'Bouleau / Ayous / Balsa / Ayous / Bouleau');
  END IF;

  -- Donic Original Exclusive Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Original Exclusive Carbon', 'donic-original-exclusive-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 84, 6.2, 'ALL', 'Ayous / Ayous / Carbone / Kiri / Carbone / Ayous / Ayous');
  END IF;

  -- Donic Original Senso Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Original Senso Carbon', 'donic-original-senso-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 8, 90, 5.6, 'ALL', 'Limba / Aniégré / Carbone / Ayous / Ayous / Carbone / Aniégré / Limba');
  END IF;

  -- Donic Original True Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Original True Carbon', 'donic-original-true-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, 5.3, 'ALL', 'Koto / Carbone Kevlar™ / Ayous / Kiri / Ayous / Carbone Kevlar™ / Koto');
  END IF;

  -- Donic Original True Carbon Inner
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Original True Carbon Inner', 'donic-original-true-carbon-inner', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 5.6, 'ALL', 'Koto / Ayous / Aramide Carbone / Kiri / Aramide Carbone / Ayous / Koto');
  END IF;

  -- Donic Ovtcharov Carbospeed
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Carbospeed', 'donic-ovtcharov-carbospeed', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 87, 6.8, 'ALL', 'Hinoki / Carbone / Kiri / Carbone / Hinoki');
  END IF;

  -- Donic Ovtcharov Dotec ALL
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Dotec ALL', 'donic-ovtcharov-dotec-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 6.4, 'ALL', 'Limba / Ayous / Kiri / Ayous / Limba');
  END IF;

  -- Donic Ovtcharov Dotec ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Dotec ALL+', 'donic-ovtcharov-dotec-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 6.4, 'ALL+', 'Limba / Ayous / Kiri / Ayous / Limba');
  END IF;

  -- Donic Ovtcharov Dotec OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Dotec OFF', 'donic-ovtcharov-dotec-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 80, 6.4, 'OFF', 'Limba / Ayous / Kiri / Ayous / Limba');
  END IF;

  -- Donic Ovtcharov Original Senso Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Original Senso Carbon', 'donic-ovtcharov-original-senso-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 8, 90, 5.7, 'ALL', 'Limba / Aniégré / Carbone / Ayous / Ayous / Carbone / Aniégré / Limba');
  END IF;

  -- Donic Ovtcharov Soft Carbon V1
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Ovtcharov Soft Carbon V1', 'donic-ovtcharov-soft-carbon-v1', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, NULL, 'ALL', 'Noyer / Pin / Carbone / Ayous / Carbone / Pin / Noyer');
  END IF;

  -- Donic Persson Carbotec
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Carbotec', 'donic-persson-carbotec', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, NULL, 'ALL', 'Koto / Fibre de verre + carbone / Sapin / Kiri / Sapin / Fibre de verre + carbone / Koto');
  END IF;

  -- Donic Persson Dotec Carbokev
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Dotec Carbokev', 'donic-persson-dotec-carbokev', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 80, NULL, 'ALL', 'Koto / Koto / Carbone Kevlar™ / Balsa / Carbone Kevlar™ / Koto / Koto');
  END IF;

  -- Donic Persson Dotec OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Dotec OFF', 'donic-persson-dotec-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 75, 7.4, 'OFF', 'Hinoki / Dotec / Koto / Balsa / Koto / Dotec / Hinoki');
  END IF;

  -- Donic Persson Exclusive OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Exclusive OFF', 'donic-persson-exclusive-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.9, 'OFF', 'Limba / Koto / Kiri / Koto / Limba');
  END IF;

  -- Donic Persson Jubilee 40
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Jubilee 40', 'donic-persson-jubilee-40', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 88, NULL, 'ALL', 'Limba / Ayous / Acrylate Carbone / Ayous / Acrylate Carbone / Ayous / Limba');
  END IF;

  -- Donic Persson OFF+ World Champion 89
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson OFF+ World Champion 89', 'donic-persson-off-world-champion-89', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 6.9, 'OFF+', 'Epicéa / Carbone Fleece Zylon® / Epicéa / Kiri / Epicéa / Carbone Fleece Zylon® / Epicéa');
  END IF;

  -- Donic Persson Powerallround
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Powerallround', 'donic-persson-powerallround', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.8, 'ALL', 'Limba / Ayous / Ayous / Ayous / Limba');
  END IF;

  -- Donic Persson Powerplay
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Powerplay', 'donic-persson-powerplay', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, 5.9, 'ALL', 'Koto / Feuille anti-vibration / Ayous / Ayous / Ayous / Feuille anti-vibration / Koto');
  END IF;

  -- Donic Persson Seven
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Persson Seven', 'donic-persson-seven', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 90, 6.3, 'ALL', 'Limba / Ayous / Ayous / Ayous / Ayous / Ayous / Limba');
  END IF;

  -- Donic Relevant
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Relevant', 'donic-relevant', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 6.2, 'ALL', 'Limba / Carbone / Limba / Ayous / Limba / Carbone / Limba');
  END IF;

  -- Donic Waldner Allplay
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Allplay', 'donic-waldner-allplay', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, NULL, 'ALL', 'Limba / Limba / Ayous / Limba / Limba');
  END IF;

  -- Donic Waldner Black Devil Carbon Balsa
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Black Devil Carbon Balsa', 'donic-waldner-black-devil-carbon-balsa', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 80, 6.0, 'ALL', 'Koto / Carbone / Koto / Balsa / Koto / Carbone / Koto');
  END IF;

  -- Donic Waldner Black Power
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Black Power', 'donic-waldner-black-power', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 6.6, 'ALL', 'Limba / Ayous / Ayous / Ayous / Limba');
  END IF;

  -- Donic Waldner Carbopower
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Carbopower', 'donic-waldner-carbopower', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 6.2, 'ALL', 'Hinoki / ALC / Kiri / ALC / Hinoki');
  END IF;

  -- Donic Waldner Diablo Senso
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Diablo Senso', 'donic-waldner-diablo-senso', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.5, 'ALL', 'Limba / Fibre de verre / Ayous / Fibre de verre / Limba');
  END IF;

  -- Donic Waldner Dicon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Dicon', 'donic-waldner-dicon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.2, 'ALL', 'Limba / Epicéa / Ayous / Epicéa / Limba');
  END IF;

  -- Donic Waldner Dotec AR
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Dotec AR', 'donic-waldner-dotec-ar', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 70, 7.4, 'ALL', 'Limba / Dotec / Limba / Balsa / Limba / Dotec / Limba');
  END IF;

  -- Donic Waldner Dotec Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Dotec Carbon', 'donic-waldner-dotec-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 7.5, 'ALL', 'Limba / Limba / Carbone / Balsa / Carbone / Limba / Limba');
  END IF;

  -- Donic Waldner Dotec Hinoki
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Dotec Hinoki', 'donic-waldner-dotec-hinoki', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 3, 90, 8.5, 'ALL', 'Hinoki / Hinoki / Hinoki');
  END IF;

  -- Donic Waldner Exclusive AR+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Exclusive AR+', 'donic-waldner-exclusive-ar', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.7, 'ALL', 'Limba / Limba / Ayous / Limba / Limba');
  END IF;

  -- Donic Waldner JO Shape
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner JO Shape', 'donic-waldner-jo-shape', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 82, 5.5, 'ALL', 'Limba / Epicéa / Ayous / Epicéa / Limba');
  END IF;

  -- Donic Waldner Legend Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Legend Carbon', 'donic-waldner-legend-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 83, 6.3, 'ALL', 'Hinoki / Carbone / Kiri / Carbone / Hinoki');
  END IF;

  -- Donic Waldner OFF World Champion 89
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner OFF World Champion 89', 'donic-waldner-off-world-champion-89', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 6.9, 'OFF', 'Epicéa / Epicéa / ZLC / Kiri / ZLC / Epicéa / Epicéa');
  END IF;

  -- Donic Waldner Offensiv 2016
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Offensiv 2016', 'donic-waldner-offensiv-2016', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, NULL, 'OFF', 'Limba / Pin / Ayous / Pin / Limba');
  END IF;

  -- Donic Waldner Senso Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Senso Carbon', 'donic-waldner-senso-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, NULL, 'ALL', 'Limba / Aniégré / Carbone / Ayous / Carbone / Aniégré / Limba');
  END IF;

  -- Donic Waldner Senso Ultra Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Senso Ultra Carbon', 'donic-waldner-senso-ultra-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 80, NULL, 'ALL', 'Limba / Ayous / Carbone / Ayous / Carbone / Ayous / Limba');
  END IF;

  -- Donic Waldner Senso V1
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Senso V1', 'donic-waldner-senso-v1', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.8, 'ALL', 'Limba / Limba / Ayous / Limba / Limba');
  END IF;

  -- Donic Waldner Senso V2
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Waldner Senso V2', 'donic-waldner-senso-v2', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 85, 5.8, 'ALL', 'Limba / Limba / Ayous / Limba / Limba');
  END IF;

  -- Donic Wang Xi Dotec Control Plus
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Wang Xi Dotec Control Plus', 'donic-wang-xi-dotec-control-plus', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 80, 5.9, 'ALL', 'Limba / Ayous / Dotec / Kiri / Dotec / Ayous / Limba');
  END IF;

  -- Donic Zhou Yu One
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Zhou Yu One', 'donic-zhou-yu-one', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 89, 6.0, 'ALL', 'Noyer / Epicéa / Ayous / Epicéa / Noyer');
  END IF;

  -- Donic Zhou Yu Three
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Zhou Yu Three', 'donic-zhou-yu-three', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 7, 85, 5.7, 'ALL', 'Koto / Aramide Carbone / Limba / Kiri / Limba / Aramide Carbone / Koto');
  END IF;

  -- Donic Zhou Yu Two
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (donic_id, 'Zhou Yu Two', 'donic-zhou-yu-two', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, nb_plis, poids_g, epaisseur_mm, style, composition)
    VALUES (prod_id, 5, 89, 5.8, 'ALL', 'Ebène / Epicéa / Ayous / Epicéa / Ebène');
  END IF;

END $$;

-- Vérification
SELECT COUNT(*) FROM produits p JOIN bois b ON b.produit_id = p.id JOIN marques m ON m.id = p.marque_id WHERE m.nom ILIKE 'Donic';