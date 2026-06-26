import { useEffect, useState } from 'react'
import { getSchedules } from '../../lib/supabase'
import logoR from '../../design-system/assets/logo-red.svg'
import './placa-animations.css'

function fmt(t) {
  if (!t) return ''
  return t.slice(0, 5) + ' hs'
}

function groupSchedules(rows) {
  const map = new Map()
  for (const row of rows) {
    const key = row.label.trim().toLowerCase()
    if (!map.has(key)) {
      map.set(key, { label: row.label.trim(), shifts: [], position: row.position ?? 0 })
    }
    const g = map.get(key)
    g.shifts.push({ open: row.open_time, close: row.close_time })
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
  const c = slide?.placa_config ?? {}
  const [rows, setRows] = useState([])

  useEffect(() => {
    getSchedules().then(setRows).catch(console.error)
  }, [])

  const open = isOpen(rows)
  const groups = groupSchedules(rows)
  const badgeText = c.badge || 'HORARIOS'
  const footer = c.footer || ''

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--brilliant-white)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '64px 56px 56px',
      boxSizing: 'border-box',
    }}>
      {/* Header: logo + badge */}
      <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <img src={logoR} alt="Kiosco Enjoy" style={{ height: 60 }} />
        <div style={{
          background: 'var(--black-c)', color: '#fff',
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 28, letterSpacing: '0.04em',
          padding: '10px 24px', borderRadius: 8,
        }}>
          {badgeText}
        </div>
      </div>

      {/* Status: Estamos abiertos / cerrados */}
      <div className="anim-fade-up delay-1" style={{
        marginTop: 80,
        fontWeight: 900, fontStyle: 'italic',
        fontSize: 120, lineHeight: 0.9,
        color: open ? 'var(--coke-red)' : 'var(--black-c)',
        letterSpacing: '-0.02em',
      }}>
        {open ? 'Estamos\nabiertos' : 'Estamos\ncerrados'}
      </div>

      {/* Grupos de horario */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40, marginTop: 40 }}>
        {groups.map((g, i) => (
          <div key={i} className={`anim-fade-up delay-${Math.min(i + 2, 5)}`}>
            <div style={{
              fontWeight: 600, fontStyle: 'italic',
              fontSize: 34, color: 'var(--ink-500)',
              marginBottom: 8,
            }}>
              {g.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {g.shifts.map((sh, j) => (
                <div key={j} style={{
                  fontWeight: 800,
                  fontSize: groups.length > 2 ? 56 : 64,
                  lineHeight: 1.05,
                  color: 'var(--black-c)',
                  letterSpacing: '-0.01em',
                }}>
                  {fmt(sh.open)} – {fmt(sh.close)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer configurable */}
      {footer && (
        <div className="anim-fade-in delay-5" style={{
          fontWeight: 600, fontStyle: 'italic',
          fontSize: 28, color: 'var(--ink-400)',
          marginTop: 'auto', paddingTop: 32,
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
