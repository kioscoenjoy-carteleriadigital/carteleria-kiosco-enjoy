import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import MediaUploader from './MediaUploader'

const TYPES = [
  { value: 'image',           icon: '🖼️', label: 'Imagen' },
  { value: 'video',           icon: '🎬', label: 'Video' },
  { value: 'youtube',         icon: '▶️', label: 'YouTube' },
  { value: 'placa_oferta',    icon: '🏷️', label: 'Oferta' },
  { value: 'placa_combo',     icon: '🔥', label: 'Combo' },
  { value: 'placa_cartelera', icon: '📋', label: 'Lista Precios' },
  { value: 'placa_horario',   icon: '🕐', label: 'Horario' },
  { value: 'placa_producto',  icon: '📦', label: 'Producto' },
]

function ytId(raw) {
  if (!raw) return ''
  const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : raw.trim()
}

export default function SlideEditor({ slide, products, onSave, onClose }) {
  const isEdit = Boolean(slide?.id)
  const [type, setType]         = useState(slide?.type ?? 'image')
  const [title, setTitle]       = useState(slide?.title ?? '')
  const [duration, setDuration] = useState(slide?.duration ?? 10)
  const [mediaUrl, setMediaUrl] = useState(slide?.media_url ?? '')
  const [youtubeRaw, setYoutubeRaw] = useState(slide?.youtube_id ?? '')
  const [config, setConfig]     = useState(slide?.placa_config ?? {})
  const [saving, setSaving]     = useState(false)

  function setC(key, val) { setConfig(c => ({ ...c, [key]: val })) }

  function addRow() { setC('rows', [...(config.rows ?? []), { name: '', price: '', flag: '' }]) }
  function setRow(i, k, v) {
    const rows = [...(config.rows ?? [])]
    rows[i] = { ...rows[i], [k]: v }
    setC('rows', rows)
  }
  function removeRow(i) {
    setC('rows', (config.rows ?? []).filter((_, j) => j !== i))
  }

  async function handleSave() {
    if (!title.trim()) return alert('Escribí un nombre para el slide.')
    setSaving(true)
    const payload = {
      ...(slide?.id ? { id: slide.id } : {}),
      title: title.trim(),
      type,
      duration: Number(duration) || 10,
      active: slide?.active ?? true,
      position: slide?.position ?? 9999,
      media_url: ['image', 'video'].includes(type) ? mediaUrl : null,
      youtube_id: type === 'youtube' ? ytId(youtubeRaw) : null,
      placa_config: ['placa_oferta','placa_combo','placa_cartelera','placa_horario','placa_producto'].includes(type)
        ? config : {},
    }
    await onSave(payload)
    setSaving(false)
  }

  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h2>{isEdit ? 'Editar slide' : 'Nuevo slide'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Tipo */}
        {!isEdit && (
          <div className="adm-field">
            <label className="adm-label">Tipo de slide</label>
            <div className="type-grid">
              {TYPES.map(t => (
                <button key={t.value} className={`type-btn ${type === t.value ? 'selected' : ''}`}
                  onClick={() => setType(t.value)}>
                  <span className="type-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nombre interno */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="slide-title">Nombre (solo admin)</label>
          <input id="slide-title" className="adm-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Oferta Coca-Cola junio" />
        </div>

        {/* Duración */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="slide-dur">Duración en pantalla (segundos)</label>
          <input id="slide-dur" className="adm-input" type="number" min={3} max={120} value={duration} onChange={e => setDuration(e.target.value)} style={{ maxWidth: 120 }} />
        </div>

        {/* Campos por tipo */}
        {type === 'image' && (
          <div className="adm-field">
            <label className="adm-label">Imagen</label>
            <MediaUploader folder="images" accept="image/*" onUploaded={setMediaUrl}
              label="Subí tu placa (JPG, PNG, WebP — 1080×1920)" />
            {mediaUrl && !mediaUrl.startsWith('blob') && (
              <input className="adm-input" style={{ marginTop: 8 }} value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="O pegá una URL" />
            )}
          </div>
        )}

        {type === 'video' && (
          <div className="adm-field">
            <label className="adm-label">Video</label>
            <MediaUploader folder="videos" accept="video/*" onUploaded={setMediaUrl} label="Subí tu video (MP4 vertical)" />
          </div>
        )}

        {type === 'youtube' && (
          <div className="adm-field">
            <label className="adm-label">URL o ID de YouTube</label>
            <input className="adm-input" value={youtubeRaw} onChange={e => setYoutubeRaw(e.target.value)} placeholder="https://www.youtube.com/watch?v=... o el ID" />
            {ytId(youtubeRaw) && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--fg3)' }}>ID detectado: <strong>{ytId(youtubeRaw)}</strong></div>
            )}
          </div>
        )}

        {type === 'placa_oferta' && (
          <>
            <div className="adm-field">
              <label className="adm-label">Etiqueta</label>
              <input className="adm-input" value={config.eyebrow ?? 'OFERTA'} onChange={e => setC('eyebrow', e.target.value)} placeholder="OFERTA" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Nombre del producto</label>
              <input className="adm-input" value={config.title ?? ''} onChange={e => setC('title', e.target.value)} placeholder="Coca-Cola 2.25L" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Descripción (opcional)</label>
              <input className="adm-input" value={config.subtitle ?? ''} onChange={e => setC('subtitle', e.target.value)} placeholder="Retornable · bien fría 🧊" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Precio ($)</label>
              <input className="adm-input" type="number" value={config.price ?? ''} onChange={e => setC('price', e.target.value)} placeholder="2150" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Unidad (opcional)</label>
              <input className="adm-input" value={config.unit ?? ''} onChange={e => setC('unit', e.target.value)} placeholder="2.25L" />
            </div>
          </>
        )}

        {type === 'placa_combo' && (
          <>
            <div className="adm-field">
              <label className="adm-label">Nombre del combo</label>
              <input className="adm-input" value={config.label ?? ''} onChange={e => setC('label', e.target.value)} placeholder="🔥 COMBO PREVIA" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Ítems del combo</label>
              <input className="adm-input" value={config.items ?? ''} onChange={e => setC('items', e.target.value)} placeholder="6 Quilmes + 2 papas" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Precio anterior (opcional, tachado)</label>
              <input className="adm-input" type="number" value={config.priceOld ?? ''} onChange={e => setC('priceOld', e.target.value)} placeholder="11500" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Precio final ($)</label>
              <input className="adm-input" type="number" value={config.priceNew ?? ''} onChange={e => setC('priceNew', e.target.value)} placeholder="8990" />
            </div>
          </>
        )}

        {type === 'placa_cartelera' && (
          <>
            <div className="adm-field">
              <label className="adm-label">Título</label>
              <input className="adm-input" value={config.title ?? 'OFERTAS DE LA SEMANA'} onChange={e => setC('title', e.target.value)} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Productos / precios</label>
              <div className="rows-list">
                {(config.rows ?? []).map((row, i) => (
                  <div key={i} className="row-item">
                    <input className="adm-input" value={row.name} onChange={e => setRow(i, 'name', e.target.value)} placeholder="Nombre" />
                    <input className="adm-input price-input" type="number" value={row.price} onChange={e => setRow(i, 'price', e.target.value)} placeholder="Precio" />
                    <input className="adm-input flag-input" value={row.flag} onChange={e => setRow(i, 'flag', e.target.value)} placeholder="2x1" />
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeRow(i)} style={{ color: 'var(--coke-red)', flexShrink: 0 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={addRow}>
                <Plus size={14} /> Agregar fila
              </button>
            </div>
          </>
        )}

        {type === 'placa_horario' && (
          <div style={{ padding: '12px 0', color: 'var(--fg2)', fontSize: 14 }}>
            El horario se toma automáticamente de la sección <strong>Configuración → Horarios</strong>.
            No necesitás configurar nada más acá.
          </div>
        )}

        {type === 'placa_producto' && (
          <div className="adm-field">
            <label className="adm-label">Producto</label>
            <select className="adm-select" value={config.product_id ?? ''} onChange={e => setC('product_id', e.target.value)}>
              <option value="">— Seleccioná un producto —</option>
              {(products ?? []).map(p => (
                <option key={p.id} value={p.id}>{p.name} — ${p.price?.toLocaleString('es-AR')}</option>
              ))}
            </select>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear slide'}
          </button>
        </div>
      </div>
    </div>
  )
}
