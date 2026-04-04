const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const NOTES = [
  { marque: "Kokutaku", produits: [
    { nom: "Spindle", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Kokutaku haut de gamme. Excellent spin et vitesse. Populaire en Asie et en Europe." },
    { nom: "Synchron", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent Kokutaku. Excellent contrôle, idéal pour allround." },
    { nom: "Spec-V", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor Kokutaku offensif. Bon équilibre général, compétitif pour la compétition." },
    { nom: "G-10", vitesse: 7, effet: 7, controle: 9, mv: 7, ms: 7, mc: 9, md: 5, commentaire: "Classique Kokutaku. Bon contrôle, idéal pour débutants et joueurs en progression." },
  ]},
  { marque: "Neottec", produits: [
    { nom: "Enkei", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Neottec haut de gamme. Excellent spin et vitesse. Populaire en Europe centrale." },
    { nom: "Katana", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor offensif premium Neottec. Vitesse et spin élevés. Pour attaquants avancés." },
    { nom: "Tokkan", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor polyvalent Neottec. Meilleur contrôle, idéal en revers. Fiable et durable." },
    { nom: "Iken", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement allround Neottec. Excellent contrôle, bon spin. Pour joueurs en progression." },
    { nom: "X5", vitesse: 9, effet: 9, controle: 7, mv: 9, ms: 9, mc: 7, md: 8, commentaire: "Tensor ultra-offensif Neottec. Vitesse maximale. Pour attaquants purs." },
  ]},
  { marque: "Palio", produits: [
    { nom: "HK1997", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Revêtement chinois collant style DHS. Excellent spin en service, très populaire en Asie." },
    { nom: "CK531A", vitesse: 7, effet: 9, controle: 8, mv: 7, ms: 9, mc: 8, md: 8, commentaire: "Feuille collante Palio. Spin maximal en service et topspin. Style chinois pur." },
    { nom: "Flying Dragon", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent Palio. Bon contrôle et spin. Excellent rapport qualité/prix." },
    { nom: "Macro", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor Palio classique. Bon équilibre général. Populaire pour la compétition club." },
    { nom: "Power Dragon", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Palio offensif. Bon dynamisme et spin. Pour attaquants cherchant puissance." },
  ]},
  { marque: "Juic", produits: [
    { nom: "999", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Classique Juic. Très accrochant, excellent contrôle. Standard japonais pour allround." },
    { nom: "999 Elite", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version haut de gamme du 999. Plus dynamique, meilleur spin. Pour compétition." },
    { nom: "Nanospin", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Juic moderne. Bon spin et vitesse. Pour joueurs offensifs avancés." },
    { nom: "Neo Galaxia", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 4, commentaire: "Picots longs Juic. Perturbation élevée. Pour défenseurs et bloqueurs." },
    { nom: "Progalaxia", vitesse: 7, effet: 6, controle: 8, mv: 7, ms: 6, mc: 8, md: 5, commentaire: "Picots longs offensifs Juic. Plus de vitesse, bon rejet. Pour défenseurs modernes." },
    { nom: "Driva Smash Ultima", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor Juic polyvalent. Bon équilibre. Pour joueurs cherchant dynamisme et contrôle." },
  ]},
  { marque: "Gambler", produits: [
    { nom: "Aces", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Revêtement Gambler polyvalent. Bon équilibre général. Pour joueurs allround en compétition." },
    { nom: "Volt Speed", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor Gambler offensif rapide. Vitesse et spin élevés. Pour attaquants avancés." },
    { nom: "Volt-M", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Gambler équilibré. Bon spin et contrôle. Pour joueurs cherchant polyvalence." },
    { nom: "Burst", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Gambler dynamique. Bon spin et vitesse. Pour attaquants cherchant puissance abordable." },
    { nom: "GXL", vitesse: 9, effet: 9, controle: 7, mv: 9, ms: 9, mc: 7, md: 8, commentaire: "Tensor haut de gamme Gambler. Vitesse et spin maximaux. Pour attaquants confirmés." },
    { nom: "Big Gun", vitesse: 9, effet: 8, controle: 7, mv: 9, ms: 8, mc: 7, md: 8, commentaire: "Tensor ultra-rapide Gambler. Vitesse maximale. Pour attaquants purs cherchant puissance." },
    { nom: "Nine Ultra Tack", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Feuille collante Gambler. Style chinois, excellent spin. Pour joueurs de style asiatique." },
  ]},
]

async function main() {
  console.log('🏓 Import marques 4...')
  let totalSuccess = 0, totalNotFound = 0

  for (const { marque: marqueNom, produits: notes } of NOTES) {
    console.log(`\n📦 ${marqueNom}...`)
    const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + marqueNom + '%')
    if (!marques || marques.length === 0) { console.log('❌ Marque non trouvée'); continue }
    const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marques[0].id)
    if (!produits) continue

    for (const note of notes) {
      const mots = note.nom.toLowerCase().split(' ')
      let prod = produits.find(p => p.nom.toLowerCase() === note.nom.toLowerCase())
      if (!prod) prod = produits.find(p => p.nom.toLowerCase().includes(note.nom.toLowerCase()))
      if (!prod) prod = produits.find(p => mots.filter(m => m.length > 2).every(m => p.nom.toLowerCase().includes(m)))

      if (!prod) { console.log(`  ❌ Non trouvé : ${note.nom}`); totalNotFound++; continue }

      const { error } = await s.from('revetements').update({
        vitesse_note: note.vitesse, effet_note: note.effet, controle_note: note.controle,
        note_marque_vitesse: note.mv, note_marque_spin: note.ms,
        note_marque_controle: note.mc, note_marque_durete: note.md,
        commentaire_marque: note.commentaire,
      }).eq('produit_id', prod.id)

      if (!error) { console.log(`  ✅ ${prod.nom} → V:${note.vitesse} E:${note.effet} C:${note.controle}`); totalSuccess++ }
      else console.log(`  ⚠️  Erreur: ${error.message}`)
    }
  }

  console.log(`\n🎉 Terminé ! ${totalSuccess} mis à jour, ${totalNotFound} non trouvés.`)
}

main().catch(console.error)
