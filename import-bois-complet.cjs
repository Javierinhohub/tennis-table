const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

function styleFromNom(nom) {
  const n = nom.toLowerCase()
  if (n.includes('def') || n.includes('defence') || n.includes('defense')) return 'defensif'
  if (n.includes('all') || n.includes('allround') || n.includes('control')) return 'tout jeu'
  if (n.includes('penhold') || n.includes('jpen') || n.includes('cpen')) return 'penhold'
  return 'offensif'
}

async function main() {
  const lines = fs.readFileSync('/Users/nassergasmi/Documents/tennis-table/stervinou_complet_final.csv', 'utf-8').trim().split('\n')
  const headers = lines[0].split(',')
  const boisCSV = lines.slice(1).map(line => {
    const vals = line.split(',')
    const obj = {}
    headers.forEach((h, i) => obj[h.trim()] = (vals[i] || '').trim())
    return obj
  })
  console.log(`📦 ${boisCSV.length} bois dans le CSV`)

  // Récupérer les sous-catégories bois
  const { data: souscats } = await s.from('sous_categories').select('id, nom, slug').ilike('nom', '%bois%')
  console.log('Sous-catégories:', souscats?.map(s => s.nom + '=' + s.id))

  const scMap = {}
  souscats?.forEach(sc => {
    const n = sc.nom.toLowerCase()
    if (n.includes('offensif') || n.includes('offensif')) scMap['offensif'] = sc.id
    if (n.includes('tout') || n.includes('jeu')) scMap['tout jeu'] = sc.id
    if (n.includes('d') && n.includes('fensif')) scMap['defensif'] = sc.id
    if (n.includes('penhold')) scMap['penhold'] = sc.id
  })
  console.log('Map styles:', scMap)

  // Récupérer les marques
  const { data: marques } = await s.from('marques').select('id, nom')
  const marqueMap = {}
  marques?.forEach(m => { marqueMap[m.nom.toLowerCase()] = m.id })

  // Récupérer tous les produits existants
  let allProduits = []
  let from = 0
  while (true) {
    const { data } = await s.from('produits').select('id, nom, marques(nom)').range(from, from + 999)
    if (!data || data.length === 0) break
    allProduits = allProduits.concat(data)
    if (data.length < 1000) break
    from += 1000
  }
  console.log(`🗄️  ${allProduits.length} produits dans Supabase`)

  let created = 0, updated = 0, errors = 0

  for (const b of boisCSV) {
    const nomCSV = b.nom.toLowerCase().trim()
    const marqueCSV = b.marque.toLowerCase().trim()
    const marqueId = marqueMap[marqueCSV]

    if (!marqueId) {
      console.log(`  ⚠️  Marque introuvable: ${b.marque}`)
      errors++
      continue
    }

    // Chercher le produit existant
    let prod = allProduits.find(p => {
      const nomDB = p.nom.toLowerCase().trim()
      const marqueDB = (p.marques?.nom || '').toLowerCase().trim()
      return marqueDB === marqueCSV && (nomDB === nomCSV || nomDB.includes(nomCSV) || nomCSV.includes(nomDB))
    })

    let produitId = prod?.id

    if (!prod) {
      // Créer le slug
      const slug = (b.marque + '-' + b.nom).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

      const style = styleFromNom(b.nom)
      const subcategoryId = scMap[style] || scMap['offensif']

      const { data: newProd, error: ep } = await s.from('produits').insert({
        nom: b.nom,
        slug: slug,
        marque_id: marqueId,
        subcategory_id: subcategoryId,
        actif: true,
      }).select('id').single()

      if (ep) {
        // Slug en doublon ? Ajouter suffixe
        const slugAlt = slug + '-bois'
        const { data: newProd2, error: ep2 } = await s.from('produits').insert({
          nom: b.nom, slug: slugAlt, marque_id: marqueId, subcategory_id: subcategoryId, actif: true,
        }).select('id').single()
        if (ep2) { console.log(`  ❌ ${b.marque} — ${b.nom}: ${ep2.message}`); errors++; continue }
        produitId = newProd2.id
      } else {
        produitId = newProd.id
      }
      created++
    }

    // Upsert dans bois
    const poids = b.poids_g && b.poids_g !== '0' ? parseInt(b.poids_g) : null
    const ep = b.epaisseur_mm && b.epaisseur_mm !== '0' && b.epaisseur_mm !== '0.0' ? parseFloat(b.epaisseur_mm) : null

    const { error: eb } = await s.from('bois').upsert({
      produit_id: produitId,
      poids_g: poids, epaisseur_mm: ep,
      nb_plis: b.nb_plis ? parseInt(b.nb_plis) : null,
      composition: b.composition || null,
      pli1: b.pli1 || null, pli2: b.pli2 || null, pli3: b.pli3 || null,
      pli4: b.pli4 || null, pli5: b.pli5 || null, pli6: b.pli6 || null,
      pli7: b.pli7 || null,
    }, { onConflict: 'produit_id' })

    if (eb) {
      console.log(`  ⚠️  bois upsert ${b.nom}: ${eb.message}`)
      errors++
    } else {
      const action = prod ? '✅' : '🆕'
      console.log(`  ${action} ${b.marque} — ${b.nom}`)
      if (prod) updated++
    }
  }

  console.log(`\n🎉 ${created} créés, ${updated} mis à jour, ${errors} erreurs`)
}
main().catch(console.error)
