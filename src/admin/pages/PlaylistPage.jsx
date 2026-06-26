import { useEffect, useState, useCallback } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { getAllSlides, upsertSlide, deleteSlide, getProducts } from '../../lib/supabase'
import SlideCard from '../components/SlideCard'
import SlideEditor from '../components/SlideEditor'

export default function PlaylistPage({ toast }) {
  const [slides, setSlides]   = useState([])
  const [products, setProducts] = useState([])
  const [editor, setEditor]   = useState(null) // null | 'new' | slide object
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [s, p] = await Promise.all([getAllSlides(), getProducts()])
    setSlides(s)
    setProducts(p)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIdx = slides.findIndex(s => s.id === active.id)
    const newIdx = slides.findIndex(s => s.id === over.id)
    const reordered = arrayMove(slides, oldIdx, newIdx).map((s, i) => ({ ...s, position: i }))
    setSlides(reordered)
    await Promise.all(reordered.map(s => upsertSlide({ id: s.id, position: s.position, title: s.title, type: s.type, active: s.active, duration: s.duration })))
  }

  async function handleSave(payload) {
    try {
      await upsertSlide(payload)
      toast('✓ Slide guardado')
      setEditor(null)
      load()
    } catch (e) { alert('Error: ' + e.message) }
  }

  async function handleDelete(slide) {
    if (!confirm(`¿Eliminar "${slide.title}"?`)) return
    await deleteSlide(slide.id)
    toast('Slide eliminado')
    load()
  }

  async function handleToggle(slide) {
    await upsertSlide({ id: slide.id, active: !slide.active, title: slide.title, type: slide.type, duration: slide.duration })
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--fg3)' }}>Cargando playlist…</div>

  return (
    <div>
      <div className="adm-page-head">
        <h1>Playlist</h1>
        <button className="btn btn-primary" onClick={() => setEditor('new')}>
          <Plus size={18} /> Nuevo slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📺</div>
          <h3>La playlist está vacía</h3>
          <p>Agregá tu primer slide para empezar.</p>
        </div>
      ) : (
        <div className="adm-card">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {slides.map(slide => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  onEdit={setEditor}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {editor && (
        <SlideEditor
          slide={editor === 'new' ? null : editor}
          products={products}
          onSave={handleSave}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  )
}
