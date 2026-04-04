import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: '#D97757',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial Black, sans-serif',
        fontWeight: 900,
        fontSize: 11,
        color: 'white',
        letterSpacing: '-0.5px',
      }}>
        TTK
      </div>
    ),
    { ...size }
  )
}