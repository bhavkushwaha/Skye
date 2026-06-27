import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Star, Loader } from 'lucide-react'
import { searchCity } from '@skye/weather-sdk'
import { useWeatherStore } from '@skye/shared-hooks'
import type { GeoResult } from '@skye/weather-sdk'

interface Props {
  onClose: () => void
}

export function LocationSearch({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setActiveLocation, savedLocations, addSavedLocation } = useWeatherStore()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await searchCity(query)
        setResults(res)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function selectLocation(result: GeoResult) {
    const loc = {
      id: `${result.latitude}-${result.longitude}`,
      name: result.name,
      country: result.country_code,
      coords: { lat: result.latitude, lon: result.longitude },
      isFavorite: false,
    }
    setActiveLocation(loc)
    addSavedLocation(loc)
    onClose()
  }

  const showSaved = !query && savedLocations.length > 0
  const showResults = results.length > 0

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 60,
        padding: '60px 20px 20px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(15,20,40,0.82)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
        initial={{ y: -16, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -16, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {isSearching
            ? <Loader size={15} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
            : <Search size={15} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
          }
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state, country..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
            >
              <X size={11} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '8px 8px 8px' }}>
          {/* Saved locations */}
          <AnimatePresence>
            {showSaved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>
                  Saved
                </div>
                {savedLocations.slice(0, 4).map((loc) => (
                  <LocationRow
                    key={loc.id}
                    primary={loc.name}
                    secondary={loc.country}
                    icon={<Star size={13} style={{ color: loc.isFavorite ? '#f59e0b' : 'rgba(255,255,255,0.25)', fill: loc.isFavorite ? '#f59e0b' : 'none' }} />}
                    onClick={() => { setActiveLocation(loc); onClose() }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {query && (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>
                    Results
                  </div>
                )}
                {results.map((r) => (
                  <LocationRow
                    key={r.id}
                    primary={r.name}
                    secondary={[r.admin1, r.country].filter(Boolean).join(', ')}
                    icon={<MapPin size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                    onClick={() => selectLocation(r)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {query.length >= 2 && !isSearching && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No results for "{query}"
            </div>
          )}

          {!query && savedLocations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
              Search for a city to get started
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function LocationRow({ primary, secondary, icon, onClick }: {
  primary: string; secondary: string; icon: React.ReactNode; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 10px', borderRadius: 12, background: 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.15s',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.07)' }}
      whileTap={{ scale: 0.99 }}
    >
      <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{primary}</div>
        <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginTop: 1 }}>{secondary}</div>
      </div>
    </motion.button>
  )
}
