import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { getSettings, setSetting, getSchedules, upsertSchedule, deleteSchedule } from '../../lib/supabase'

const TRANSITIONS = [
  { value: 'fade',  label: 'Fade', desc: 'Fundido suave' },
  { value: 'slide', label: 'Slide', desc: 'Deslizamiento horizontal' },
  { value: 'zoom',  label: 'Zoom', desc: 'Zoom + fade' },
]
const DAYS_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const EMPTY_SCHEDULE = { label: '', days: [], open_time: '08:00', close_time: '22:00', position: 0 }

export default function SettingsPage({ toast }) {
  const [settings, setSettings]     = useState({})
  const [schedules, setSchedules]   = useState([])
  const [schEditor, setSchEditor]   = useState(null)
  const [saving, setSaving]         = useState(false)

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

  async function handleSaveSchedule(s) {
    try {
      await upsertSchedule({ ...s, days: s.days.map(Number) })
      toast('✓ Horario guardado')
      setSchEditor(null)
      load()
    } catch (e) { alert('Error: ' + e.message) }
  }

  async function handleDeleteSchedule(s) {
    if (!confirm(`¿Eliminar "${s.label}"?`)) return
    await deleteSchedule(s.id)
    toast('Horario eliminado')
    load()
  }

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
          <button className="btn btn-primary btn-sm" onClick={() => setSchEditor({ ...EMPTY_SCHEDULE })}>
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="adm-card">
          {schedules.length === 0 ? (
            <div className="adm-empty" style={{ padding: '24px 16px' }}>
              <p>Sin horarios configurados.</p>
            </div>
          ) : schedules.map(s => (
            <div key={s.id} className="schedule-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>
                  {s.days?.map(d => DAYS_LABELS[d]).join(', ')}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--fg1)' }}>
                {s.open_time?.slice(0,5)} — {s.close_time?.slice(0,5)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSchEditor(s)}>✏️</button>
                <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--coke-red)' }} onClick={() => handleDeleteSchedule(s)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {schEditor && (
        <ScheduleModal schedule={schEditor} onSave={handleSaveSchedule} onClose={() => setSchEditor(null)} />
      )}
    </div>
  )
}

function ScheduleModal({ schedule, onSave, onClose }) {
  const [form, setForm] = useState({ ...schedule, days: schedule.days ?? [] })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function toggleDay(d) {
    set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d].sort())
  }

  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h2>{form.id ? 'Editar horario' : 'Nuevo horario'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="adm-field">
          <label className="adm-label">Nombre</label>
          <input className="adm-input" value={form.label} onChange={e => set('label', e.target.value)} placeholder="Lunes a Viernes" />
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
                {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="adm-field" style={{ flex: 1 }}>
            <label className="adm-label">Abre</label>
            <input className="adm-input" type="time" value={form.open_time} onChange={e => set('open_time', e.target.value)} />
          </div>
          <div className="adm-field" style={{ flex: 1 }}>
            <label className="adm-label">Cierra</label>
            <input className="adm-input" type="time" value={form.close_time} onChange={e => set('close_time', e.target.value)} />
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
