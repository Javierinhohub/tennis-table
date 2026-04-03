const { createClient } = require('@supabase/supabase-js')
const { readFileSync } = require('fs')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const TYPE_MAP = {
  'In':   'revetements-inverse',
  'Out':  'revetements-picots-courts',
  'Long': 'revetements-picots-longs',
  'Anti': 'revetements-anti-spin'
}

async function getAllIds(subcatIds) {
  let allIds = []
  let from = 0
  while (true) {
    const { data } = await supabase.from('produits').select('id').in('subcategory_id', subcatIds).range(from, from + 999)
    if (!data || data.length === 0) break
    allIds = allIds.concat(data.map(p => p.id))
    if (data.length < 1000) break
    from += 1000
  }
  return allIds
}

async function main() {
  const data = JSON.parse(readFileSync('./larc_2026.json', 'utf-8'))
  console.log(`📦 ${data.length} revêtements à importer...`)

  const { data: subcats } = await supabase.from('sous_categories').select('id, slug')
  const subcatMap = Object.fromEntries(subcats.map(s => [s.slug, s.id]))
  const subcatIds = subcats.filter(s => s.slug.startsWith('revetements')).map(s => s.id)

  console.log('🗑️  Suppression des anciens revêtements...')
  const oldIds = await getAllIds(subcatIds)
  console.log(`   ${oldIds.length} produits trouvés`)

  if (oldIds.length > 0) {
    const BATCH = 100
    for (let i = 0; i < oldIds.length; i += BATCH) {
      await supabase.from('revetements').delete().in('produit_id', oldIds.slice(i, i + BATCH))
    }
    for (let i = 0; i < oldIds.length; i += BATCH) {
      await supabase.from('produits').delete().in('id', oldIds.slice(i, i + BATCH))
    }
    console.log(`✅ ${oldIds.length} anciens revêtements supprimés`)
  }

  console.log('🏷️  Insertion des marques...')
  const brands = [...new Set(data.map(d => d.brand))]
  const { data: existingMarques } = await supabase.from('marques').select('id, nom')
  const existingNoms = new Set((existingMarques || []).map(m => m.nom))
  const newBrands = brands.filter(b => !existingNoms.has(b))
  if (newBrands.length > 0) {
    await supabase.from('marques').insert(newBrands.map(nom => ({ nom })))
  }
  const { data: marquesData } = await supabase.from('marques').select('id, nom')
  const marqueMap = Object.fromEntries(marquesData.map(m => [m.nom, m.id]))
  console.log(`✅ ${marquesData.length} marques disponibles`)

  console.log('⏳ Insertion des produits...')
  const BATCH = 100
  let prodMap = {}
  let success = 0

  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH)
    const produits = batch.map(item => ({
      subcategory_id: subcatMap[TYPE_MAP[item.type] || 'revetements-inverse'],
      marque_id: marqueMap[item.brand],
      nom: item.product,
      slug: item.slug,
      actif: true
    })).filter(p => p.subcategory_id && p.marque_id)

    const { data: inserted, error } = await supabase.from('produits').insert(produits).select('id, slug')
    if (error) { console.log(`Erreur: ${error.message}`); continue }
    inserted.forEach(p => { prodMap[p.slug] = p.id })
    success += inserted.length
    console.log(`⏳ Produits: ${Math.min(i + BATCH, data.length)}/${data.length}`)
  }

  console.log('⏳ Insertion des revêtements...')
  const revetements = data.map(item => ({
    produit_id: prodMap[item.slug],
    larc_approuve: true,
    numero_larc: item.code,
    couleurs_dispo: item.colors,
    type_revetement: item.type
  })).filter(r => r.produit_id)

  for (let i = 0; i < revetements.length; i += BATCH) {
    const { error } = await supabase.from('revetements').insert(revetements.slice(i, i + BATCH))
    if (error) console.log(`Erreur revêtements: ${error.message}`)
    console.log(`⏳ Revêtements: ${Math.min(i + BATCH, revetements.length)}/${revetements.length}`)
  }

  console.log(`\n✅ Import terminé !`)
  console.log(`   Produits insérés : ${success}`)
  console.log(`   Revêtements : ${revetements.length}`)
}

main().catch(console.error)
