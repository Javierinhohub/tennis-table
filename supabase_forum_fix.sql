-- ============================================================
-- SCRIPT DE CORRECTION DU FORUM TT-KIP
-- À exécuter dans : Supabase > SQL Editor
-- ============================================================

-- 1. ACTIVER RLS SUR LES TABLES DU FORUM
-- (si pas encore fait)
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_sujets ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reponses ENABLE ROW LEVEL SECURITY;


-- 2. LECTURE : tout le monde peut lire le forum (membres et visiteurs)
DROP POLICY IF EXISTS "forum_categories_select" ON forum_categories;
CREATE POLICY "forum_categories_select" ON forum_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "forum_sujets_select" ON forum_sujets;
CREATE POLICY "forum_sujets_select" ON forum_sujets
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "forum_reponses_select" ON forum_reponses;
CREATE POLICY "forum_reponses_select" ON forum_reponses
  FOR SELECT USING (true);


-- 3. INSERTION : tout membre connecté peut créer un sujet
DROP POLICY IF EXISTS "forum_sujets_insert" ON forum_sujets;
CREATE POLICY "forum_sujets_insert" ON forum_sujets
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- 4. INSERTION : tout membre connecté peut poster une réponse
DROP POLICY IF EXISTS "forum_reponses_insert" ON forum_reponses;
CREATE POLICY "forum_reponses_insert" ON forum_reponses
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );


-- 5. MISE À JOUR : réservée aux administrateurs (épingler, fermer)
DROP POLICY IF EXISTS "forum_sujets_update_admin" ON forum_sujets;
CREATE POLICY "forum_sujets_update_admin" ON forum_sujets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- 6. SUPPRESSION : réservée aux administrateurs
DROP POLICY IF EXISTS "forum_sujets_delete_admin" ON forum_sujets;
CREATE POLICY "forum_sujets_delete_admin" ON forum_sujets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "forum_reponses_delete_admin" ON forum_reponses;
CREATE POLICY "forum_reponses_delete_admin" ON forum_reponses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM utilisateurs
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- 7. FONCTION : incrémenter les vues (contourne le RLS pour cette action)
-- Permet aux visiteurs de mettre à jour le compteur de vues sans droits UPDATE
CREATE OR REPLACE FUNCTION increment_forum_views(sujet_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE forum_sujets
  SET vues = COALESCE(vues, 0) + 1
  WHERE id = sujet_id;
END;
$$;


-- 8. COLONNE role dans utilisateurs (si elle n'existe pas encore)
-- À n'exécuter QUE si la colonne 'role' n'existe pas déjà dans votre table utilisateurs
-- ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- Pour vous définir comme admin (remplacez votre_email@example.com) :
-- UPDATE utilisateurs SET role = 'admin' WHERE email = 'votre_email@example.com';
-- OU par user_id :
-- UPDATE utilisateurs SET role = 'admin' WHERE id = 'votre-user-id-supabase';
