"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const TYPE_LABELS: Record<string, string> = { In: "Inversé", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin" }

export default function Home() {
  const [tous, setTous] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase
      .from("produits")
      .select("id, nom, slug, marques(nom), revetements(numero_larc, type_revetement, couleurs_dispo)")
      .eq("actif", true)
      .order("nom")
      .limit(2000)
    setTous(data || [])
    setLoading(false)
  }

  const resultats = tous.filter(p => {
    const s = search.toLowerCase()
    const nomOk = !search || p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))
    const typeOk = !typeFilter || (p.revetements && p.revetements.type_revetement === typeFilter)
    return nomOk && typeOk
  })

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🏓 Matériel de tennis de table</h1>
        <p className="text-gray-500">Liste LARC 2026 — {tous.length} revêtements approuvés</p>
      </div>
      <div className="flex gap-4 mb-6 flex-wrap">
        <input type="text" placeholder="🔍 Rechercher un revêtement ou une marque..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-64" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tous les types</option>
          <option value="In">Inversé</option>
          <option value="Out">Picots courts</option>
          <option value="Long">Picots longs</option>
          <option value="Anti">Anti-spin</option>
        </select>
      </div>
      <p className="text-sm text-gray-400 mb-4">{resultats.length} résultat(s)</p>
      {loading && <div className="text-center py-20 text-gray-400">Chargement...</div>}
      {!loading && resultats.length === 0 && <div className="text-center py-20 text-gray-400">Aucun revêtement trouvé.</div>}
      {!loading && resultats.length > 0 && (
        <div className="grid gap-3">
          {resultats.map(p => {
            const rev = p.revetements
            const marque = p.marques
            return (
              <a href={"/revetements/" + p.slug} key={p.id} className="border rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition bg-white block">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-lg">{p.nom}</h2>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{marque && marque.nom}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-500 flex-wrap">
                      <span>📋 {rev && rev.numero_larc}</span>
                      <span>· {rev && (TYPE_LABELS[rev.type_revetement] || rev.type_revetement)}</span>
                      <span>· 🎨 {rev && rev.couleurs_dispo}</span>
                    </div>
                  </div>
                  <span className="shrink-0 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">✅ Approuvé</span>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </main>
  )
}
