// Composant serveur — affiche les vidéos YouTube liées à un produit

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
    /youtube\.com\/shorts\/([^?&\s]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function VideoSection({
  videos,
}: {
  videos: { id: string; youtube_url: string; titre: string | null }[]
}) {
  if (!videos || videos.length === 0) return null

  const valides = videos.filter(v => getYoutubeId(v.youtube_url))
  if (valides.length === 0) return null

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "1.2rem",
        }}
      >
        Vidéos de jeu
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {valides.map(v => {
          const videoId = getYoutubeId(v.youtube_url)!
          return (
            <div key={v.id}>
              {v.titre && (
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  {v.titre}
                </p>
              )}
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={v.titre || "Vidéo de jeu tennis de table"}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
