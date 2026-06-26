import { formatPrice } from '../../lib/formatPrice'
import logoW from '../../design-system/assets/logo-white.svg'

export default function PlacaOferta({ slide }) {
  const c = slide.placa_config ?? {}
  const price = c.price ? formatPrice(Number(c.price)) : '$0'

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--coke-red)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Círculo decorativo */}
      <div style={{
        position: 'absolute', width: 700, height: 700,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        right: -200, top: -200,
      }} />

      {/* Logo */}
      <img src={logoW} alt="Kiosco Enjoy" style={{
        position: 'absolute', top: 56, left: 56, height: 80,
      }} />

      {/* Tag OFERTA */}
      <div style={{
        position: 'absolute', top: 60, right: 56,
        background: 'var(--promo)', color: 'var(--black-c)',
        fontWeight: 800, fontStyle: 'italic', fontSize: 38,
        padding: '10px 28px', borderRadius: 10,
        transform: 'rotate(-4deg)',
      }}>
        {c.eyebrow || 'OFERTA'}
      </div>

      {/* Título producto */}
      <div style={{
        position: 'absolute', top: 260, left: 56, right: 56,
      }}>
        <div style={{
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 110, lineHeight: 0.92,
          letterSpacing: '-0.02em', color: '#fff',
        }}>
          {c.title || 'Producto'}
        </div>
        {c.subtitle && (
          <div style={{
            color: 'rgba(255,255,255,0.82)',
            fontWeight: 600, fontStyle: 'italic',
            fontSize: 42, marginTop: 20,
          }}>
            {c.subtitle}
          </div>
        )}
      </div>

      {/* Precio */}
      <div style={{
        position: 'absolute', bottom: 160, left: 56, right: 56,
      }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontStyle: 'italic', fontSize: 44 }}>
          SOLO
        </div>
        <div style={{
          fontWeight: 800, fontStyle: 'italic',
          fontSize: 200, lineHeight: 0.85,
          color: '#fff', letterSpacing: '-0.03em',
        }}>
          {price}
        </div>
        {c.unit && (
          <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontStyle: 'italic', fontSize: 38, marginTop: 8 }}>
            {c.unit}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 50, left: 56,
        color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 30,
      }}>
        Pedilo por la app · @kioscoenjoy
      </div>
    </div>
  )
}
