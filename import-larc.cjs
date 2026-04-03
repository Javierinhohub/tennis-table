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
  const data = JSON.parse(readFileSync('./larc_data.json', 'utf-8'))
  console.log(`📦 ${data.length} revêtements à importer...`)

  // 1. Sous-catégories
  const { data: subcats } = await supabase.from('sous_categories').select('id, slug')
  const subcatMap = Object.fromEntries(subcats.map(s => [s.slug, s.id]))
  console.log(`✅ ${subcats.length} sous-catégories chargées`)

  // 2. Insertion groupée des marques
  const brandNames = [...new Set(data.map(d => d.brand))]
  const brandRows = brandNames.map(nom => ({ nom }))
  const { error: brandErr } = await supabase.from('marques').insert(brandRows).select()
  if (brandErr) console.log('Info marques:', brandErr.message)

  const { data: marquesData } = await supabase.from('marques').select('id, nom')
  const marqueMap = Object.fromEntries(marquesData.map(m => [m.nom, m.id]))
  console.log(`✅ ${marquesData.length} marques chargées`)

  // 3. Insertion groupée des produits
  const produits = data.map(item => ({
    subcategory_id: subcatMap[TYPE_MAP[item.type] || 'revetements-inverse'],
    marque_id: marqueMap[item.brand],
    nom: item.product,
    slug: item.slug,
    actif: true
  })).filter(p => p.subcategory_id && p.marque_id)

  console.log(`⏳ Insertion de ${produits.length} produits...`)
  const BATCH = 100
  let prodMap = {}

  for (let i = 0; i < produits.length; i += BATCH) {
    const batch = produits.slice(i, i + BATCH)
    const { data: inserted, error } = await supabase.from('produits').upsert(batch, { onConflict: 'slug' }).select('id, slug')
    if (error) { console.log('Erreur produits:', error.message); continue }
    inserted.forEach(p => { prodMap[p.slug] = p.id })
    console.log(`⏳ Produits: ${Math.min(i + BATCH, produits.length)}/${produits.length}`)
  }

  // 4. Insertion groupée des revêtements
  const revetements = data.map(item => ({
    produit_id: prodMap[item.slug],
    larc_approuve: true,
    numero_larc: item.code,
    couleurs_dispo: item.colors,
    type_revetement: item.type
  })).filter(r => r.produit_id)

  console.log(`⏳ Insertion de ${revetements.length} revêtements...`)
  for (let i = 0; i < revetements.length; i += BATCH) {
    const batch = revetements.slice(i, i + BATCH)
    const { error } = await supabase.from('revetements').upsert(batch, { onConflict: 'produit_id' })
    if (error) console.log('Erreur revêtements:', error.message)
    console.log(`⏳ Revêtements: ${Math.min(i + BATCH, revetements.length)}/${revetements.length}`)
  }

  console.log(`\n✅ Import terminé !`)
}

main().catch(console.error)
