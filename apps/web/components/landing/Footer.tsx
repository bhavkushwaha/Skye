import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '32px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12,
      maxWidth: 1000, margin: '0 auto',
    }}>
      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
        © 2026 Skye Weather — a product of{' '}
        <a href="https://bhavkushwaha.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
          bhavkushwaha.com
        </a>
      </div>
      <Link href="/weather" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>Open App</Link>
    </footer>
  )
}
