import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../lib/formatPrice'
import logoW from '../../design-system/assets/logo-white.svg'

export default function PlacaProducto({ slide }) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const id = slide.placa_config?.product_id
    if (!id) return
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => setProduct(data))
      .catch(console.error)
  }, [slide])

  if (!product) return (
    <div style={{ width: '100%', height: '100%', background: 'var(--coke-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={logoW} alt="Kiosco Enjoy" style={{ height: 100, opacity: 0.5 }} />
    </div>
  )

  const hasImage = Boolean(product.image_url)

  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
      background: hasImage ? '#000' : 'var(--coke-red)',
    }}>
      {/* Foto de fondo */}
      {hasImage && (
        <>
          <img src={product.image_url} alt={product.name} style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
          {/* Gradiente protección */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(45,41,38,.95) 0%, rgba(45,41,38,.5) 35%, rgba(45,41,38,.08) 65%, transparent 85%)',
          }} />
        </>
      )}

      {/* Logo */}
      <img src={logoW} alt="Kiosco Enjoy" style={{
        position: 'absolute', top: 64, left: 56, height: 80,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
      }} />

      {/* Flag */}
      {product.flag && (
        <div style={{
          position: 'absolute', top: 70, right: 56,
          background: 'var(--promo)', color: 'var(--black-c)',
          fontWeight: 800, fontStyle: 'italic', fontSize: 38,
          padding: '10px 28px', borderRadius: 10,
          transform: 'rotate(-4deg)',
        }}>
          {product.flag}
        </div>
      )}

      {/* Nombre + precio */}
      <div style={{ position: 'absolute', bottom: 80, left: 56, right: 56 }}>
        {product.category && (
          <div style={{
            fontWeight: 700, fontSize: 34, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
            marginBottom: 12,
          }}>
            {product.category}
          </div>
        )}
        <div style={{
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 90, lineHeight: 0.92,
          color: '#fff', letterSpacing: '-0.02em',
          marginBottom: 28,
        }}>
          {product.name}
        </div>
        <div style={{
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 200, lineHeight: 0.85,
          color: hasImage ? '#fff' : 'rgba(255,255,255,0.95)',
          letterSpacing: '-0.03em',
        }}>
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  )
}
