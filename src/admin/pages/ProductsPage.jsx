import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getProducts, upsertProduct, deleteProduct, uploadMedia } from '../../lib/supabase'
import { formatPrice } from '../../lib/formatPrice'
import { X } from 'lucide-react'

const EMPTY = { name: '', price: '', category: '', flag: '', image_url: '', active: true }
const FLAGS = ['', 'OFERTA', '2x1', '3x2', 'COMBO', 'NUEVO', '% OFF']

export default function ProductsPage({ toast }) {
  const [products, setProducts] = useState([])
  const [editor, setEditor]     = useState(null)
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    setProducts(await getProducts())
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function handleSave(p) {
    try {
      await upsertProduct({ ...p, price: Number(p.price) })
      toast('✓ Producto guardado')
      setEditor(null)
      load()
    } catch (e) { alert('Error: ' + e.message) }
  }

  async function handleDelete(p) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return
    await deleteProduct(p.id)
    toast('Producto eliminado')
    load()
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--fg3)' }}>Cargando productos…</div>

  return (
    <div>
      <div className="adm-page-head">
        <h1>Productos</h1>
        <button className="btn btn-primary" onClick={() => setEditor({ ...EMPTY })}>
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📦</div>
          <h3>Sin productos todavía</h3>
          <p>Creá productos para usarlos en las placas.</p>
        </div>
      ) : (
        <div className="adm-card">
          {products.map(p => (
            <div key={p.id} className="product-card">
              {p.image_url
                ? <img className="product-card-img" src={p.image_url} alt={p.name} />
                : <div className="product-card-img" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize: 28 }}>📦</div>
              }
              <div className="product-card-info">
                <div className="product-card-name">{p.name}</div>
                <div className="product-card-meta">{p.category}{p.flag ? ` · ${p.flag}` : ''}</div>
              </div>
              <div className="product-card-price">{formatPrice(p.price)}</div>
              <div style={{ display:'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditor(p)}><Pencil size={15} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--coke-red)' }} onClick={() => handleDelete(p)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editor && (
        <ProductModal
          product={editor}
          onSave={handleSave}
          onClose={() => setEditor(null)}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm]     = useState({ ...product })
  const [uploading, setUploading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file, 'products')
      set('image_url', url)
    } catch (err) { alert('Error al subir imagen: ' + err.message) }
    setUploading(false)
  }

  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h2>{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="adm-field">
          <label className="adm-label">Nombre</label>
          <input className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Coca-Cola 2.25L" />
        </div>
        <div className="adm-field">
          <label className="adm-label">Precio ($)</label>
          <input className="adm-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="2150" />
        </div>
        <div className="adm-field">
          <label className="adm-label">Categoría</label>
          <input className="adm-input" value={form.category ?? ''} onChange={e => set('category', e.target.value)} placeholder="Bebidas" />
        </div>
        <div className="adm-field">
          <label className="adm-label">Etiqueta</label>
          <select className="adm-select" value={form.flag ?? ''} onChange={e => set('flag', e.target.value)}>
            {FLAGS.map(f => <option key={f} value={f}>{f || '— Sin etiqueta —'}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-label">Foto del producto</label>
          <div className="upload-zone" onClick={() => document.getElementById('prod-img').click()} style={{ padding: '24px 16px' }}>
            <input id="prod-img" type="file" accept="image/*" style={{ display:'none' }} onChange={handleImage} />
            {uploading ? <span>Subiendo…</span>
              : form.image_url
                ? <img src={form.image_url} alt="" style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
                : <span style={{ color: 'var(--fg3)', fontSize: 14 }}>Tocá para subir foto</span>
            }
          </div>
        </div>

        <div style={{ display:'flex', gap: 12, justifyContent:'flex-end', marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {form.id ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </div>
    </div>
  )
}
