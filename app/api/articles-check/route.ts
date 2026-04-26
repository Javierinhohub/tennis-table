import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== "ttkip2026check") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Compter tous les articles (publiés ou non)
  const { data: all, error: e1 } = await supabaseAdmin
    .from("articles")
    .select("id, titre, slug, publie, categorie, auteur_id, cree_le")
    .order("cree_le", { ascending: false })

  // Vérifier RLS avec la clé anon
  const { createClient } = await import("@supabase/supabase-js")
  const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: visible, error: e2 } = await supabaseAnon
    .from("articles")
    .select("id, titre, publie")
    .eq("publie", true)

  return NextResponse.json({
    total_en_base: all?.length ?? 0,
    articles: all ?? [],
    erreur_admin: e1?.message ?? null,
    visibles_anon: visible?.length ?? 0,
    erreur_anon: e2?.message ?? null,
  })
}
