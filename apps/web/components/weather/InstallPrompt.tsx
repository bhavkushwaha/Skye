'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { usePWAInstall } from '@/hooks/usePWAInstall'

export function InstallPrompt() {
  const { canInstall, install } = usePWAInstall()

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, width: 'calc(100% - 32px)', maxWidth: 400,
            background: 'rgba(15,20,40,0.92)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 18,
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Download size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Install Skye</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Add to your home screen</div>
          </div>
          <button
            onClick={install}
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Install
          </button>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
