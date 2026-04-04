const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const NOTES = [
  { nom: "Dignics 05", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 8, commentaire: "Code de picots N°05. Topspin puissant près et à mi-distance. Mousse Spring Sponge X 40°. 22% plus d'arc que le Tenergy 05." },
  { nom: "Dignics 09C", vitesse: 9, effet: 10, controle: 9, mv: 9, ms: 10, mc: 9, md: 9, commentaire: "Feuille collante style chinois sur Spring Sponge X 44°. Contrôle exceptionnel, idéal en retour de service. Utilisé par Félix et Alexis Lebrun." },
  { nom: "Dignics 64", vitesse: 10, effet: 9, controle: 7, mv: 10, ms: 9, mc: 7, md: 8, commentaire: "Version la plus rapide des Dignics. Code de picots N°64. Spring Sponge X 40°. Jeu offensif pur à mi-distance." },
  { nom: "Dignics 80", vitesse: 9, effet: 8, controle: 8, mv: 9, ms: 8, mc: 8, md: 8, commentaire: "Équilibre vitesse et effet. Code de picots N°180. Spring Sponge X 40°. Recommandé aux joueurs polyvalents." },
  { nom: "Tenergy 05", vitesse: 8, effet: 10, controle: 7, mv: 8, ms: 10, mc: 7, md: 7, commentaire: "Le revêtement le plus populaire depuis 2008. Code de picots N°05, Spring Sponge 36°. Standard mondial du jeu offensif." },
  { nom: "Tenergy 05-FX", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 6, commentaire: "Version souple du T05. Même feuille, mousse Spring Sponge plus tendre 32°. Toucher doux, plus de sensation." },
  { nom: "Tenergy 05 Hard", vitesse: 9, effet: 10, controle: 7, mv: 9, ms: 10, mc: 7, md: 9, commentaire: "Mousse dure 43°. Plus de puissance sur frappes violentes. Conserve le toucher Spring Sponge original." },
  { nom: "Tenergy 64", vitesse: 9, effet: 8, controle: 7, mv: 9, ms: 8, mc: 7, md: 7, commentaire: "Code de picots N°64. Plus rapide que le T05 avec légèrement moins d'effet. Spring Sponge 36°." },
  { nom: "Tenergy 80", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 7, commentaire: "Équilibre parfait T05/T64. Code N°180, Spring Sponge 36°. Polyvalent, excellent en revers." },
  { nom: "Tenergy 19", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 7, commentaire: "Structure de picots inédite. Plus de vitesse et d'effet que le T05. Facile à ouvrir le topspin sur balle coupée." },
  { nom: "Glayzer", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Entre Rozena et Tenergy. Feuille semblable au Dignics 05. Idéal pour les joueurs en progression." },
  { nom: "Glayzer 09C", vitesse: 8, effet: 9, controle: 9, mv: 8, ms: 9, mc: 9, md: 7, commentaire: "Feuille Dignics 09C sur mousse plus tendre. Plus accessible que le D09C, excellente accroche, bon petit jeu." },
  { nom: "Rozena", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent et tolérant. Idéal pour les joueurs en progression. Mousse Spring Sponge souple." },
  { nom: "Tackiness C", vitesse: 5, effet: 7, controle: 9, mv: 5, ms: 7, mc: 9, md: 5, commentaire: "Surface extrêmement adhérente. Rotations dangereuses. Idéal défenseurs et joueurs polyvalents passifs." },
  { nom: "Tackiness D", vitesse: 6, effet: 7, controle: 8, mv: 6, ms: 7, mc: 8, md: 5, commentaire: "Version plus rapide du Tackiness C. Même adhérence avec plus de dynamisme. Pour joueurs polyvalents actifs." },
]

async function main() {
  // Récupérer l'ID de Butterfly
  const { data: marque } = await s.from('marques').select('id').eq('nom', 'Butterfly').single()
  if (!marque) { console.log('❌ Marque Butterfly non trouvée'); return }
  console.log('✅ Marque Butterfly trouvée:', marque.id)

  // Récupérer tous les produits Butterfly
  const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marque.id)
  console.log(`📦 ${produits?.length} produits Butterfly trouvés`)

  let success = 0, notFound = 0

  for (const note of NOTES) {
    // Chercher le produit par nom approché
    const produit = produits?.find(p =>
      p.nom.toLowerCase().includes(note.nom.toLowerCase()) ||
      note.nom.toLowerCase().includes(p.nom.toLowerCase())
    )

    if (!produit) {
      // Essai avec nom partiel
      const mots = note.nom.toLowerCase().split(' ')
      const match = produits?.find(p => mots.every(m => p.nom.toLowerCase().includes(m)))
      if (!match) {
        console.log(`❌ Non trouvé : ${note.nom}`)
        notFound++
        continue
      }
      console.log(`⚠️  Correspondance approximative : "${note.nom}" → "${match.nom}"`)
    }

    const prod = produit || produits?.find(p => {
      const mots = note.nom.toLowerCase().split(' ')
      return mots.every(m => p.nom.toLowerCase().includes(m))
    })

    const { error } = await s.from('revetements').update({
      vitesse_note: note.vitesse,
      effet_note: note.effet,
      controle_note: note.controle,
      note_marque_vitesse: note.mv,
      note_marque_spin: note.ms,
      note_marque_controle: note.mc,
      note_marque_durete: note.md,
      commentaire_marque: note.commentaire,
    }).eq('produit_id', prod.id)

    if (error) {
      console.log(`⚠️  Erreur ${note.nom}: ${error.message}`)
    } else {
      console.log(`✅ ${prod.nom} → V:${note.vitesse} E:${note.effet} C:${note.controle}`)
      success++
    }
  }

  console.log(`\n🎉 Terminé ! ${success} mis à jour, ${notFound} non trouvés.`)
}

main().catch(console.error)
