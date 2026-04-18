-- ══════════════════════════════════════════════════════════════
-- CORRECTION INBOX TT-KIP — À coller dans Supabase > SQL Editor
-- ══════════════════════════════════════════════════════════════
-- Ce script est complémentaire à supabase_messages.sql
-- Il peut être exécuté même si supabase_messages.sql a déjà été lancé.

-- 1. S'assurer que les tables existent (idempotent)
-- ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1  UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  participant_2  UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  CHECK (participant_1 < participant_2),
  UNIQUE (participant_1, participant_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
  contenu         TEXT NOT NULL CHECK (char_length(contenu) BETWEEN 1 AND 500),
  lu              BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conv_created_idx ON messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS conv_p1_idx ON conversations (participant_1);
CREATE INDEX IF NOT EXISTS conv_p2_idx ON conversations (participant_2);

-- 2. RLS sur conversations et messages
-- ──────────────────────────────────────────────────
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conv_select" ON conversations;
DROP POLICY IF EXISTS "conv_insert" ON conversations;
DROP POLICY IF EXISTS "conv_update" ON conversations;

-- SELECT : uniquement les conversations dont on est participant
CREATE POLICY "conv_select" ON conversations FOR SELECT TO authenticated
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- INSERT : on peut créer une conversation si on en est participant
CREATE POLICY "conv_insert" ON conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- UPDATE : nécessaire pour l'upsert (ON CONFLICT DO UPDATE)
-- On ne peut mettre à jour que ses propres conversations
CREATE POLICY "conv_update" ON conversations FOR UPDATE TO authenticated
  USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

DROP POLICY IF EXISTS "msg_select" ON messages;
DROP POLICY IF EXISTS "msg_insert" ON messages;
DROP POLICY IF EXISTS "msg_update" ON messages;

CREATE POLICY "msg_select" ON messages FOR SELECT TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "msg_insert" ON messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

CREATE POLICY "msg_update" ON messages FOR UPDATE TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
    )
  );

-- 3. CRITIQUE : autoriser la lecture des infos publiques des autres utilisateurs
-- ──────────────────────────────────────────────────────────────────────────────
-- Sans cette policy, la recherche de pseudo et l'affichage des interlocuteurs
-- ne fonctionnent pas (RLS bloque la lecture des rows des autres users).

DROP POLICY IF EXISTS "utilisateurs_read_public" ON utilisateurs;

CREATE POLICY "utilisateurs_read_public" ON utilisateurs
  FOR SELECT TO authenticated
  USING (true);
-- Note : cette policy donne accès aux colonnes publiques (pseudo, avatar, etc.)
-- Les données sensibles (email, etc.) ne doivent pas être dans cette table
-- ou doivent être dans une table séparée avec RLS plus strict.
-- Si vous préférez limiter les colonnes visibles, utilisez une VIEW à la place.

-- 4. Triggers (idempotent)
-- ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trim_messages_to_50()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM messages
  WHERE conversation_id = NEW.conversation_id
    AND id NOT IN (
      SELECT id FROM messages
      WHERE conversation_id = NEW.conversation_id
      ORDER BY created_at DESC
      LIMIT 50
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trim_messages_trigger ON messages;
CREATE TRIGGER trim_messages_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION trim_messages_to_50();

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conv_last_message ON messages;
CREATE TRIGGER update_conv_last_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
