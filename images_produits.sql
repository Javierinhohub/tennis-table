-- ══════════════════════════════════════════════════════════════════
-- Images produits — revêtements & bois
-- Source : pages officielles DONIC (donic.com)
-- Exécuter dans Supabase → SQL Editor
-- NB : les UPDATE sans correspondance n'affectent aucune ligne (pas d'erreur)
-- ══════════════════════════════════════════════════════════════════

-- ─── Helper : id marque DONIC ─────────────────────────────────────
-- On utilise une sous-requête inline pour éviter les hard-coded UUIDs

-- ══════════════════════════════════════════════════════════════════
-- REVÊTEMENTS DONIC
-- ══════════════════════════════════════════════════════════════════

-- Série BlueStar (top de gamme)
UPDATE produits SET image_url = 'https://www.donic.com/media/c9/c7/79/1669040888/donic-rubber_bluestar_a1.jpg'
WHERE nom ILIKE '%BlueStar A1%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/21/ac/2d/1687185042/donic-rubber_bluestar_a2-web.jpg'
WHERE nom ILIKE '%BlueStar A2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/7e/50/96/1687185042/donic-rubber_bluestar_a3-web.jpg'
WHERE nom ILIKE '%BlueStar A3%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série BlueStar BlueGrip J (2024-2026)
UPDATE produits SET image_url = 'https://www.donic.com/media/8e/80/62/1741083552/DONIC_BLUEGRIP-J1_Cover.jpg'
WHERE nom ILIKE '%BlueGrip J1%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/d1/d7/f7/1741085201/DONIC_BLUEGRIP-J2_Cover.jpg'
WHERE nom ILIKE '%BlueGrip J2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/30/0d/a0/1741094536/DONIC_BLUEGRIP-J3_Cover.jpg'
WHERE nom ILIKE '%BlueGrip J3%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Bluestorm
UPDATE produits SET image_url = 'https://www.donic.com/media/50/a1/aa/1669040863/donic-rubber_bluestorm_z1_turbo-web.jpg'
WHERE nom ILIKE '%Bluestorm Z1 Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/85/7c/3b/1669040851/donic-rubber_bluestorm_z1-web.jpg'
WHERE nom ILIKE '%Bluestorm Z1%' AND nom NOT ILIKE '%Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/c2/90/9c/1669040851/donic-rubber_bluestorm_z2-web.jpg'
WHERE nom ILIKE '%Bluestorm Z2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/ca/8f/09/1669040852/donic-rubber_bluestorm_z3-web.jpg'
WHERE nom ILIKE '%Bluestorm Z3%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/f3/aa/4b/1669040856/donic-rubber_bluestorm_bigslam-webchworhvmsmvdt.jpg'
WHERE nom ILIKE '%Bluestorm Big Slam%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/ae/28/02/1669040853/donic-rubber_bluestorm_pro_am-web.jpg'
WHERE nom ILIKE '%Bluestorm Pro AM%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/97/01/79/1669040852/donic-rubber_bluestorm_pro-web.jpg'
WHERE nom ILIKE '%Bluestorm Pro%' AND nom NOT ILIKE '%AM%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Bluefire
UPDATE produits SET image_url = 'https://www.donic.com/media/03/55/81/1669040850/donic-rubber_bluefire_m1_turbo-webhcldlldspo75z.jpg'
WHERE nom ILIKE '%Bluefire M1 Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/9e/16/93/1669040832/donic-rubber_bluefire_m1-web.jpg'
WHERE nom ILIKE '%Bluefire M1%' AND nom NOT ILIKE '%Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/8c/a8/c9/1669040836/donic-rubber_bluefire_m2-web.jpg'
WHERE nom ILIKE '%Bluefire M2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/45/73/43/1669040837/donic-rubber_bluefire_m3-webkljsezojhp0re.jpg'
WHERE nom ILIKE '%Bluefire M3%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série BlueGrip C/S
UPDATE produits SET image_url = 'https://www.donic.com/media/be/e6/b7/1669040853/donic-rubber_bluegrip_c1-web.jpg'
WHERE nom ILIKE '%BlueGrip C1%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/b7/f1/c7/1669040852/donic-rubber_bluegrip_c2-web.jpg'
WHERE nom ILIKE '%BlueGrip C2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/6b/76/bb/1669040859/donic-rubber_bluegrip_s1.jpg'
WHERE nom ILIKE '%BlueGrip S1%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/f1/5a/8e/1669040888/donic-rubber_bluegrip_s2-web.jpg'
WHERE nom ILIKE '%BlueGrip S2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Acuda
UPDATE produits SET image_url = 'https://www.donic.com/media/57/64/3f/1669040722/donic-rubber_acuda_s1_turbo-web.jpg'
WHERE nom ILIKE '%Acuda S1 Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/00/14/40/1669040706/donic-rubber_acuda_s1-web.jpg'
WHERE nom ILIKE '%Acuda S1%' AND nom NOT ILIKE '%Turbo%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/57/ec/92/1669040711/donic-rubber_acuda_s2-web.jpg'
WHERE nom ILIKE '%Acuda S2%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');


