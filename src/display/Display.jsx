import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase, getSlides, getSettings } from '../lib/supabase'
import SlideRenderer from './SlideRenderer'
import './transitions.css'

const CACHE_KEY = 'ke_slides_cache'
const TRANSITION_DURATION = 700

export default function Display() {
  const [slides, setSlides] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? [] } catch { return [] }
  })
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [transition, setTransition] = useState('fade')
  const timerRef = useRef(null)
  const slidesRef = useRef(slides)
  const currentRef = useRef(current)

  slidesRef.current = slides
  currentRef.current = current

  const loadPlaylist = useCallback(async () => {
    try {
      const data = await getSlides()
      if (data.length) {
        setSlides(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      }
    } catch (e) {
      console.warn('Usando caché local:', e.message)
    }
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const s = await getSettings()
      if (s.transition) setTransition(s.transition)
    } catch {}
  }, [])

  // Avanza al siguiente slide con transición
  const advance = useCallback(() => {
    const list = slidesRef.current
    if (list.length < 2) return
    setTransitioning(true)
    setPrev(currentRef.current)
    setTimeout(() => {
      setCurrent(i => (i + 1) % list.length)
      setTransitioning(false)
      setPrev(null)
    }, TRANSITION_DURATION)
  }, [])

  // Timer de rotación
  const scheduleNext = useCallback(() => {
    clearTimeout(timerRef.current)
    const list = slidesRef.current
    if (!list.length) return
    const duration = (list[currentRef.current]?.duration ?? 10) * 1000
    timerRef.current = setTimeout(advance, duration)
  }, [advance])

  useEffect(() => { scheduleNext() }, [current, slides, scheduleNext])

  // Carga inicial
  useEffect(() => {
    loadPlaylist()
    loadSettings()
  }, [loadPlaylist, loadSettings])

  // Realtime: slides o settings cambian → recargar
  useEffect(() => {
    const ch = supabase.channel('display-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slides' }, loadPlaylist)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, loadSettings)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [loadPlaylist, loadSettings])

  // Fullscreen al hacer click (útil en kiosco)
  useEffect(() => {
    const enter = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {})
      }
    }
    document.addEventListener('click', enter, { once: true })
    return () => document.removeEventListener('click', enter)
  }, [])

  if (!slides.length) return <Splash />

  const slideA = slides[current]
  const slideB = prev !== null ? slides[prev] : null

  return (
    <div
      className={`slide-wrap trans-${transition}`}
      style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}
    >
      {/* Slide anterior (saliendo) */}
      {slideB && (
        <div className={`slide-layer ${transitioning ? 'leaving' : ''}`}>
          <SlideRenderer slide={slideB} active={false} />
        </div>
      )}
      {/* Slide actual (entrando) */}
      <div className={`slide-layer ${!transitioning ? 'active' : ''}`}>
        <SlideRenderer slide={slideA} active={!transitioning} />
      </div>
    </div>
  )
}

function Splash() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--coke-red)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)',
    }}>
      <img
        src={new URL('../design-system/assets/logo-white.svg', import.meta.url).href}
        alt="Kiosco Enjoy"
        style={{ height: 120, marginBottom: 40 }}
      />
      <div style={{
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 600, fontStyle: 'italic', fontSize: 32,
      }}>
        Cargando cartelería…
      </div>
    </div>
  )
}
