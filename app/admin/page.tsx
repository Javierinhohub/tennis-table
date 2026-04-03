'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [onglet, setOnglet] = useState('avis')
  const [avis, setAvis] = useState([])
  const [produits, setProduits] = useState([])
  const [marques, setMarques] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Nouveau produit
  const [nom, setNom] = useState('')
  const [marqueId, setMarqueId] = useState('')
  const [subcatId, setSubcatId] = useState('')
  const [subcats, setSubcats] = useState([])
  const [numeroLarc, setNumeroLarc] = useState('')
  const [typeRev, setTypeRev] = useState('In')
  const [couleurs, setCouleurs] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setUser(user)
    const { data: profil } = await supabase.from('utilisateurs').select('role').eq('id', user.id).single()
    if (!profil || profil.role !== 'admin') { router.push('/'); return }
    setRole(profil.role)
    await Promise.all([fetchAvis(), fetchProduits(), fetchMarques(), fetchSubcats()])
    setLoading(false)
  }

  async function fetchAvis() {
    const { data } = await supabase
      .from('avis')
      .select('*, utilisateurs(pseudo), produits(nom)')
      .order('cree_le', { ascending: false })
    setAvis(data || [])
  }

  async function fetchProduits() {
    const { data } = await supabase
      .from('produits')
      .select('id, nom, actif, marques(nom), sous_categories(nom)')
      .order('nom')
      .limit(100)
    setProduits(data || [])
  }

  async function fetchMarques() {
    const { data } = await supabase.from('marques').select('id, nom').order('nom')
    setMarques(data || [])
  }

  async function fetchSubcats() {
    const { data } = await supabase.from('sous_categories').select('id, nom, slug').order('nom')
    setSubcats(data || [])
  }

  async function validerAvis(id, valide) {
    await supabase.from('avis').update({ valide }).eq('id', id)
    await fetchAvis()
  }

  async function supprimerAvis(id) {
    if (!confirm('Supprimer cet avis ?')) return
    await supabase.from('avis').delete().eq('id', id)
    await fetchAvis()
  }

  async function toggleProduit(id, actif) {
    await supabase.from('produits').update({ actif: !actif }).eq('id', id)
    await fetchProduits()
  }

  async function supprimerProduit(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    await fetchProduits()
  }

  async function ajouterProduit(e) {
    e.preventDefault()
    setMessage('')
    const slug = (marques.find(m => m.id === marqueId)?.nom + '-' + nom + '-' + numeroLarc)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80)

    const { data: prod, error } = await supabase
      .from('produits')
      .insert({ subcategory_id: subcatId, marque_id: marqueId, nom, slug, actif: true })
      .select('id').single()

    if (error) { setMessage('Erreur : ' + error.message); return }

    await supabase.from('revetements').insert({
      produit_id: prod.id,
      larc_approuve: true,
      numero_larc: numeroLarc,
      type_revetement: typeRev,
      couleurs_dispo: couleurs
    })

    setMessage('✅ Revêtement ajouté avec succès !')
    setNom(''); setNumeroLarc(''); setCouleurs('')
    await fetchProduits()
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>

  const avisEnAttente = avis.filter(a => !a.valide)
  const avisValides = avis.filter(a => a.valide)

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Administration</h1>
          <p className="text-gray-500">Gestion du site tennis de table</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{avisEnAttente.length} avis en attente</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{produits.length} produits</span>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: 'avis', label: '💬 Avis' },
          { id: 'produits', label: '📦 Produits' },
          { id: 'ajouter', label: '➕ Ajouter un revêtement' },
        ].map(t => (
          <button key={t.id} onClick={() => setOnglet(t.id)}
            className={'px-4 py-2 text-sm font-medium border-b-2 transition ' + (onglet === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
            {t.label}
          </button>
        ))}
      </div>

      {onglet === 'avis' && (
        <div>
          {avisEnAttente.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">En attente de modération ({avisEnAttente.length})</h2>
              <div className="grid gap-3">
                {avisEnAttente.map(a => (
                  <div key={a.id} className="border rounded-xl p-4 bg-orange-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold">{a.titre}</p>
                        <p className="text-sm text-gray-500">{a.produits?.nom} · Par {a.utilisateurs?.pseudo} · {'★'.repeat(a.note)}</p>
                        <p className="text-sm text-gray-600 mt-1">{a.contenu}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => validerAvis(a.id, true)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">✅ Valider</button>
                        <button onClick={() => supprimerAvis(a.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200">🗑️ Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {avisValides.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Avis publiés ({avisValides.length})</h2>
              <div className="grid gap-3">
                {avisValides.map(a => (
                  <div key={a.id} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold">{a.titre}</p>
                        <p className="text-sm text-gray-500">{a.produits?.nom} · Par {a.utilisateurs?.pseudo} · {'★'.repeat(a.note)}</p>
                        <p className="text-sm text-gray-600 mt-1">{a.contenu}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => validerAvis(a.id, false)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200">⏸️ Dépublier</button>
                        <button onClick={() => supprimerAvis(a.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200">🗑️ Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {avis.length === 0 && <p className="text-gray-400 text-center py-12">Aucun avis pour le moment.</p>}
        </div>
      )}

      {onglet === 'produits' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Tous les produits ({produits.length})</h2>
          <div className="grid gap-2">
            {produits.map(p => (
              <div key={p.id} className={'border rounded-xl p-4 flex justify-between items-center gap-4 ' + (!p.actif ? 'opacity-50' : '')}>
                <div>
                  <span className="font-medium">{p.nom}</span>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.marques?.nom}</span>
                  <span className="ml-2 text-xs text-gray-400">{p.sous_categories?.nom}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleProduit(p.id, p.actif)} className={'px-3 py-1 rounded-lg text-sm ' + (p.actif ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200')}>
                    {p.actif ? '⏸️ Désactiver' : '✅ Activer'}
                  </button>
                  <button onClick={() => supprimerProduit(p.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {onglet === 'ajouter' && (
        <div className="max-w-lg">
          <h2 className="text-lg font-semibold mb-6">Ajouter un revêtement</h2>
          {message && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{message}</div>}
          <form onSubmit={ajouterProduit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Marque</label>
              <select value={marqueId} onChange={e => setMarqueId(e.target.value)} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choisir une marque...</option>
                {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom du revêtement</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Tenergy 05" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sous-catégorie</label>
              <select value={subcatId} onChange={e => setSubcatId(e.target.value)} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choisir...</option>
                {subcats.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro LARC</label>
              <input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 012-345" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={typeRev} onChange={e => setTypeRev(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="In">Inversé</option>
                <option value="Out">Picots courts</option>
                <option value="Long">Picots longs</option>
                <option value="Anti">Anti-spin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Couleurs disponibles</label>
              <input type="text" value={couleurs} onChange={e => setCouleurs(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Black, Red" />
            </div>
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition">
              ➕ Ajouter le revêtement
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
