const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const NOTES_PAR_MARQUE = {
  "Donic": [
    { nom: "Bluefire M1", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN haut de gamme. Vitesse et effet élevés, excellent en topspin coup droit. Mousse 42.5°." },
    { nom: "Bluefire M2", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version plus souple du M1. Meilleur contrôle, idéal en revers. Tensor ESN 40°." },
    { nom: "Bluefire M3", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Le plus contrôlé de la gamme Bluefire. Tensor souple, excellent pour les joueurs en progression." },
    { nom: "Baracuda", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor ESN classique. Bon équilibre vitesse/effet, très populaire en Europe. Durable et fiable." },
    { nom: "Acuda S1", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor premium avec feuille très dynamique. Vitesse et rotation maximales. Mousse dure 47.5°." },
    { nom: "Acuda S2", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version équilibrée de l'Acuda S1. Bon compromis vitesse/contrôle. Tensor 42.5°." },
    { nom: "Coppa X1", vitesse: 9, effet: 8, controle: 8, mv: 9, ms: 8, mc: 8, md: 8, commentaire: "Haut de gamme Donic. Vitesse explosive, excellent rejet. Idéal pour les attaquants purs." },
    { nom: "Waldner Senso", vitesse: 7, effet: 7, controle: 9, mv: 7, ms: 7, mc: 9, md: 5, commentaire: "Revêtement classique et fiable. Excellent contrôle, idéal pour les joueurs allround et défensifs." },
  ],
  "Tibhar": [
    { nom: "Evolution MX-P", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN premium. Standard européen pour le coup droit. Vitesse et spin élevés, très populaire chez les joueurs de compétition." },
    { nom: "Evolution MX-S", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version plus souple du MX-P. Idéal en revers pour les joueurs cherchant plus de feeling." },
    { nom: "Evolution EL-P", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor polyvalent avec excellente tolérance. Parfait pour les joueurs en progression cherchant régularité." },
    { nom: "Quantum X Pro", vitesse: 10, effet: 9, controle: 7, mv: 10, ms: 9, mc: 7, md: 9, commentaire: "Tensor ultra-offensif. Mousse 47.5°, vitesse maximale. Pour joueurs avancés avec fort swing speed." },
    { nom: "Aurus Prime", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor équilibré, excellent rapport qualité/prix. Bon en topspin et en revers. Populaire en club." },
    { nom: "Grip-S", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 5, commentaire: "Revêtement classique très accrocheur. Excellent contrôle, idéal pour apprendre les effets." },
    { nom: "1Q XD", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme adapté à la balle plastique. Excellent feeling, très dynamique." },
  ],
  "Stiga": [
    { nom: "DNA Dragon Grip", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Fer de lance de Stiga. Feuille très accrochante, spin exceptionnel. Mousse dure, pour joueurs avancés." },
    { nom: "DNA Pro H", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 9, commentaire: "Tensor premium dureté haute. Vitesse et spin élevés, très dynamique. Pour attaquants confirmés." },
    { nom: "DNA Pro M", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor dureté medium. Bon équilibre, excellent en revers. Très populaire en Europe." },
    { nom: "DNA Pro S", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor souple. Excellent contrôle et feeling. Idéal pour joueurs cherchant précision et régularité." },
    { nom: "Mantra H", vitesse: 9, effet: 9, controle: 7, mv: 9, ms: 9, mc: 7, md: 8, commentaire: "Tensor offensif mousse dure. Vitesse et rotation maximales. Pour attaquants de haut niveau." },
    { nom: "Mantra M", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor polyvalent. Bon équilibre vitesse/contrôle. Très utilisé en club et compétition régionale." },
    { nom: "Calibra LT", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 6, commentaire: "Tensor polyvalent classique Stiga. Fiable et durable, bon rapport qualité/prix." },
  ],
  "Xiom": [
    { nom: "Vega Asia", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor premium avec feuille très dynamique. Excellent spin, très populaire en Asie. Mousse 47.5°." },
    { nom: "Vega Europe", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 7, commentaire: "Version européenne plus souple. Meilleur contrôle, idéal en revers. Très populaire en club." },
    { nom: "Vega Pro", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme Xiom. Vitesse et spin élevés, excellent en topspin. Pour joueurs avancés." },
    { nom: "Omega VII Asia", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Fer de lance Xiom. Feuille très accrochante, spin maximal. Mousse dure, trajectoire basse." },
    { nom: "Omega VII Pro", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Version premium équilibrée. Vitesse et spin élevés avec meilleur contrôle que l'Asia." },
    { nom: "Omega VII Euro", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version européenne de l'Omega VII. Plus souple, meilleur feeling. Idéal en revers." },
    { nom: "Omega V Tour", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Xiom. Bon équilibre, excellent rapport qualité/prix pour la compétition." },
  ],
  "Nittaku": [
    { nom: "Fastarc G-1", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Standard japonais. Grip First - accroche maximale. Vitesse suffisante, spin excellent, contrôle exceptionnel." },
    { nom: "Fastarc C-1", vitesse: 9, effet: 8, controle: 8, mv: 9, ms: 8, mc: 8, md: 8, commentaire: "Version plus rapide. Speed First - vitesse maximale. Pour attaquants purs préférant la vitesse." },
    { nom: "Fastarc P-1", vitesse: 8, effet: 9, controle: 9, mv: 8, ms: 9, mc: 9, md: 6, commentaire: "Version contrôle. Souple et précis. Idéal pour revers et joueurs cherchant régularité." },
    { nom: "Hurricane Pro 3", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Version premium du Hurricane. Feuille collante style chinois. Excellent spin en service et topspin." },
    { nom: "Renanos Hold", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor japonais haut de gamme. Excellent feeling, très dynamique. Pour joueurs techniques avancés." },
  ],
  "Joola": [
    { nom: "Rhyzm", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor ESN classique. Bon équilibre vitesse/spin. Très populaire en club et compétition." },
    { nom: "Rhyzm-P", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Version premium du Rhyzm. Plus dynamique, excellent en topspin coup droit. Pour joueurs avancés." },
    { nom: "Golden Tango", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Haut de gamme Joola. Spin maximal, trajectoire haute et sécurisée. Utilisé par des pros allemands." },
    { nom: "Dynaryz AGR", vitesse: 10, effet: 9, controle: 7, mv: 10, ms: 9, mc: 7, md: 9, commentaire: "Tensor ultra-offensif. Vitesse maximale, très direct. Pour attaquants purs avec swing rapide." },
    { nom: "Dynaryz CMD", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Version spin du Dynaryz. Rotation maximale, trajectoire haute. Excellent en topspin lourd." },
    { nom: "Zack", vitesse: 7, effet: 7, controle: 9, mv: 7, ms: 7, mc: 9, md: 5, commentaire: "Revêtement polyvalent classique. Excellent contrôle, idéal pour débutants et joueurs allround." },
  ],
  "Andro": [
    { nom: "Rasanter R47", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN haut de gamme 47.5°. Dynamique et accrochant. Standard pour joueurs offensifs avancés." },
    { nom: "Rasanter R42", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version 42.5°. Meilleur contrôle que le R47, très polyvalent. Idéal en revers." },
    { nom: "Rasanter R37", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Version souple 37.5°. Excellent contrôle et feeling. Pour joueurs cherchant précision." },
    { nom: "Rasanter C53", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 9, commentaire: "Version collante 52.5°. Feuille tacky style chinois. Spin maximal, trajectoire basse et sécurisée." },
    { nom: "Hexer HD", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Andro. Bon équilibre, fiable et durable. Populaire en club et compétition." },
    { nom: "Hexer Powergrip", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Version premium du Hexer. Plus dynamique, spin élevé. Excellent rapport qualité/prix." },
  ],
  "Yasaka": [
    { nom: "Rakza 7", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor japonais polyvalent. Bon équilibre vitesse/spin/contrôle. Très populaire en Europe et Asie." },
    { nom: "Rakza 9", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Version offensive du Rakza 7. Plus dynamique, vitesse et spin supérieurs. Pour attaquants avancés." },
    { nom: "Rakza X", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Version premium. Feuille très accrochante, spin maximal. Trajectoire haute et sécurisée." },
    { nom: "Mark V", vitesse: 7, effet: 7, controle: 9, mv: 7, ms: 7, mc: 9, md: 5, commentaire: "Classique indémodable depuis 1967. Excellent contrôle, idéal pour apprentissage et jeu allround." },
    { nom: "Phantom 0012 Infinity", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 4, commentaire: "Anti-spin classique. Excellente perturbation de l'effet adverse. Pour défenseurs et joueurs perturbateurs." },
  ],
  "DHS": [
    { nom: "Hurricane 3", vitesse: 7, effet: 9, controle: 8, mv: 7, ms: 9, mc: 8, md: 9, commentaire: "Standard chinois. Feuille très collante, spin maximal en service. Nécessite booster pour performance optimale." },
    { nom: "Hurricane 3 Neo", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 9, commentaire: "Version pré-boostée du H3. Prêt à l'emploi, plus dynamique. Utilisé par l'équipe nationale chinoise." },
    { nom: "Skyline TG3 Neo", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Standard chinois offensif. Feuille tacky, excellent spin. Populaire chez les attaquants de style chinois." },
    { nom: "Goldarc 8", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor DHS européen. Bon équilibre vitesse/spin pour joueurs de style hybride chinois-européen." },
  ],
  "Gewo": [
    { nom: "Nexxus EL Pro 50", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN premium 50°. Dynamique et accrochant. Pour joueurs offensifs avancés." },
    { nom: "Nexxus XT Pro 48", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor polyvalent 48°. Bon équilibre, excellent en topspin et revers. Très populaire en club." },
    { nom: "Hype EL Pro 42", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor souple 42°. Excellent contrôle et feeling. Idéal pour joueurs cherchant précision." },
  ],
  "Victas": [
    { nom: "V>15 Extra", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor japonais haut de gamme. Vitesse et spin élevés, excellent en topspin. Pour joueurs avancés." },
    { nom: "V>15 Limber", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Version souple. Meilleur contrôle et feeling. Idéal en revers pour joueurs techniques." },
    { nom: "VO>102", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Victas. Bon équilibre, fiable. Très utilisé par joueurs TSP/Victas en transition." },
    { nom: "Curl P1-R", vitesse: 5, effet: 3, controle: 8, mv: 5, ms: 3, mc: 8, md: 3, commentaire: "Picots longs classiques. Perturbation maximale de l'effet adverse. Pour défenseurs et bloqueurs." },
  ],
}

async function main() {
  console.log('🏓 Import notes toutes marques...')
  let totalSuccess = 0, totalNotFound = 0

  for (const [marqueNom, notes] of Object.entries(NOTES_PAR_MARQUE)) {
    console.log(`\n📦 Traitement ${marqueNom}...`)

    const { data: marque } = await s.from('marques').select('id').eq('nom', marqueNom).single()
    if (!marque) {
      // Essai avec ilike
      const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + marqueNom + '%')
      if (!marques || marques.length === 0) {
        console.log(`❌ Marque "${marqueNom}" non trouvée`)
        totalNotFound += notes.length
        continue
      }
    }

    const marqueId = marque?.id || (await s.from('marques').select('id').ilike('nom', '%' + marqueNom + '%').single()).data?.id
    if (!marqueId) { totalNotFound += notes.length; continue }

    const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marqueId)
    if (!produits || produits.length === 0) {
      console.log(`⚠️  Aucun produit pour ${marqueNom}`)
      totalNotFound += notes.length
      continue
    }

    for (const note of notes) {
      const mots = note.nom.toLowerCase().split(' ')
      let prod = produits.find(p => p.nom.toLowerCase() === note.nom.toLowerCase())
      if (!prod) prod = produits.find(p => p.nom.toLowerCase().includes(note.nom.toLowerCase()))
      if (!prod) prod = produits.find(p => mots.every(m => p.nom.toLowerCase().includes(m)))

      if (!prod) {
        console.log(`  ❌ Non trouvé : ${note.nom}`)
        totalNotFound++
        continue
      }

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
        console.log(`  ⚠️  Erreur ${note.nom}: ${error.message}`)
      } else {
        console.log(`  ✅ ${prod.nom} → V:${note.vitesse} E:${note.effet} C:${note.controle}`)
        totalSuccess++
      }
    }
  }

  console.log(`\n🎉 Terminé ! ${totalSuccess} mis à jour, ${totalNotFound} non trouvés.`)
}

main().catch(console.error)
