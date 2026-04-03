'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <main className="max-w-md mx-auto p-8 mt-16">
      <h1 className="text-3xl font-bold mb-2">Se connecter</h1>
      <p className="text-gray-500 mb-8">Bon retour parmi nous !</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Votre mot de passe"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </main>
  )
}