'use client'
import { motion } from 'framer-motion'

const platforms = [
  {
    name: 'Android',
    emoji: '🤖',
    color: '#4ade80',
    steps: ['Open Skye in Chrome', 'Tap the menu (⋮) → "Add to Home screen"', 'Tap "Add" to confirm'],
  },
  {
    name: 'iOS / iPadOS',
    emoji: '🍎',
    color: '#60a5fa',
    steps: ['Open Skye in Safari', 'Tap the Share icon (□↑)', 'Scroll down → "Add to Home Screen"'],
  },
  {
    name: 'Desktop',
    emoji: '💻',
    color: '#c084fc',
    steps: ['Open Skye in Chrome or Edge', 'Click the install icon (⊕) in the address bar', 'Click "Install" in the dialog'],
  },
]

export function InstallSection() {
  return (
    <section style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <h2 style={{ fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800, color: 'white', letterSpacing: '-1px', marginBottom: 12 }}>
          Install in seconds
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, maxWidth: 420, margin: '0 auto' }}>
          Works like a native app — no App Store or Google Play required.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {platforms.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>{p.emoji}</span>
              <span style={{ color: p.color, fontSize: 15, fontWeight: 700 }}>{p.name}</span>
            </div>
            <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.steps.map((s, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                    background: `${p.color}18`, border: `1px solid ${p.color}30`,
                    color: p.color, fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>{j + 1}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.55 }}>{s}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
