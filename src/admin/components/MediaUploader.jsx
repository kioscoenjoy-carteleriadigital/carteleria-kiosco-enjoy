import { useRef, useState } from 'react'
import { uploadMedia } from '../../lib/supabase'
import { Upload } from 'lucide-react'

export default function MediaUploader({ onUploaded, accept = 'image/*', folder = 'images', label = 'Arrastrá o hacé click para subir' }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]   = useState(null)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file, folder)
      setPreview(url)
      onUploaded?.(url)
    } catch (e) {
      alert('Error al subir: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'drag-over' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={e => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div style={{ color: 'var(--accent)', fontWeight: 600 }}>Subiendo…</div>
        ) : preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={preview} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
            <span style={{ fontSize: 12, color: 'var(--fg3)' }}>Subido ✓ · Hacé click para cambiar</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--fg3)' }}>
            <Upload size={32} strokeWidth={1.5} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
            <span style={{ fontSize: 12 }}>JPG, PNG, WebP, MP4</span>
          </div>
        )}
      </div>
    </div>
  )
}
