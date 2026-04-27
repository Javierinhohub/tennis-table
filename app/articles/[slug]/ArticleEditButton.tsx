"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ArticleEditButton({ slug }: { slug: string }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      if (!u) return
      supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", u.id)
        .single()
        .then(({ data: profil }) => {
          if (profil?.role === "admin") setIsAdmin(true)
        })
    })
  }, [])

  if (!isAdmin) return null

  return (
    <a
      href={`/articles/${slug}/edit`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "#1A56DB",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      ✏️ Modifier l'article
    </a>
  )
}
