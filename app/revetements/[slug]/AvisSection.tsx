'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AvisSection({ produitId }: { produitId: string }) {
  const [avis, setAvis] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [note, setNote] = useState(5)
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [styleJeu, setStyleJeu] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAvis()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchAvis() {
    const { data } = await supabase
      .from('avis')
      .select('*, utilisateurs(pseudo)')
      .eq('produit_id', produitId)
      .eq('valide', true)
      .order('cree_le', { ascending: false })
    setAvis(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('avis').insert({
      produit_id: produitId,
      user_id: user.id,
      note,
      titre,
      contenu,
      style_jeu: styleJeu,
      valide: false
    })

    if (error) {
      setMessage('Une erreur est survenue.')
    } else {
      setMessage('✅ Votre avis a été soumis et sera visible après modération.')
      setTitre('')
      setContenu('')
      setStyleJeu('')
      setNote(5)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Avis ({avis.length})
      </h2>

      {/* Liste des avis */}
      {avis.length === 0 ? (
        <p className="text-gray-400 mb-8">Aucun avis pour le moment. Soyez le premier !</p>
      ) : (
        <div className="grid gap-4 mb-8">
          {avis.map(a => (
            <div key={a.id} className="border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{a.titre}</span>
                  {a.style_jeu && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {a.style_jeu}
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={i <= a.note ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{a.contenu}</p>
              <p className="text-xs text-gray-400">
                Par {a.utilisateurs?.pseudo} · {new Date(a.cree_le).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire avis */}
      {user ? (
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Laisser un avis</h3>
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNote(i)}
                    className={`text-2xl transition ${i <= note ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Résumez votre avis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Votre avis</label>
              <textarea
                value={contenu}
                onChange={e => setContenu(e.target.value)}
                required
                rows={4}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre expérience avec ce revêtement..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Votre style de jeu</label>
              <select
                value={styleJeu}
                onChange={e => setStyleJeu(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir...</option>
                <option value="Attaquant">Attaquant</option>
                <option value="Défenseur">Défenseur</option>
                <option value="Tout-jeu">Tout-jeu</option>
                <option value="Débutant">Débutant</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Publier mon avis'}
            </button>
          </form>
        </div>
      ) : (
        <div className="border rounded-xl p-6 text-center text-gray-500">
          <p className="mb-3">Connectez-vous pour laisser un avis</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-blue-700 transition"
          >
            Se connecter
          </Link>
        </div>
      )}
    </div>
  )
}