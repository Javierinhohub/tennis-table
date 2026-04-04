const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const CORRECTIONS = [
  { marque: "Palio", notes: [
    { nom: "Hurricane", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 7, commentaire: "Revêtement polyvalent Palio. Bon contrôle, idéal pour joueurs en progression." },
  ]},
  { marque: "Dr Neubauer", notes: [
    { nom: "Dominance Spin", vitesse: 9, effet: 10, controle: 7, mv: 9, ms: 10, mc: 7, md: 9, commentaire: "Chinois rapide légèrement collant. Spin maximal en service et topspin. Mousse dure 47°. Arme offensive moderne." },
  ]},
  { marque: "TSP", notes: [
    { nom: "Curl", vitesse: 5, effet: 3, controle: 8, mv: 5, ms: 3, mc: 8, md: 3, commentaire: "Picots longs classiques TSP. Perturbation maximale. Standard mondial pour défenseurs et bloqueurs." },
  ]},
  { marque: "Andro", notes: [
    { nom: "Rasanter V42", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Andro nouvelle génération 42°. Excellent équilibre, très dynamique. Pour joueurs polyvalents avancés." },
    { nom: "Rasanter V47", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor Andro nouvelle génération 47°. Vitesse et spin élevés. Pour attaquants confirmés." },
  ]},
  { marque: "Neottec", notes: [
    { nom: "Enkurs", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Neottec haut de gamme. Excellent spin et vitesse. Populaire en Europe centrale et de l'est." },
    { nom: "Maxima", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor offensif Neottec. Vitesse et spin élevés. Pour attaquants avancés cherchant dynamisme." },
  ]},
  { marque: "Juic", notes: [
    { nom: "Leggy", vitesse: 5, effet: 4, controle: 8, mv: 5, ms: 4, mc: 8, md: 3, commentaire: "Picots longs Juic. Perturbation classique. Pour défenseurs et bloqueurs cherchant variations d'effet." },
    { nom: "Dany V", vitesse: 7, effet: 6, controle: 8, mv: 7, ms: 6, mc: 8, md: 5, commentaire: "Picots courts Juic. Jeu de bloc et contre-attaque. Pour joueurs cherchant variations tactiques." },
  ]},
]

const NOUVELLES_MARQUES = {
  "Kokutaku": [
    { nom: "Bolt", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Kokutaku classique. Bon équilibre vitesse/spin. Populaire en Asie et en Europe." },
    { nom: "007", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent Kokutaku. Excellent contrôle, idéal pour allround et joueurs en progression." },
  ],
  "Giant Dragon": [
    { nom: "Superspin G5", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Classique chinois abordable. Bon contrôle et spin, excellent rapport qualité/prix pour débutants." },
    { nom: "Blast", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor Giant Dragon offensif. Bon équilibre général, compétitif pour le prix." },
  ],
  "Hallmark": [
    { nom: "Devil Anti", vitesse: 4, effet: 3, controle: 9, mv: 4, ms: 3, mc: 9, md: 3, commentaire: "Anti-spin Hallmark. Perturbation maximale de l'effet adverse. Contrôle élevé. Pour défenseurs." },
    { nom: "Key", vitesse: 7, effet: 8, controle: 8, mv: 7, ms: 8, mc: 8, md: 6, commentaire: "Tensor Hallmark polyvalent. Bon équilibre, rapport qualité/prix intéressant." },
  ],
  "Gambler": [
    { nom: "Burst", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Gambler offensif. Bon spin et vitesse. Pour attaquants cherchant dynamisme à prix abordable." },
    { nom: "Aces Blue", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Revêtement Gambler polyvalent. Bon équilibre général. Pour joueurs allround en compétition." },
  ],
  "Neottec": [
    { nom: "Enkurs", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Neottec haut de gamme. Excellent spin et vitesse. Populaire en Europe centrale." },
    { nom: "Maxima", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor offensif premium Neottec. Vitesse et spin élevés. Pour attaquants avancés." },
    { nom: "Qari", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor polyvalent Neottec. Meilleur contrôle, idéal en revers. Fiable et durable." },
  ],
  "Dawei": [
    { nom: "388D-1", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 4, commentaire: "Picots longs Dawei classiques. Perturbation élevée. Pour défenseurs cherchant variations d'effet." },
    { nom: "Saviga V", vitesse: 7, effet: 6, controle: 8, mv: 7, ms: 6, mc: 8, md: 5, commentaire: "Picots longs offensifs Dawei. Plus de vitesse que le 388D. Pour défenseurs modernes." },
  ],
}

async function main() {
  console.log('🏓 Import corrections et nouvelles marques...')
  let totalSuccess = 0, totalNotFound = 0

  // Corrections
  for (const { marque: marqueNom, notes } of CORRECTIONS) {
    const searchNom = marqueNom.split('/')[0].split('&')[0].trim()
    const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + searchNom + '%')
    if (!marques || marques.length === 0) continue
    const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marques[0].id)
    if (!produits) continue

    for (const note of notes) {
      const mots = note.nom.toLowerCase().split(' ')
      let prod = produits.find(p => p.nom.toLowerCase() === note.nom.toLowerCase())
      if (!prod) prod = produits.find(p => mots.every(m => p.nom.toLowerCase().includes(m)))
      if (!prod) prod = produits.find(p => mots.filter(m => m.length > 2).some(m => p.nom.toLowerCase().includes(m)))

      if (!prod) { console.log(`❌ Non trouvé : ${marqueNom} - ${note.nom}`); totalNotFound++; continue }

      const { error } = await s.from('revetements').update({
        vitesse_note: note.vitesse, effet_note: note.effet, controle_note: note.controle,
        note_marque_vitesse: note.mv, note_marque_spin: note.ms,
        note_marque_controle: note.mc, note_marque_durete: note.md,
        commentaire_marque: note.commentaire,
      }).eq('produit_id', prod.id)

      if (!error) { console.log(`✅ ${prod.nom} → V:${note.vitesse} E:${note.effet} C:${note.controle}`); totalSuccess++ }
    }
  }

  // Nouvelles marques
  for (const [marqueNom, notes] of Object.entries(NOUVELLES_MARQUES)) {
    console.log(`\n📦 ${marqueNom}...`)
    const searchNom = marqueNom.split('/')[0].trim()
    const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + searchNom + '%')
    if (!marques || marques.length === 0) { console.log(`❌ Marque non trouvée`); totalNotFound += notes.length; continue }
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
    }
  }

  console.log(`\n🎉 Terminé ! ${totalSuccess} mis à jour, ${totalNotFound} non trouvés.`)
}

main().catch(console.error)
