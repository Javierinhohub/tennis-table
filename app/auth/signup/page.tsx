'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { pseudo }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      // Insérer le profil utilisateur
      if (data.user) {
        await supabase.from('utilisateurs').insert({
          id: data.user.id,
          pseudo,
          role: 'user'
        })
      }
      setMessage('✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-md mx-auto p-8 mt-16">
      <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
      <p className="text-gray-500 mb-8">Rejoignez la communauté tennis de table</p>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pseudo</label>
          <input
            type="text"
            value={pseudo}
            onChange={e => setPseudo(e.target.value)}
            required
            minLength={3}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MonPseudo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vous@exemple.fr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8 caractères minimum"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </main>
  )
}