-- ══════════════════════════════════════════════════════════════════
-- BOIS DONIC
-- ══════════════════════════════════════════════════════════════════

-- Série Zhang Jike
UPDATE produits SET image_url = 'https://www.donic.com/media/1c/b0/dc/1781085653/donic-blade-zhang-jike-true-carbon-front.jpg'
WHERE nom ILIKE '%Zhang Jike True Carbon%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/35/b8/58/1741077368/donic-blade-zhang-jike-original-carbon-concave-front.jpg'
WHERE nom ILIKE '%Zhang Jike Original Carbon%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/a2/g0/77/1741082085/donic-blade-zhang-jike-new-era-concave-front.jpg'
WHERE nom ILIKE '%Zhang Jike New Era%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Waldner
UPDATE produits SET image_url = 'https://www.donic.com/media/b3/fc/c6/1669040831/donic-blade_jo_waldner-diagonal-web.jpg'
WHERE nom ILIKE '%Waldner Gold Edition%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/40/cb/7f/1669040787/donic-blade_waldner_off_world_champion_89-web.jpg'
WHERE nom ILIKE '%Waldner OFF%World Champion%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Senso Carbon (si présent en base — nom peut varier)
-- UPDATE produits SET image_url = '...'
-- WHERE nom ILIKE '%Waldner Senso Carbon%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Persson
UPDATE produits SET image_url = 'https://www.donic.com/media/27/e9/e3/1720513613/donic-blade-persson-40-jubilee-diagonal-straight-web.jpg'
WHERE nom ILIKE '%Persson Jubilee%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/f3/2c/3d/1669040786/donic-blade_persson_off_plus_world_champion_89-webca8o8shd3kexx.jpg'
WHERE nom ILIKE '%Persson OFF%World Champion%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Anders Lind
UPDATE produits SET image_url = 'https://www.donic.com/media/32/1c/c3/1781097371/donic-blade-anders-lind-exceptional-front.jpg'
WHERE nom ILIKE '%Anders Lind Exceptional%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/fe/93/98/1720519897/donic-blade-anders-lind-hexa-carbon-topview-concave-web.jpg'
WHERE nom ILIKE '%Anders Lind Hexa Carbon%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Appelgren
UPDATE produits SET image_url = 'https://www.donic.com/media/66/24/ec/1669040747/donic-blade_appelgren_allround_plus_worldchampion_89-web.jpg'
WHERE nom ILIKE '%Appelgren%World Champion%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Classic (prix abordable)
UPDATE produits SET image_url = 'https://www.donic.com/media/02/a1/61/1669040729/donic-blade_dc_classic_powerallround_diagonal.jpg'
WHERE nom ILIKE '%Classic Power Allround%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/38/69/75/1669040749/donic-blade_dc_classic_allround_diagonal.jpg'
WHERE nom ILIKE '%Classic Allround%' AND nom NOT ILIKE '%Power%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/25/c9/49/1669040725/donic-blade_dc_classic_offensive_diagonal.jpg'
WHERE nom ILIKE '%Classic Offensive%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Original
UPDATE produits SET image_url = 'https://www.donic.com/media/b1/46/a9/1669040781/donic-blade_original_true_carbon_inner-diagonal-web.jpg'
WHERE nom ILIKE '%Original True Carbon Inner%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/41/61/07/1669040764/donic-blade-original_true_carbon-web.jpg'
WHERE nom ILIKE '%Original True Carbon%' AND nom NOT ILIKE '%Inner%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/3b/36/2a/1669040828/donic-blade-original_no1_senso-web.jpg'
WHERE nom ILIKE '%Original No%1%Senso%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/b8/0b/57/1669040830/donic-blade-original_no1-web.jpg'
WHERE nom ILIKE '%Original No%1%' AND nom NOT ILIKE '%Senso%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Xtreme / Whiper / Defplay
UPDATE produits SET image_url = 'https://www.donic.com/media/34/f1/e0/1687185045/donic-blade_xtreme_concave-diagonal-web7c549.jpg'
WHERE nom ILIKE '%Xtreme%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/8c/d4/b7/1720439648/donic-blade-whiper-outer-carbon-diagonal-web.jpg'
WHERE nom ILIKE '%Whiper Outer%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/ce/74/e0/1720441731/donic-blade-whiper-inner-carbon-diagonal-web.jpg'
WHERE nom ILIKE '%Whiper Inner%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/26/01/70/1720443985/donic-blade-defplay-inner-carbon-diagonal-web.jpg'
WHERE nom ILIKE '%Defplay Inner%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Série Balsa Carbo
UPDATE produits SET image_url = 'https://www.donic.com/media/fb/7e/87/1669040859/donic-blade_balsa_carbo_fleece-web.jpg'
WHERE nom ILIKE '%Balsa Carbo Fleece%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

