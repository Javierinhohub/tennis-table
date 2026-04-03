// Script d'import LARC 2026 → Supabase
// Exécuter : node import-larc.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ⚠️ Remplacez par vos vraies valeurs (dans votre .env.local)
const SUPABASE_URL = https://zrwobhblvyxqqarilxde.supabase.co
const SUPABASE_SERVICE_KEY =sb_secret_nz7eehbA_IKcTTo6Xh9WvA_rqwxJuw6 // ← clé "service_role" (pas anon)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const TYPE_MAP = {
  'In':   'revetements-inverse',
  'Out':  'revetements-picots-courts',
  'Long': 'revetements-picots-longs',
  'Anti': 'revetements-anti-spin'
}

async function main() {
  const data = JSON.parse(readFileSync('./larc_data.json', 'utf-8'))
  console.log(`📦 ${data.length} revêtements à importer...`)

  // 1. Récupérer les sous-catégories
  const { data: subcats } = await supabase.from('sous_categories').select('id, slug')
  const subcatMap = Object.fromEntries(subcats.map(s => [s.slug, s.id]))

  // 2. Insérer toutes les marques uniques
  const brands = [...new Set(data.map(d => d.brand))]
  console.log(`🏷️  ${brands.length} marques à insérer...`)
  for (const nom of brands) {
    await supabase.from('marques').upsert({ nom }, { onConflict: 'nom', ignoreDuplicates: true })
  }

  // 3. Récupérer les IDs des marques
  const { data: marquesData } = await supabase.from('marques').select('id, nom')
  const marqueMap = Object.fromEntries(marquesData.map(m => [m.nom, m.id]))

  // 4. Insérer les produits + revêtements par lots de 50
  let success = 0, errors = 0
  const BATCH = 50

  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH)

    for (const item of batch) {
      try {
        const subcatSlug = TYPE_MAP[item.type] || 'revetements-inverse'
        const subcatId = subcatMap[subcatSlug]
        const marqueId = marqueMap[item.brand]

        if (!subcatId || !marqueId) {
          console.warn(`⚠️  Ignoré: ${item.brand} - ${item.product} (sous-cat ou marque manquante)`)
          errors++
          continue
        }

        // Insérer le produit
        const { data: prod, error: prodErr } = await supabase
          .from('produits')
          .upsert({
            subcategory_id: subcatId,
            marque_id: marqueId,
            nom: item.product,
            slug: item.slug,
            actif: true
          }, { onConflict: 'slug', ignoreDuplicates: false })
          .select('id')
          .single()

        if (prodErr) { errors++; continue }

        // Insérer le détail revêtement
        await supabase.from('revetements').upsert({
          produit_id: prod.id,
          larc_approuve: true,
          numero_larc: item.code,
          couleurs_dispo: item.colors,
          type_revetement: item.type
        }, { onConflict: 'produit_id', ignoreDuplicates: false })

        success++
      } catch (e) {
        errors++
        console.error(`Erreur: ${item.brand} - ${item.product}:`, e.message)
      }
    }

    const pct = Math.round(((i + BATCH) / data.length) * 100)
    console.log(`⏳ ${Math.min(i + BATCH, data.length)}/${data.length} (${pct}%)`)
  }

  console.log(`\n✅ Import terminé !`)
  console.log(`   Succès : ${success}`)
  console.log(`   Erreurs : ${errors}`)
}

main().catch(console.error)
