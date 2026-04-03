// Script import LARC 2026 — remplace tout
// Usage : node import-larc-2026.cjs

const { createClient } = require('@supabase/supabase-js')
const { readFileSync } = require('fs')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const TYPE_MAP = {
  'In':   'revetements-inverse',
  'Out':  'revetements-picots-courts',
  'Long': 'revetements-picots-longs',
  'Anti': 'revetements-anti-spin'
}

async function main() {
  const data = JSON.parse(readFileSync('./larc_2026.json', 'utf-8'))
  console.log(`📦 ${data.length} revêtements à importer...`)

  // 1. Récupérer les sous-catégories
  const { data: subcats } = await supabase.from('sous_categories').select('id, slug')
  const subcatMap = Object.fromEntries(subcats.map(s => [s.slug, s.id]))

  // 2. Supprimer uniquement les revêtements (pas les bois, balles etc.)
  console.log('🗑️  Suppression des anciens revêtements...')
  const subcatIds = Object.values(subcatMap).filter((_, i) => Object.keys(subcatMap)[i].startsWith('revetements'))
  
  // Récupérer les produits revetements existants
  const { data: oldProduits } = await supabase
    .from('produits')
    .select('id')
    .in('subcategory_id', subcatIds)
  
  if (oldProduits && oldProduits.length > 0) {
    const oldIds = oldProduits.map(p => p.id)
    // Supprimer les revetements liés
    await supabase.from('revetements').delete().in('produit_id', oldIds)
    // Supprimer les produits par batch
    const BATCH = 100
    for (let i = 0; i < oldIds.length; i += BATCH) {
      await supabase.from('produits').delete().in('id', oldIds.slice(i, i + BATCH))
    }
    console.log(`✅ ${oldProduits.length} anciens revêtements supprimés`)
  }

  // 3. Insérer les marques (toutes, sans doublons)
  console.log('🏷️  Insertion des marques...')
  const brands = [...new Set(data.map(d => d.brand))]
  
  // Récupérer marques existantes
  const { data: existingMarques } = await supabase.from('marques').select('id, nom')
  const existingNoms = new Set(existingMarques.map(m => m.nom))
  
  // Insérer uniquement les nouvelles
  const newBrands = brands.filter(b => !existingNoms.has(b))
  if (newBrands.length > 0) {
    await supabase.from('marques').insert(newBrands.map(nom => ({ nom })))
  }

  // Récupérer toutes les marques avec leurs IDs
  const { data: marquesData } = await supabase.from('marques').select('id, nom')
  const marqueMap = Object.fromEntries(marquesData.map(m => [m.nom, m.id]))
  console.log(`✅ ${marquesData.length} marques disponibles`)

  // 4. Insérer les produits par batch
  console.log('⏳ Insertion des produits...')
  const BATCH = 100
  let prodMap = {}
  let success = 0
  let errors = 0

  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH)
    
    const produits = batch.map(item => ({
      subcategory_id: subcatMap[TYPE_MAP[item.type] || 'revetements-inverse'],
      marque_id: marqueMap[item.brand],
      nom: item.product,
      slug: item.slug,
      actif: true
    })).filter(p => p.subcategory_id && p.marque_id)

    if (produits.length === 0) { errors += batch.length; continue }

    const { data: inserted, error } = await supabase
      .from('produits')
      .insert(produits)
      .select('id, slug')

    if (error) {
      console.log(`Erreur batch ${i}: ${error.message}`)
      errors += batch.length
      continue
    }

    inserted.forEach(p => { prodMap[p.slug] = p.id })
    success += inserted.length
    console.log(`⏳ Produits: ${Math.min(i + BATCH, data.length)}/${data.length}`)
  }

  // 5. Insérer les revêtements
  console.log('⏳ Insertion des revêtements...')
  const revetements = data.map(item => ({
    produit_id: prodMap[item.slug],
    larc_approuve: true,
    numero_larc: item.code,
    couleurs_dispo: item.colors,
    type_revetement: item.type
  })).filter(r => r.produit_id)

  for (let i = 0; i < revetements.length; i += BATCH) {
    const batch = revetements.slice(i, i + BATCH)
    const { error } = await supabase.from('revetements').insert(batch)
    if (error) console.log(`Erreur revêtements batch ${i}: ${error.message}`)
    console.log(`⏳ Revêtements: ${Math.min(i + BATCH, revetements.length)}/${revetements.length}`)
  }

  console.log(`\n✅ Import terminé !`)
  console.log(`   Produits insérés : ${success}`)
  console.log(`   Revêtements : ${revetements.length}`)
  console.log(`   Erreurs : ${errors}`)
}

main().catch(console.error)
