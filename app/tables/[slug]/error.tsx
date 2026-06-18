"use client"

export default function TableError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
      <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Une erreur est survenue</p>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>{error.message}</p>
      <button onClick={reset}
        style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
        Réessayer
      </button>
    </main>
  )
}
