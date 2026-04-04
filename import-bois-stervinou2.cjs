
const { createClient } = require('@supabase/supabase-js')

const fs = require('fs')

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

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

  // Récupérer TOUS les produits avec leur marque

  let allProduits = []

  let from = 0

  while (true) {

    const { data } = await s.from('produits').select('id, nom, marques(nom)').eq('actif', true).range(from, from + 999)

    if (!data || data.length === 0) break

    allProduits = allProduits.concat(data)

    if (data.length < 1000) break

    from += 1000

  }

  console.log(`🗄️  ${allProduits.length} produits au total dans Supabase`)

  let success = 0, notFound = 0

  for (const b of boisCSV) {

    const nomCSV = b.nom.toLowerCase().trim()

    const marqueCSV = b.marque.toLowerCase().trim()

    const prod = allProduits.find(p => {

      const nomDB = p.nom.toLowerCase().trim()

      const marqueDB = (p.marques?.nom || '').toLowerCase().trim()

      return marqueDB === marqueCSV && (

        nomDB === nomCSV ||

        nomDB.includes(nomCSV) ||

        nomCSV.includes(nomDB)

      )

    })

    if (!prod) { notFound++; continue }

    const poids = b.poids_g && b.poids_g !== '0' ? parseInt(b.poids_g) : null

    const ep = b.epaisseur_mm && b.epaisseur_mm !== '0' && b.epaisseur_mm !== '0.0' ? parseFloat(b.epaisseur_mm) : null

    const { error } = await s.from('bois').upsert({

      produit_id: prod.id,

      poids_g: poids,

      epaisseur_mm: ep,

      nb_plis: b.nb_plis ? parseInt(b.nb_plis) : null,

      composition: b.composition || null,

      pli1: b.pli1 || null, pli2: b.pli2 || null, pli3: b.pli3 || null,

      pli4: b.pli4 || null, pli5: b.pli5 || null, pli6: b.pli6 || null,

      pli7: b.pli7 || null,

    }, { onConflict: 'produit_id' })

    if (error) {

      console.log(`  ⚠️  ${b.marque} — ${b.nom}: ${error.message}`)

    } else {

      console.log(`  ✅ ${b.marque} — ${b.nom}`)

      success++

    }

  }

  console.log(`\n🎉 ${success} insérés, ${notFound} non trouvés`)

}

main().catch(console.error)

