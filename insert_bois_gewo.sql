-- ════════════════════════════════════════════════════════════
-- INSERTION BOIS GEWO — SQL Editor > Run
-- ════════════════════════════════════════════════════════════

DO $$
DECLARE
  gewo_id UUID;
  prod_id UUID;
BEGIN

  SELECT id INTO gewo_id FROM marques WHERE nom ILIKE 'Gewo' LIMIT 1;
  IF gewo_id IS NULL THEN
    INSERT INTO marques (nom) VALUES ('Gewo') RETURNING id INTO gewo_id;
  END IF;

  -- Gewo An Jaehyun Carbon Basic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'An Jaehyun Carbon Basic', 'gewo-an-jaehyun-carbon-basic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 62.9);
  END IF;

  -- Gewo Prithika Pavade Carbon Basic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Prithika Pavade Carbon Basic', 'gewo-prithika-pavade-carbon-basic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 62.9);
  END IF;

  -- Gewo Prithika Pavade ARC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Prithika Pavade ARC OFF', 'gewo-prithika-pavade-arc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 139.9);
  END IF;

  -- Gewo Prithika Pavade Blaze OFF-
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Prithika Pavade Blaze OFF-', 'gewo-prithika-pavade-blaze-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF-', 139.9);
  END IF;

  -- Gewo Prithika Pavade Sense All+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Prithika Pavade Sense All+', 'gewo-prithika-pavade-sense-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 84.9);
  END IF;

  -- Gewo Matrixx ARC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Matrixx ARC OFF', 'gewo-matrixx-arc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 139.9);
  END IF;

  -- Gewo Matrixx Hybrid ARC Inner OFF-
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Matrixx Hybrid ARC Inner OFF-', 'gewo-matrixx-hybrid-arc-inner-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF-', 99.9);
  END IF;

  -- Gewo Matrixx Magic OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Matrixx Magic OFF', 'gewo-matrixx-magic-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 99.9);
  END IF;

  -- Gewo XOLO Offensive Carbon
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'XOLO Offensive Carbon', 'gewo-xolo-offensive-carbon', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 54.9);
  END IF;

  -- Gewo XOLO Offensive
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'XOLO Offensive', 'gewo-xolo-offensive', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 44.9);
  END IF;

  -- Gewo XOLO Allround
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'XOLO Allround', 'gewo-xolo-allround', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 34.9);
  END IF;

  -- Gewo Celexxis Fortissimo Carbon OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Celexxis Fortissimo Carbon OFF', 'gewo-celexxis-fortissimo-carbon-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 159.9);
  END IF;

  -- Gewo Celexxis Hinoki Ex-Carbon OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Celexxis Hinoki Ex-Carbon OFF', 'gewo-celexxis-hinoki-ex-carbon-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 144.9);
  END IF;

  -- Gewo Celexxis Offensive Classic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Celexxis Offensive Classic', 'gewo-celexxis-offensive-classic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 79.9);
  END IF;

  -- Gewo Celexxis Allround Classic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Celexxis Allround Classic', 'gewo-celexxis-allround-classic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 69.9);
  END IF;

  -- Gewo Scepter PKC
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Scepter PKC', 'gewo-scepter-pkc', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 126.9);
  END IF;

  -- Gewo In-force S-HAC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'In-force S-HAC OFF', 'gewo-in-force-s-hac-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 139.9);
  END IF;

  -- Gewo Power OFFense
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Power OFFense', 'gewo-power-offense', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 34.9);
  END IF;

  -- Gewo Zoom Balance ALL+ Enfant
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Zoom Balance ALL+ Enfant', 'gewo-zoom-balance-all-enfant', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 52.9);
  END IF;

  -- Gewo Aruna Carbon Basic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna Carbon Basic', 'gewo-aruna-carbon-basic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 52.9);
  END IF;

  -- Gewo Ex-Force PBO-PC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Ex-Force PBO-PC OFF', 'gewo-ex-force-pbo-pc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 134.9);
  END IF;

  -- Gewo In-Force PBO-PC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'In-Force PBO-PC OFF', 'gewo-in-force-pbo-pc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 134.9);
  END IF;

  -- Gewo In-Force ARC OFF-
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'In-Force ARC OFF-', 'gewo-in-force-arc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF-', 109.9);
  END IF;

  -- Gewo Robles Hinoki Ex-Carbon OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Robles Hinoki Ex-Carbon OFF', 'gewo-robles-hinoki-ex-carbon-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 139.9);
  END IF;

  -- Gewo OFFense Basic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'OFFense Basic', 'gewo-offense-basic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 34.9);
  END IF;

  -- Gewo Allround Basic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Allround Basic', 'gewo-allround-basic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 29.9);
  END IF;

  -- Gewo Aruna Hinoki Carbon OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna Hinoki Carbon OFF', 'gewo-aruna-hinoki-carbon-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 139.9);
  END IF;

  -- Gewo Aruna Energy ARC OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna Energy ARC OFF', 'gewo-aruna-energy-arc-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 109.9);
  END IF;

  -- Gewo Aruna OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna OFF', 'gewo-aruna-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 79.9);
  END IF;

  -- Gewo Aruna Carbon ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna Carbon ALL+', 'gewo-aruna-carbon-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 84.9);
  END IF;

  -- Gewo Aruna Kids
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Aruna Kids', 'gewo-aruna-kids', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 49.9);
  END IF;

  -- Gewo Sensus Powerfeeling
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Sensus Powerfeeling', 'gewo-sensus-powerfeeling', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 72.9);
  END IF;

  -- Gewo Sensus Carbo Touch
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Sensus Carbo Touch', 'gewo-sensus-carbo-touch', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 122.9);
  END IF;

  -- Gewo Sensus Carbo Speed
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Sensus Carbo Speed', 'gewo-sensus-carbo-speed', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 126.9);
  END IF;

  -- Gewo Metaltt Black ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Metaltt Black ALL+', 'gewo-metaltt-black-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 49.9);
  END IF;

  -- Gewo Zoom Balance All+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Zoom Balance All+', 'gewo-zoom-balance-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 52.9);
  END IF;

  -- Gewo Balsa Carbon 775
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Balsa Carbon 775', 'gewo-balsa-carbon-775', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 64.9);
  END IF;

  -- Gewo Balsa Carbon 575
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Balsa Carbon 575', 'gewo-balsa-carbon-575', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 64.9);
  END IF;

  -- Gewo Balsa Carbon 375
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Balsa Carbon 375', 'gewo-balsa-carbon-375', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 64.9);
  END IF;

  -- Gewo Hybrid Carbon A/Speed ALL+
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Hybrid Carbon A/Speed ALL+', 'gewo-hybrid-carbon-a-speed-all', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL+', 54.9);
  END IF;

  -- Gewo Hybrid Carbon M/Speed OFF-
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Hybrid Carbon M/Speed OFF-', 'gewo-hybrid-carbon-m-speed-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF-', 54.9);
  END IF;

  -- Gewo Hybrid Carbon X/Speed OFF
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Hybrid Carbon X/Speed OFF', 'gewo-hybrid-carbon-x-speed-off', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 59.9);
  END IF;

  -- Gewo Force ARC
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Force ARC', 'gewo-force-arc', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 109.9);
  END IF;

  -- Gewo Power Control
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Power Control', 'gewo-power-control', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 39.9);
  END IF;

  -- Gewo Youngster
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Youngster', 'gewo-youngster', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'OFF', 24.9);
  END IF;

  -- Gewo Zoom Pro
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Zoom Pro', 'gewo-zoom-pro', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 54.9);
  END IF;

  -- Gewo Velox Alpha Defense
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Velox Alpha Defense', 'gewo-velox-alpha-defense', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'DEF', 45.9);
  END IF;

  -- Gewo Allround Classic
  INSERT INTO produits (marque_id, nom, slug, actif)
  VALUES (gewo_id, 'Allround Classic', 'gewo-allround-classic', true)
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO prod_id;
  IF prod_id IS NOT NULL THEN
    INSERT INTO bois (produit_id, style, prix)
    VALUES (prod_id, 'ALL', 39.9);
  END IF;

END $$;

SELECT COUNT(*) FROM produits p JOIN bois b ON b.produit_id = p.id JOIN marques m ON m.id = p.marque_id WHERE m.nom ILIKE 'Gewo';