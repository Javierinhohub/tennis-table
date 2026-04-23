const URL = "https://zrwobhblvyxqqarilxde.supabase.co"
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd29iaGJsdnl4cXFhcmlseGRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEyOTIzMiwiZXhwIjoyMDkwNzA1MjMyfQ.3fgXBZB6B2CR1kyeH1O7yraBTWy31X0rfO4zk5CEM70"

const tables = [
  "produits","revetements","bois","marques",
  "avis","notes_revetements","notes_bois",
  "joueurs_pro","articles","utilisateurs",
  "produit_videos","conversations","messages"
]

for (const table of tables) {
  try {
    const res = await fetch(`${URL}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        "apikey": KEY,
        "Authorization": `Bearer ${KEY}`,
        "Prefer": "count=exact",
        "Range": "0-0"
      }
    })
    const range = res.headers.get("content-range")
    const total = range ? range.split("/")[1] : "?"
    console.log(`${table.padEnd(22)} ${Number(total).toLocaleString("fr-FR")} lignes`)
  } catch(e) {
    console.log(`${table}: erreur`)
  }
}
