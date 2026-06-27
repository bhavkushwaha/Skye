import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#050810', color: 'white', textAlign: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🌐</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10 }}>You're offline</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 320, lineHeight: 1.6, marginBottom: 32 }}>
        Skye needs a connection to fetch live weather data. Check your network and try again.
      </p>
      <Link href="/weather" style={{
        display: 'inline-block', padding: '12px 24px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none',
      }}>
        Try again
      </Link>
    </div>
  )
}
