import { formatPrice } from '../../lib/formatPrice'
import logoW from '../../design-system/assets/logo-white.svg'

export default function PlacaCombo({ slide }) {
  const c = slide.placa_config ?? {}
  const priceNew = c.priceNew ? formatPrice(Number(c.priceNew)) : '$0'
  const priceOld = c.priceOld ? formatPrice(Number(c.priceOld)) : null

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--black-c)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Círculo rojo decorativo */}
      <div style={{
        position: 'absolute', width: 800, height: 800,
        borderRadius: '50%', background: 'var(--coke-red)',
        filter: 'blur(6px)', opacity: 0.55,
        right: -300, top: -300,
      }} />

      {/* Logo */}
      <img src={logoW} alt="Kiosco Enjoy" style={{
        position: 'absolute', top: 60, left: 56, height: 80,
      }} />

      {/* Label combo */}
      <div style={{
        position: 'absolute', top: 240, left: 56,
        color: 'var(--promo)', fontWeight: 800, fontStyle: 'italic',
        fontSize: 50, letterSpacing: '0.02em',
      }}>
        {c.label || '🔥 COMBO'}
      </div>

      {/* Items */}
      <div style={{
        position: 'absolute', top: 320, left: 56, right: 56,
        fontWeight: 800, fontStyle: 'italic',
        fontSize: 100, lineHeight: 0.92, color: '#fff',
        letterSpacing: '-0.02em',
      }}>
        {c.items || 'Producto + Producto'}
      </div>

      {/* Precios */}
      <div style={{
        position: 'absolute', bottom: 220, left: 56,
        display: 'flex', alignItems: 'baseline', gap: 24,
      }}>
        {priceOld && (
          <span style={{
            color: 'rgba(255,255,255,0.45)', fontWeight: 700,
            fontStyle: 'italic', fontSize: 60,
            textDecoration: 'line-through',
          }}>
            {priceOld}
          </span>
        )}
        <span style={{
          color: '#fff', fontWeight: 800, fontStyle: 'italic',
          fontSize: 160, lineHeight: 1,
        }}>
          {priceNew}
        </span>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 80, left: 56, right: 56,
      }}>
        <div style={{
          background: 'var(--coke-red)', color: '#fff',
          fontWeight: 800, fontStyle: 'italic', fontSize: 46,
          padding: '24px 0', borderRadius: 999, textAlign: 'center',
        }}>
          Pedí ahora 👉 app
        </div>
      </div>
    </div>
  )
}
