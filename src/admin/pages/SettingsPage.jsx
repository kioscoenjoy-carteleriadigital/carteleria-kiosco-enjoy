import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, X, Clock } from 'lucide-react'
import { getSettings, setSetting, getSchedules, upsertSchedule, deleteSchedule } from '../../lib/supabase'

const TRANSITIONS = [
  { value: 'fade',  label: 'Fade', desc: 'Fundido suave' },
  { value: 'slide', label: 'Slide', desc: 'Deslizamiento horizontal' },
  { value: 'zoom',  label: 'Zoom', desc: 'Zoom + fade' },
]
const DAYS_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Agrupa filas DB por label+days en "grupos" con múltiples turnos
function groupSchedules(rows) {
  const map = new Map()
  for (const row of rows) {
    const key = row.label + '|' + (row.days ?? []).slice().sort().join(',')
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: row.label,
        days: row.days ?? [],
        shifts: [],
        rowIds: [],
        position: row.position,
      })
    }
    const g = map.get(key)
    g.shifts.push({ open: row.open_time?.slice(0, 5) ?? '08:00', close: row.close_time?.slice(0, 5) ?? '22:00' })
    g.rowIds.push(row.id)
  }
  return [...map.values()]
}

const EMPTY_GROUP = { label: '', days: [], shifts: [{ open: '08:00', close: '22:00' }], rowIds: [], position: 0 }

export default function SettingsPage({ toast }) {
  const [settings, setSettings]   = useState({})
  const [schedules, setSchedules] = useState([])
  const [editor, setEditor]       = useState(null)
  const [saving, setSaving]       = useState(false)

  const load = useCallback(async () => {
    const [s, sc] = await Promise.all([getSettings(), getSchedules()])
    setSettings(s)
    setSchedules(sc)
  }, [])
  useEffect(() => { load() }, [load])

  async function saveSetting(key, value) {
    setSaving(true)
    await setSetting(key, value)
    setSettings(s => ({ ...s, [key]: value }))
    setSaving(false)
    toast('✓ Configuración guardada')
  }

  // Guarda un grupo: borra filas anteriores e inserta una por turno
  async function handleSaveGroup(group) {
    try {
      // Borrar filas existentes del grupo
      for (const id of group.rowIds ?? []) {
        await deleteSchedule(id)
      }
      // Insertar una fila por cada turno
      for (let i = 0; i < group.shifts.length; i++) {
        const shift = group.shifts[i]
        await upsertSchedule({
          label: group.label,
          days: group.days.map(Number),
          open_time: shift.open,
          close_time: shift.close,
          position: (group.position ?? 0) + i * 0.01,
        })
      }
      toast('✓ Horario guardado')
      setEditor(null)
      load()
    } catch (e) { alert('Error: ' + e.message) }
  }

  async function handleDeleteGroup(group) {
    if (!confirm(`¿Eliminar "${group.label}"?`)) return
    for (const id of group.rowIds) await deleteSchedule(id)
    toast('Horario eliminado')
    load()
  }

  const groups = groupSchedules(schedules)

  return (
    <div>
      <div className="adm-page-head"><h1>Configuración</h1></div>

      {/* Transición */}
      <div className="settings-section">
        <h2>Transición entre slides</h2>
        <div className="adm-card" style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {TRANSITIONS.map(t => (
            <button
              key={t.value}
              className={`btn ${settings.transition === t.value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => saveSetting('transition', t.value)}
              style={{ flex: '1 1 120px', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', gap: 4 }}
            >
              <strong>{t.label}</strong>
              <span style={{ fontSize: 12, fontWeight: 400, color: settings.transition === t.value ? 'rgba(255,255,255,0.75)' : 'var(--fg3)' }}>{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duración default */}
      <div className="settings-section">
        <h2>Duración default de slides</h2>
        <div className="adm-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            className="adm-input"
            type="number" min={3} max={120}
            value={settings.default_duration ?? 10}
            onChange={e => setSettings(s => ({ ...s, default_duration: e.target.value }))}
            style={{ maxWidth: 100 }}
          />
          <span style={{ color: 'var(--fg3)', fontSize: 14 }}>segundos</span>
          <button className="btn btn-primary btn-sm" onClick={() => saveSetting('default_duration', settings.default_duration)} disabled={saving}>
            Guardar
          </button>
        </div>
      </div>

      {/* Horarios de atención */}
      <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ marginBottom: 0 }}>Horario de atención</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setEditor({ ...EMPTY_GROUP, shifts: [{ open: '08:00', close: '22:00' }], rowIds: [] })}>
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="adm-card">
          {groups.length === 0 ? (
            <div className="adm-empty" style={{ padding: '24px 16px' }}>
              <p>Sin horarios configurados.</p>
            </div>
          ) : groups.map(g => (
            <div key={g.key} className="schedule-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{g.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>
                    {g.days?.map(d => DAYS_LABELS[d]).join(', ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditor({ ...g })}>✏️</button>
                  <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--coke-red)' }} onClick={() => handleDeleteGroup(g)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Turnos del grupo */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 2 }}>
                {g.shifts.map((sh, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'var(--bg2)', borderRadius: 8,
                    padding: '6px 14px',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
                  }}>
                    <Clock size={13} style={{ color: 'var(--coke-red)', flexShrink: 0 }} />
                    {sh.open} — {sh.close}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editor && (
        <ScheduleModal group={editor} onSave={handleSaveGroup} onClose={() => setEditor(null)} />
      )}
    </div>
  )
}

function ScheduleModal({ group, onSave, onClose }) {
  const [form, setForm] = useState({
    ...group,
    days: group.days ?? [],
    shifts: group.shifts?.length ? group.shifts : [{ open: '08:00', close: '22:00' }],
  })

  function toggleDay(d) {
    setForm(f => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d].sort(),
    }))
  }

  function setShift(i, k, v) {
    setForm(f => {
      const shifts = [...f.shifts]
      shifts[i] = { ...shifts[i], [k]: v }
      return { ...f, shifts }
    })
  }

  function addShift() {
    setForm(f => ({ ...f, shifts: [...f.shifts, { open: '08:00', close: '22:00' }] }))
  }

  function removeShift(i) {
    setForm(f => ({ ...f, shifts: f.shifts.filter((_, j) => j !== i) }))
  }

  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h2>{form.rowIds?.length ? 'Editar horario' : 'Nuevo horario'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="adm-field">
          <label className="adm-label">Nombre</label>
          <input className="adm-input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Lunes a Viernes" />
        </div>

        <div className="adm-field">
          <label className="adm-label">Días</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[0,1,2,3,4,5,6].map(d => (
              <button
                key={d}
                className={`btn btn-sm ${form.days.includes(d) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleDay(d)}
                style={{ minWidth: 48 }}
              >
                {DAYS_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <label className="adm-label" style={{ marginBottom: 0 }}>Turnos</label>
            <button className="btn btn-secondary btn-sm" onClick={addShift}>
              <Plus size={13} /> Agregar turno
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.shifts.map((sh, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label className="adm-label" style={{ fontSize: 12 }}>Abre</label>
                  <input className="adm-input" type="time" value={sh.open} onChange={e => setShift(i, 'open', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="adm-label" style={{ fontSize: 12 }}>Cierra</label>
                  <input className="adm-input" type="time" value={sh.close} onChange={e => setShift(i, 'close', e.target.value)} />
                </div>
                {form.shifts.length > 1 && (
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: 'var(--coke-red)', marginTop: 20, flexShrink: 0 }}
                    onClick={() => removeShift(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
