export default function Skeleton({ width = "100%", height = "16px", borderRadius = "4px" }: { width?: string, height?: string, borderRadius?: string }) {
  return (
    <>
      <div style={{ width, height, borderRadius, background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`}</style>
    </>
  )
}