UPDATE produits SET image_url = 'https://www.donic.com/media/99/8c/5f/1669040818/donic-blade_balsa_carbo_certran_fibre-diagonal-web.jpg'
WHERE nom ILIKE '%Balsa Carbo Certran%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');

-- Divers
UPDATE produits SET image_url = 'https://www.donic.com/media/1b/11/95/1669040797/donic-blade-new_impuls_6_5-02-web.jpg'
WHERE nom ILIKE '%New Impuls%' AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DONIC');


-- ══════════════════════════════════════════════════════════════════
-- BUTTERFLY — revêtements (source : revspin.net, images communautaires)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-tenergy-05.jpg'
WHERE nom ILIKE '%Tenergy 05%' AND nom NOT ILIKE '%Hard%' AND nom NOT ILIKE '%FX%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-tenergy-05-hard.jpg'
WHERE nom ILIKE '%Tenergy 05 Hard%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-tenergy-64.jpg'
WHERE nom ILIKE '%Tenergy 64%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-tenergy-80.jpg'
WHERE nom ILIKE '%Tenergy 80%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-dignics-05.jpg'
WHERE nom ILIKE '%Dignics 05%' AND nom NOT ILIKE '%09%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/rubber/butterfly-dignics-09c.jpg'
WHERE nom ILIKE '%Dignics 09C%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ══════════════════════════════════════════════════════════════════
-- BUTTERFLY — bois (source : revspin.net)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://revspin.net/images/blade/butterfly-timo-boll-alc.jpg'
WHERE nom ILIKE '%Timo Boll ALC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/blade/butterfly-innerforce-layer-alc.jpg'
WHERE nom ILIKE '%Innerforce Layer ALC%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

UPDATE produits SET image_url = 'https://revspin.net/images/blade/butterfly-viscaria.jpg'
WHERE nom ILIKE '%Viscaria%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Butterfly');

-- ══════════════════════════════════════════════════════════════════
-- TIBHAR — revêtements (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/8/4/8425_Evolution-MX-P_jpg.jpg'
WHERE nom ILIKE '%Evolution MX-P%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/3/3/3341_oOxUAFwPmGPo_jpg.jpg'
WHERE nom ILIKE '%Evolution MX-S%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/8/4/8439_Tibhar-Evolution-EL-P-1_jpg.jpg'
WHERE nom ILIKE '%Evolution EL-P%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Tibhar');

-- ══════════════════════════════════════════════════════════════════
-- YASAKA — revêtements (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/8/9898_Rakza7-4_jpg.jpg'
WHERE nom ILIKE '%Rakza 7%' AND nom NOT ILIKE '%Soft%' AND nom NOT ILIKE '%9%' AND nom NOT ILIKE '%X%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/8/9879_Yasaka-Rakza-9-1_jpg.jpg'
WHERE nom ILIKE '%Rakza 9%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/5/1/5163_5163_5d4027e0c914e6_81030847_KytxIoZ1K4VC_jpg_1.jpg'
WHERE nom ILIKE '%Rakza X%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Yasaka');

-- ══════════════════════════════════════════════════════════════════
-- XIOM — revêtements (TT11 pour Europe/Asia, revspin pour Vega Pro)
-- ══════════════════════════════════════════════════════════════════

