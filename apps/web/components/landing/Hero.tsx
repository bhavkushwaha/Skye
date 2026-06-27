'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Cloud, Wind, Droplets } from 'lucide-react'

export function Hero() {
  return (
    <section style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '80px 20px 60px',
    }}>
      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,8,16,0.85) 100%)' }} />
      </div>

      {/* Headline + CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', maxWidth: 680, position: 'relative', zIndex: 10 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            color: '#a5b4fc', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
          }}
        >
          <Cloud size={12} />
          NOW AVAILABLE AS A PWA
        </motion.div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-2px', color: 'white', marginBottom: 20,
        }}>
          Weather,{' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            beautifully
          </span>
          {' '}reimagined
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(15px, 2.5vw, 19px)', lineHeight: 1.6, marginBottom: 40, fontWeight: 400 }}>
          Real-time forecasts, air quality monitoring, and cinematic animated backgrounds — all in one premium app. Works on every device, installs from your browser.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/weather" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 700,
                boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                cursor: 'pointer',
              }}
            >
              Open Weather App
              <ArrowRight size={16} />
            </motion.div>
          </Link>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600,
              backdropFilter: 'blur(12px)', cursor: 'pointer', textDecoration: 'none',
            }}
          >
            Learn more
          </motion.a>
        </div>
      </motion.div>

      {/* Floating glassmorphic weather card mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        style={{ position: 'relative', zIndex: 10, marginTop: 64, width: '100%', maxWidth: 340 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'rgba(15,20,40,0.7)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: '24px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>📍 Mumbai, IN</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-2px' }}>31°</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, marginTop: 4 }}>Partly Cloudy</div>
            </div>
            <div style={{ fontSize: 56, lineHeight: 1 }}>⛅</div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { icon: <Wind size={12} />, label: 'Wind', val: '14 km/h' },
              { icon: <Droplets size={12} />, label: 'Humidity', val: '78%' },
              { icon: <Cloud size={12} />, label: 'AQI', val: 'Good' },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{m.icon}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>{m.val}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 10, color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
      >
        scroll
      </motion.div>
    </section>
  )
}
