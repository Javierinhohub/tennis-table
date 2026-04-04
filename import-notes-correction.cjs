const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const CORRECTIONS = [
  { marque: "Double Happiness / DHS", produits: [
    { nom: "Hurricane III", vitesse: 7, effet: 9, controle: 8, mv: 7, ms: 9, mc: 8, md: 9, commentaire: "Standard chinois. Feuille très collante, spin maximal en service. Nécessite booster pour performance optimale. Utilisé par l'équipe nationale chinoise." },
    { nom: "Nittaku Hurricane III", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 9, commentaire: "Version pré-boostée du H3. Plus dynamique, prête à l'emploi." },
    { nom: "Nittaku Hurricane Pro III", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 9, commentaire: "Version premium du Hurricane. Feuille collante, excellent spin en service et topspin." },
    { nom: "Gold Arc 8", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 8, commentaire: "Tensor DHS européen. Bon équilibre vitesse/spin pour joueurs de style hybride." },
    { nom: "Gold Arc 5", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 7, commentaire: "Tensor DHS entrée de gamme. Bon contrôle, idéal pour joueurs en progression." },
  ]},
  { marque: "Gewo", produits: [
    { nom: "Nexxus EL Pro Hard", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN premium dureté haute. Dynamique et accrochant. Pour joueurs offensifs avancés." },
    { nom: "Nexxus XT Pro", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor polyvalent. Bon équilibre, excellent en topspin et revers. Très populaire en club." },
    { nom: "Hype EL", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Tensor souple. Excellent contrôle et feeling. Idéal pour joueurs cherchant précision." },
    { nom: "Hype XT Pro", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme Gewo. Vitesse et spin élevés. Pour attaquants confirmés." },
    { nom: "Proton Neo", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Gewo. Fiable et polyvalent. Bon rapport qualité/prix pour la compétition." },
  ]},
  { marque: "Victas", produits: [
    { nom: "V > 15 Extra", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor japonais haut de gamme. Vitesse et spin élevés, excellent en topspin. Pour joueurs avancés." },
    { nom: "V > 15 Limber", vitesse: 8, effet: 8, controle: 9, mv: 8, ms: 8, mc: 9, md: 6, commentaire: "Version souple. Meilleur contrôle et feeling. Idéal en revers pour joueurs techniques." },
    { nom: "V > 01", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Victas. Bon équilibre, fiable. Très utilisé par joueurs en transition TSP/Victas." },
    { nom: "Curl P1V", vitesse: 5, effet: 3, controle: 8, mv: 5, ms: 3, mc: 8, md: 3, commentaire: "Picots longs classiques. Perturbation maximale de l'effet adverse. Pour défenseurs et bloqueurs." },
    { nom: "TRIPLE Extra", vitesse: 8, effet: 8, controle: 8, mv: 8, ms: 8, mc: 8, md: 7, commentaire: "Tensor polyvalent premium. Bon équilibre général, fiable en compétition." },
  ]},
  { marque: "Tibhar", produits: [
    { nom: "Evolution MX - P", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor ESN premium. Standard européen pour le coup droit. Vitesse et spin élevés, très populaire chez les joueurs de compétition." },
    { nom: "Grip - S Europe", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 5, commentaire: "Revêtement classique très accrocheur. Excellent contrôle, idéal pour apprendre les effets." },
    { nom: "1Q", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor haut de gamme adapté à la balle plastique. Excellent feeling, très dynamique." },
    { nom: "Hybrid K-1", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Tensor hybride japonais/chinois. Feuille collante sur mousse dynamique. Spin exceptionnel." },
    { nom: "Hybrid K2", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Version plus souple du K-1. Meilleur contrôle, très dynamique. Pour joueurs avancés." },
    { nom: "Aurus Prime", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor équilibré, excellent rapport qualité/prix. Bon en topspin et en revers." },
  ]},
  { marque: "Nittaku", produits: [
    { nom: "Flyatt", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor japonais haut de gamme. Excellent feeling, très dynamique. Pour joueurs techniques avancés." },
    { nom: "Flyatt Spin", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version spin du Flyatt. Rotation maximale, trajectoire haute. Excellent en topspin lourd." },
    { nom: "Hammond", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent Nittaku. Bon contrôle, fiable. Populaire chez les joueurs allround." },
    { nom: "Hammond FA", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version offensive du Hammond. Plus dynamique, excellent en topspin." },
  ]},
  { marque: "Joola", produits: [
    { nom: "Rhyzer 48", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor premium Joola 48°. Vitesse et spin élevés. Pour attaquants avancés." },
    { nom: "Rhyzer 43", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Version plus souple 43°. Meilleur contrôle, très polyvalent. Idéal en revers." },
    { nom: "Rhyzen CMD", vitesse: 9, effet: 10, controle: 8, mv: 9, ms: 10, mc: 8, md: 9, commentaire: "Haut de gamme spin Joola. Rotation maximale, trajectoire haute. Pour attaquants confirmés." },
    { nom: "Dynaryz ZGR", vitesse: 9, effet: 9, controle: 8, mv: 9, ms: 9, mc: 8, md: 8, commentaire: "Tensor offensif. Bon équilibre vitesse/spin. Pour joueurs avancés cherchant régularité." },
    { nom: "Mambo", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Revêtement polyvalent classique Joola. Bon contrôle, fiable. Populaire en club." },
  ]},
  { marque: "Yasaka", produits: [
    { nom: "Phantom 0012 ~", vitesse: 6, effet: 5, controle: 8, mv: 6, ms: 5, mc: 8, md: 4, commentaire: "Anti-spin classique. Excellente perturbation de l'effet adverse. Pour défenseurs et joueurs perturbateurs." },
    { nom: "Hovering Dragon", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor Yasaka offensif. Bon spin et vitesse. Pour attaquants cherchant dynamisme." },
    { nom: "Mark V GPS", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 5, commentaire: "Version améliorée du Mark V classique. Plus de dynamisme tout en conservant l'excellent contrôle." },
    { nom: "Rakza 7 Soft", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Version souple du Rakza 7. Meilleur contrôle et feeling. Idéal en revers." },
  ]},
  { marque: "Donic", produits: [
    { nom: "Bluefire M1 Turbo", vitesse: 10, effet: 9, controle: 7, mv: 10, ms: 9, mc: 7, md: 9, commentaire: "Version ultra-offensive du M1. Vitesse maximale, très directe. Pour attaquants purs." },
    { nom: "Acuda S1 Turbo", vitesse: 10, effet: 9, controle: 7, mv: 10, ms: 9, mc: 7, md: 9, commentaire: "Version ultra-offensive de l'Acuda S1. Vitesse et dynamisme extrêmes." },
    { nom: "BlueStar A1", vitesse: 8, effet: 9, controle: 8, mv: 8, ms: 9, mc: 8, md: 7, commentaire: "Tensor classique Donic. Bon équilibre, fiable. Bon rapport qualité/prix pour la compétition." },
    { nom: "BlueStar A2", vitesse: 7, effet: 8, controle: 9, mv: 7, ms: 8, mc: 9, md: 6, commentaire: "Version plus souple. Meilleur contrôle, idéal pour joueurs en progression." },
    { nom: "BlueStar A3", vitesse: 6, effet: 7, controle: 9, mv: 6, ms: 7, mc: 9, md: 5, commentaire: "Version très souple. Excellent contrôle. Pour débutants et joueurs cherchant régularité." },
  ]},
]

async function main() {
  console.log('🏓 Import corrections...')
  let totalSuccess = 0, totalNotFound = 0

  for (const { marque: marqueNom, produits: notes } of CORRECTIONS) {
    console.log(`\n📦 ${marqueNom}...`)
    const { data: marques } = await s.from('marques').select('id, nom').ilike('nom', '%' + marqueNom.split('/')[0].trim() + '%')
    if (!marques || marques.length === 0) { console.log('❌ Marque non trouvée'); continue }
    const marqueId = marques[0].id

    const { data: produits } = await s.from('produits').select('id, nom').eq('marque_id', marqueId)
    if (!produits) continue

    for (const note of notes) {
      const prod = produits.find(p => p.nom.toLowerCase() === note.nom.toLowerCase())
        || produits.find(p => p.nom.toLowerCase().includes(note.nom.toLowerCase()))

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
