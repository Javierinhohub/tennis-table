-- ══════════════════════════════════════════════════════════════
-- COMMENTAIRES ARTICLES — Supabase > SQL Editor > Run
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS commentaires_articles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  contenu    TEXT NOT NULL CHECK (char_length(contenu) BETWEEN 1 AND 1000),
  cree_le    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_article_idx ON commentaires_articles (article_id, cree_le DESC);

ALTER TABLE commentaires_articles ENABLE ROW LEVEL SECURITY;

-- Lecture : tout le monde
DROP POLICY IF EXISTS "comments_select" ON commentaires_articles;
CREATE POLICY "comments_select" ON commentaires_articles
  FOR SELECT USING (true);

-- Insertion : membres connectés uniquement
DROP POLICY IF EXISTS "comments_insert" ON commentaires_articles;
CREATE POLICY "comments_insert" ON commentaires_articles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Suppression : admins uniquement
DROP POLICY IF EXISTS "comments_delete" ON commentaires_articles;
CREATE POLICY "comments_delete" ON commentaires_articles
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM utilisateurs WHERE id = auth.uid() AND role = 'admin'
    )
  );
