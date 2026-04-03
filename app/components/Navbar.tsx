'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState('')
  const [role, setRole] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profil } = await supabase.from('utilisateurs').select('pseudo, role').eq('id', data.user.id).single()
        setPseudo(profil?.pseudo || '')
        setRole(profil?.role || '')
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data: profil } = await supabase.from('utilisateurs').select('pseudo, role').eq('id', session.user.id).single()
        setPseudo(profil?.pseudo || '')
        setRole(profil?.role || '')
      } else { setPseudo(''); setRole('') }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.3px' }}>TT Matériel</span>
          <span style={{ background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>LARC 2026</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Revêtements</Link>
          {role === 'admin' && (
            <Link href="/admin" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Administration</Link>
          )}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{pseudo}</span>
              <button onClick={handleLogout} style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 500 }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/auth/login" style={{ color: 'var(--text)', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 500, background: 'var(--bg)' }}>
                Connexion
              </Link>
              <Link href="/auth/signup" style={{ background: 'var(--accent)', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: 600 }}>
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
