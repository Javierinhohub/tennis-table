'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profil } = await supabase
          .from('utilisateurs')
          .select('pseudo')
          .eq('id', data.user.id)
          .single()
        setPseudo(profil?.pseudo || '')
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data: profil } = await supabase
          .from('utilisateurs')
          .select('pseudo')
          .eq('id', session.user.id)
          .single()
        setPseudo(profil?.pseudo || '')
      } else {
        setPseudo('')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b bg-white px-8 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-600 transition">
          🏓 TT Matériel
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition">
            Revêtements
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">👋 {pseudo}</span>
              <button
                onClick={handleLogout}
                className="text-sm border rounded-lg px-4 py-1.5 hover:bg-gray-50 transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm border rounded-lg px-4 py-1.5 hover:bg-gray-50 transition"
              >
                Connexion
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-blue-600 text-white rounded-lg px-4 py-1.5 hover:bg-blue-700 transition"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}