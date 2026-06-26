import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TYPE_ICONS = {
  image:           { icon: '🖼️', label: 'Imagen' },
  video:           { icon: '🎬', label: 'Video' },
  youtube:         { icon: '▶️', label: 'YouTube' },
  placa_oferta:    { icon: '🏷️', label: 'Placa Oferta' },
  placa_combo:     { icon: '🔥', label: 'Placa Combo' },
  placa_cartelera: { icon: '📋', label: 'Lista Precios' },
  placa_horario:   { icon: '🕐', label: 'Horario' },
  placa_producto:  { icon: '📦', label: 'Producto' },
}

export default function SlideCard({ slide, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }

  const meta = TYPE_ICONS[slide.type] ?? { icon: '❓', label: slide.type }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`slide-card ${!slide.active ? 'inactive' : ''}`}
    >
      {/* Drag handle */}
      <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--ink-400)', display: 'flex', alignItems: 'center' }}>
        <GripVertical size={18} />
      </div>

      {/* Thumbnail */}
      <div className="slide-card-thumb">
        {slide.type === 'image' && slide.media_url
          ? <img src={slide.media_url} alt={slide.title} />
          : <span>{meta.icon}</span>
        }
      </div>

      {/* Info */}
      <div className="slide-card-info">
        <div className="slide-card-title">{slide.title}</div>
        <div className="slide-card-meta">{meta.label} · {slide.duration}s</div>
      </div>

      {/* Acciones */}
      <div className="slide-card-actions">
        <label className="toggle" title={slide.active ? 'Desactivar' : 'Activar'}>
          <input type="checkbox" checked={slide.active} onChange={() => onToggle(slide)} />
          <span className="toggle-track" />
          <span className="toggle-thumb" />
        </label>
        <button className="btn btn-ghost btn-icon" onClick={() => onEdit(slide)} title="Editar">
          <Pencil size={16} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => onDelete(slide)} title="Eliminar"
          style={{ color: 'var(--coke-red)' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
