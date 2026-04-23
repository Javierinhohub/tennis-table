import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://zrwobhblvyxqqarilxde.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd29iaGJsdnl4cXFhcmlseGRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyOTIzMiwiZXhwIjoyMDkwNzA1MjMyfQ.3fgXBZB6B2CR1kyeH1O7yraBTWy31X0rfO4zk5CEM70"
)

// Compte les lignes dans chaque table principale
const tables = [
  "produits", "revetements", "bois", "marques",
  "avis", "notes_revetements", "notes_bois",
  "joueurs_pro", "articles", "utilisateurs",
  "produit_videos", "conversations", "messages"
]

for (const table of tables) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })
  if (error) console.log(`${table}: erreur (${error.message})`)
  else console.log(`${table}: ${count?.toLocaleString("fr-FR")} lignes`)
}
