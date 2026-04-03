import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import AvisSection from './AvisSection'

const TYPE_LABELS: Record<string, string> = {
  In: 'Inversé',
  Out: 'Picots courts',
  Long: 'Picots longs',
  Anti: 'Anti-spin'
}

export default async function RevetementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from('produits')
    .select('id, nom, slug, marques(nom, pays, site_web), revetements(numero_larc, type_revetement, couleurs_dispo, larc_approuve, vitesse, spin, controle, durete, epaisseur_max)')
    .eq('slug', slug)
    .single()

  if (!produit) notFound()

  const rev = produit.revetements as any
  const marque = produit.marques as any
  const stats = [
    { label: 'Vitesse', value: rev?.vitesse },
    { label: 'Spin', value: rev?.spin },
    { label: 'Contrôle', value: rev?.controle },
    { label: 'Dureté', value: rev?.durete },
  ]

  return (
    <main className="max-w-3xl mx-auto p-8">
      <a href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Retour à la liste
      </a>
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{produit.nom}</h1>
          <p className="text-gray-500 text-lg">{marque?.nom}</p>
        </div>
        {rev?.larc_approuve && (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
            ✅ LARC 2026 approuvé
          </span>
        )}
      </div>
      <div className="bg-gray-50 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Code LARC</p>
          <p className="font-semibold">#{rev?.numero_larc}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Type</p>
          <p className="font-semibold">{TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Couleurs disponibles</p>
          <p className="font-semibold">{rev?.couleurs_dispo}</p>
        </div>
        {rev?.epaisseur_max && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Épaisseur max</p>
            <p className="font-semibold">{rev?.epaisseur_max} mm</p>
          </div>
        )}
        {marque?.pays && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Pays</p>
            <p className="font-semibold">{marque.pays}</p>
          </div>
        )}
        {marque?.site_web && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Site web</p>
            <a href={marque.site_web} target="_blank" className="text-blue-600 hover:underline font-semibold">{marque.site_web}</a>
          </div>
        )}
      </div>
      {stats.some(s => s.value) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.filter(s => s.value).map(stat => (
              <div key={stat.label} className="bg-white border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  <span className="font-bold">{stat.value}/10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: (stat.value / 10 * 100) + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <AvisSection produitId={produit.id} />
    </main>
  )
}
