import { useEffect, useState } from 'react'
import { getSchedules } from '../../lib/supabase'
import logoW from '../../design-system/assets/logo-white.svg'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function fmt(t) {
  if (!t) return ''
  return t.slice(0, 5) + ' hs'
}

// Agrupa filas DB por label (case-insensitive trim): { label, days, shifts: [{open, close}] }
function groupSchedules(rows) {
  const map = new Map()
  for (const row of rows) {
    const key = row.label.trim().toLowerCase()
    if (!map.has(key)) {
      map.set(key, { label: row.label.trim(), days: row.days ?? [], shifts: [], position: row.position ?? 0 })
    }
    const g = map.get(key)
    g.shifts.push({ open: row.open_time, close: row.close_time })
    // usar el menor position como base del grupo
    if ((row.position ?? 0) < g.position) g.position = row.position ?? 0
  }
  return [...map.values()].sort((a, b) => a.position - b.position)
}

function isOpen(rows) {
  const now = new Date()
  const day = now.getDay()
  const hhmm = now.getHours() * 60 + now.getMinutes()
  for (const row of rows) {
    if (!row.days?.includes(day)) continue
    const [oh, om] = row.open_time.split(':').map(Number)
    const [ch, cm] = row.close_time.split(':').map(Number)
    if (hhmm >= oh * 60 + om && hhmm < ch * 60 + cm) return true
  }
  return false
}

export default function PlacaHorario({ slide }) {
  const [rows, setRows] = useState([])
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    getSchedules().then(setRows).catch(console.error)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const open = isOpen(rows)
  const groups = groupSchedules(rows)
  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: open ? 'var(--black-c)' : '#1a1a1a',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Círculo decorativo */}
      <div style={{
        position: 'absolute', width: 900, height: 900,
        borderRadius: '50%',
        background: open ? 'var(--coke-red)' : 'var(--ink-700)',
        opacity: 0.12, top: -250, right: -250,
      }} />

      {/* Logo */}
      <img src={logoW} alt="Kiosco Enjoy" style={{
        position: 'absolute', top: 64, left: 56, height: 80,
      }} />

      {/* Hora grande */}
      <div style={{
        fontSize: 240, fontWeight: 900, fontStyle: 'italic',
        color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
        textShadow: '0 4px 40px rgba(0,0,0,0.4)',
      }}>
        {timeStr}
      </div>

      {/* Fecha */}
      <div style={{
        fontSize: 44, fontWeight: 600, fontStyle: 'italic',
        color: 'rgba(255,255,255,0.6)',
        marginTop: 16, textTransform: 'capitalize',
      }}>
        {dateStr}
      </div>

      {/* Badge ABIERTO / CERRADO */}
      <div style={{
        marginTop: 60,
        background: open ? 'var(--success)' : 'var(--coke-red)',
        color: '#fff',
        fontWeight: 800, fontStyle: 'italic', fontSize: 56,
        padding: '20px 64px', borderRadius: 999,
        letterSpacing: '0.04em',
      }}>
        {open ? '✓ ABIERTO' : '✕ CERRADO'}
      </div>

      {/* Franjas horarias agrupadas */}
      {groups.length > 0 && (
        <div style={{ marginTop: 64, width: '80%' }}>
          <div style={{
            fontSize: 34, fontWeight: 700, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.5)', textAlign: 'center',
            marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Horario de atención
          </div>
          {groups.map((g, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: '18px 0', gap: 24,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 36 }}>
                {g.label}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {g.shifts.map((sh, j) => (
                  <span key={j} style={{ color: '#fff', fontWeight: 800, fontStyle: 'italic', fontSize: 40, whiteSpace: 'nowrap' }}>
                    {fmt(sh.open)} — {fmt(sh.close)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
