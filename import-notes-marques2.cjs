const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const NOTES_PAR_MARQUE = {
  "Friendship": [
    { nom: "729", vitesse: 6, effet: 8, controle: 9, mv: 7, ms: 8, mc: 8, md: 7, commentaire: "Classique chinois. Feuille collante, adhérence élevée. Idéal pour apprendre les effets et le jeu allround. Dureté 44°." },
    { nom: "729 FX", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Version souple du 729. Excellent contrôle, idéal pour débutants et joueurs en progression." },
    { nom: "Super", vitesse: 7, effet: 9, controle: 8, mv: 7, ms: 9, mc: 8, md: 8, commentaire: "Le plus célèbre des revêtements chinois 729. Grande adhérence, extraordinaire pour la frappe et la rotation." },
    { nom: "Battle 2", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor 729 haut de gamme. Mousse bleue dynamique, excellent spin et vitesse. Pour joueurs avancés." },
    { nom: "755", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement classique polyvalent. Bon contrôle et spin, idéal pour le jeu allround." },
    { nom: "Faster", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor 729 dynamique. Bon équilibre vitesse/spin. Pour joueurs cherchant plus de dynamisme." },
  ],
  "Palio": [
    { nom: "CJ8000", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Meilleur rapport qualité/prix du marché chinois. Tensor compétitif, bon spin et vitesse. Très populaire en club." },
    { nom: "Hadou", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme Palio. Vitesse et spin élevés, très compétitif face aux grandes marques." },
    { nom: "Tango", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 7, commentaire: "Revêtement polyvalent Palio. Bon contrôle, idéal pour joueurs en progression cherchant régularité." },
    { nom: "AK47", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor offensif Palio. Très dynamique, excellent en topspin. Pour attaquants avancés." },
  ],
  "Sanwei": [
    { nom: "Target National", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor chinois haut de gamme. Mousse bleue très dynamique, excellent spin. Très bon rapport qualité/prix." },
    { nom: "Taiji", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor Sanwei polyvalent. Bon équilibre vitesse/spin. Populaire chez les joueurs de style chinois en Europe." },
    { nom: "T88", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Classique Sanwei. Excellent contrôle, bon spin. Idéal pour joueurs en progression ou allround." },
  ],
  "Dr Neubauer": [
    { nom: "Dominance", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 6, commentaire: "Surface très adhérente non collante. Maximum d'effets, vitesse élevée. Mousse souple 38°. Idéal avec picots de l'autre côté." },
    { nom: "Domination Spin Hard", vitesse: 9, effet: 10, controle: 7, mv: 9, ms: 10, mc: 7, md: 9, commentaire: "Chinois rapide légèrement collant. Spin maximal en service et topspin. Mousse dure 47°. Arme offensive moderne." },
    { nom: "Killer", vitesse: 5, effet: 4, controle: 7, mv: 5, ms: 4, mc: 7, md: 4, commentaire: "Picots longs classiques Dr Neubauer. Perturbation maximale, désorientation de l'adversaire. Pour défenseurs." },
    { nom: "Explosion", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 4, commentaire: "Picots longs offensifs. Plus de vitesse que le Killer tout en conservant la perturbation de l'effet." },
    { nom: "Rhino", vitesse: 4, effet: 3, controle: 8, mv: 4, ms: 3, mc: 8, md: 3, commentaire: "Anti-spin classique. Inversion totale de l'effet adverse. Pour défenseurs et joueurs perturbateurs." },
    { nom: "Desperado", vitesse: 7, effet: 6, controle: 7, mv: 7, ms: 6, mc: 7, md: 5, commentaire: "Picots courts offensifs. Idéal pour les attaques directes et le bloc agressif. Bon rejet." },
  ],
  "Spinlord": [
    { nom: "Waran", vitesse: 5, effet: 4, controle: 8, mv: 5, ms: 4, mc: 8, md: 4, commentaire: "Picots longs classiques. Excellente perturbation, variations d'effet imprévisibles. Pour défenseurs." },
    { nom: "Dornenglanz", vitesse: 6, effet: 5, controle: 7, mv: 6, ms: 5, mc: 7, md: 4, commentaire: "Picots longs offensifs. Plus de vitesse, bon rejet. Pour défenseurs modernes cherchant contre-attaque." },
    { nom: "Irbis", vitesse: 7, effet: 6, controle: 8, mv: 7, ms: 6, mc: 8, md: 5, commentaire: "Picots courts Spinlord. Jeu de bloc agressif et contre-attaque. Pour joueurs cherchant variations tactiques." },
    { nom: "Gigant", vitesse: 3, effet: 2, controle: 8, mv: 3, ms: 2, mc: 8, md: 3, commentaire: "Anti-spin. Perturbation maximale, vitesse très réduite. Pour défenseurs et joueurs très perturbateurs." },
    { nom: "Marder", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 5, commentaire: "Picots longs polyvalents. Bon équilibre perturbation/contrôle. Pour défenseurs modernes." },
  ],
  "Sauer & Troeger": [
    { nom: "Hellfire", vitesse: 6, effet: 5, controle: 7, mv: 6, ms: 5, mc: 7, md: 4, commentaire: "Picots longs classiques. Perturbation élevée, variations d'effet imprévisibles. Pour défenseurs confirmés." },
    { nom: "Secret Flow", vitesse: 6, effet: 7, controle: 9, mv: 6, ms: 7, mc: 9, md: 5, commentaire: "Revêtement très adhérent, contrôle élevé, sans restitution d'énergie. Parfait pour défense moderne et chops lourds." },
    { nom: "Super Stop", vitesse: 4, effet: 3, controle: 9, mv: 4, ms: 3, mc: 9, md: 3, commentaire: "Anti-spin premium. Inversion totale de l'effet. Contrôle maximal. Pour défenseurs de haut niveau." },
    { nom: "Schmerz", vitesse: 5, effet: 4, controle: 8, mv: 5, ms: 4, mc: 8, md: 4, commentaire: "Picots longs. Perturbation et variations d'effet. Pour défenseurs cherchant imprévisibilité." },
  ],
  "Cornilleau": [
    { nom: "Drive Spin", vitesse: 7, effet: 8, controle: 8, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement allround Made in Japan. Adhérence très importante, restitution d'énergie modérée. Mousse 38°. Classique polyvalent." },
    { nom: "Pilot", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor Cornilleau. Bon équilibre, conçu pour la compétition club. Fiable et polyvalent." },
    { nom: "Ittec", vitesse: 7, effet: 7, controle: 9, mv: 7, ms: 7, mc: 9, md: 6, commentaire: "Revêtement polyvalent Cornilleau. Excellent contrôle, idéal pour joueurs en progression." },
  ],
  "TSP": [
    { nom: "Curl P-1R", vitesse: 5, effet: 3, controle: 8, mv: 5, ms: 3, mc: 8, md: 3, commentaire: "Picots longs classiques TSP. Perturbation maximale. Standard mondial pour défenseurs et bloqueurs." },
    { nom: "Spinpips", vitesse: 7, effet: 7, controle: 8, mv: 7, ms: 7, mc: 8, md: 6, commentaire: "Picots courts TSP classiques. Bon équilibre perturbation/attaque. Pour joueurs cherchant variations." },
    { nom: "Super Spinpips", vitesse: 8, effet: 7, controle: 8, mv: 8, ms: 7, mc: 8, md: 7, commentaire: "Version plus rapide des Spinpips. Plus offensive tout en conservant les variations de l'effet." },
    { nom: "Regalis Red", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor TSP classique. Bon équilibre général. Populaire parmi les joueurs TSP/Victas en transition." },
  ],
  "Milky Way / Yinhe": [
    { nom: "Mercury II", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Classique Yinhe. Bon contrôle et spin. Excellent rapport qualité/prix pour joueurs en progression." },
    { nom: "Earth", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Yinhe polyvalent. Bon équilibre vitesse/spin. Très compétitif pour le prix." },
    { nom: "Uranus", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme Yinhe. Vitesse et spin élevés. Excellent rapport qualité/prix pour attaquants." },
  ],
  "Reactor": [
    { nom: "Corbor", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor chinois populaire. Bon spin et vitesse, feuille légèrement collante. Pour joueurs de style chinois." },
    { nom: "Tornado", vitesse: 7, effet: 9, controle: 8, mv: 7, ms: 9, mc: 8, md: 8, commentaire: "Classique Reactor. Feuille collante, excellent spin en service. Pour joueurs de style chinois." },
  ],
}

async function main() {
  console.log('🏓 Import notes marques 2...')
  let totalSuccess = 0, totalNotFound = 0

  for (const [marqueNom, notes] of Object.entries(NOTES_PAR_MARQUE)) {
    console.log(`\n📦 ${marqueNom}...`)

    const searchNom = marqueNom.split('/')[0].split('&')[0].trim()
    const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + searchNom + '%')

    if (!marques || marques.length === 0) {
      console.log(`❌ Marque "${marqueNom}" non trouvée`)
      totalNotFound += notes.length
      continue
    }

    const marqueId = marques[0].id
    const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marqueId)
    if (!produits) continue

    for (const note of notes) {
      const mots = note.nom.toLowerCase().split(' ')
      let prod = produits.find(p => p.nom.toLowerCase() === note.nom.toLowerCase())
      if (!prod) prod = produits.find(p => p.nom.toLowerCase().includes(note.nom.toLowerCase()))
      if (!prod) prod = produits.find(p => mots.every(m => p.nom.toLowerCase().includes(m)))
      if (!prod) prod = produits.find(p => {
        const pMots = p.nom.toLowerCase().split(' ')
        return mots.filter(m => m.length > 2).every(m => pMots.some(pm => pm.includes(m)))
      })

      if (!prod) { console.log(`  ❌ Non trouvé : ${note.nom}`); totalNotFound++; continue }

      const { error } = await s.from('revetements').update({
        vitesse_note: note.vitesse, effet_note: note.effet, controle_note: note.controle,
        note_marque_vitesse: note.mv, note_marque_spin: note.ms,
        note_marque_controle: note.mc, note_marque_durete: note.md,
        commentaire_marque: note.commentaire,
      }).eq('produit_id', prod.id)

      if (error) { console.log(`  ⚠️  Erreur ${note.nom}: ${error.message}`) }
      else { console.log(`  ✅ ${prod.nom} → V:${note.vitesse} E:${note.effet} C:${note.controle}`); totalSuccess++ }
    }
  }

  console.log(`\n🎉 Terminé ! ${totalSuccess} mis à jour, ${totalNotFound} non trouvés.`)
}

main().catch(console.error)