-- Vega Pro : page TT11 inaccessible → revspin.net
UPDATE produits SET image_url = 'https://revspin.net/images/rubber/xiom-vega-pro.jpg'
WHERE nom ILIKE '%Vega Pro%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Xiom');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/0/9034_9034_5901b3c69ed123_47777344_2_20Vega_20Europe_20_282_29_jpg_2.jpg'
WHERE nom ILIKE '%Vega Europe%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Xiom');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/0/9048_9048_5901b4129d94f9_77471420_3_20Vega_20Asia_20_282_29_jpg_2.jpg'
WHERE nom ILIKE '%Vega Asia%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Xiom');

-- ══════════════════════════════════════════════════════════════════
-- DHS — revêtements (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/4/9438_9438_5acddc5591fd52_72499519_hurricane-3_jpg_1.jpg'
WHERE (nom ILIKE '%Hurricane 3%' OR nom ILIKE '%Hurricane III%')
  AND nom NOT ILIKE '%Neo%' AND nom NOT ILIKE '%NEO%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DHS');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/4/9433_9433_63f34e95249250_16825414_Image_20_2812_29_20copy_jpg_1.jpg'
WHERE (nom ILIKE '%NEO Hurricane 3%' OR nom ILIKE '%Hurricane 3 NEO%'
       OR nom ILIKE '%Hurricane NEO%' OR nom ILIKE '%Neo Hurricane%')
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'DHS');

-- ══════════════════════════════════════════════════════════════════
-- ANDRO — revêtements (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/1/3/13225_R42-23_jpg.jpg'
WHERE nom ILIKE '%Rasanter R42%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Andro');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/1/3/13232_R47-14_jpg.jpg'
WHERE nom ILIKE '%Rasanter R47%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Andro');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/1/3/13239_R50-19_jpg.jpg'
WHERE nom ILIKE '%Rasanter R50%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Andro');

-- ══════════════════════════════════════════════════════════════════
-- JOOLA — revêtements (TT11 pour Dynaryz AGR, revspin pour Rhyzm)
-- ══════════════════════════════════════════════════════════════════

-- Rhyzm : page TT11 inaccessible → revspin.net
UPDATE produits SET image_url = 'https://revspin.net/images/rubber/joola-rhyzm.jpg'
WHERE nom ILIKE '%Rhyzm%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/2/1/21022_21022_5e5763acce7345_77150468_70511_DYNARYZ-AGR_jpg_1.jpg'
WHERE nom ILIKE '%Dynaryz AGR%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Joola');

-- ══════════════════════════════════════════════════════════════════
-- STIGA — bois (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/2/8/28906_28906_64634afa125187_53433347_SAM01575_jpg_1.jpg'
WHERE nom ILIKE '%Cybershape%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/1/1/11331_Clipper-Wood_jpg.jpg'
WHERE nom ILIKE '%Clipper%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/8/1/8150_8150_59d3557f2be153_96755918_IMG_4916-infinity_jpg_1.jpg'
WHERE nom ILIKE '%Infinity VPS%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/s/t/stiga_carbonado_45_24372.jpg'
WHERE nom ILIKE '%Carbonado 45%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/4/5/4582_Carbonado-145_jpg.jpg'
WHERE nom ILIKE '%Carbonado 145%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/4/5/4577_Carbonado-190_jpg.jpg'
WHERE nom ILIKE '%Carbonado 190%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');

-- ══════════════════════════════════════════════════════════════════
-- STIGA — revêtements (source : tabletennis11.com)
-- ══════════════════════════════════════════════════════════════════

UPDATE produits SET image_url = 'https://static.tabletennis11.com/media/catalog/product/cache/6517c62f5899ad6aa0ba23ceb3eeff97/9/6/9653_BLMIoPoOaXv8_jpg_1.jpg'
WHERE nom ILIKE '%Calibra LT Sound%'
  AND marque_id = (SELECT id FROM marques WHERE nom ILIKE 'Stiga');


-- ══════════════════════════════════════════════════════════════════
-- VÉRIFICATION GLOBALE
-- ══════════════════════════════════════════════════════════════════
SELECT p.nom, m.nom AS marque, p.image_url
FROM produits p
JOIN marques m ON m.id = p.marque_id
WHERE p.image_url IS NOT NULL
ORDER BY m.nom, p.nom;
