export default function GlobalLoading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "Poppins, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "36px", height: "36px", border: "3px solid var(--border)", borderTopColor: "#D97757",
          borderRadius: "50%", animation: "spin 0.7s linear infinite"
        }} />
        <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>Chargement…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
