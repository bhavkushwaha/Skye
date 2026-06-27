'use client'
import { motion } from 'framer-motion'
import { Wind, Smartphone, Layers } from 'lucide-react'

const features = [
  {
    icon: <Layers size={22} />,
    color: '#60a5fa',
    title: 'Cinematic Backgrounds',
    desc: 'Every weather condition — sunny, stormy, foggy, snowy — gets its own immersive animated scene that reacts to the actual sky outside.',
  },
  {
    icon: <Wind size={22} />,
    color: '#34d399',
    title: 'Live AQI Monitoring',
    desc: 'Real-time PM2.5, PM10, O₃, and NO₂ data via Open-Meteo. See what you\'re breathing with color-coded health levels, not just a number.',
  },
  {
    icon: <Smartphone size={22} />,
    color: '#c084fc',
    title: 'Install Anywhere',
    desc: 'Add to your Android home screen, iOS via Safari, or install as a desktop app — all from this page, no app store needed.',
  },
]

export function Features() {
  return (
    <section id="features" style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 56 }}
      >
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: 'white', letterSpacing: '-1px', marginBottom: 12 }}>
          Everything you need from a weather app
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
          No accounts, no API keys, no subscriptions. Just your weather, beautifully presented.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '28px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              cursor: 'default',
            }}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 14, marginBottom: 18,
              background: `${f.color}18`,
              border: `1px solid ${f.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: f.color,
            }}>
              {f.icon}
            </div>
            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.3px' }}>{f.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
