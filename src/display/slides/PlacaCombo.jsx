import { formatPrice } from '../../lib/formatPrice'
import logoW from '../../design-system/assets/logo-white.svg'
import './placa-animations.css'

export default function PlacaCombo({ slide }) {
  const c = slide.placa_config ?? {}
  const priceNew = c.priceNew ? formatPrice(Number(c.priceNew)) : null
  const priceOld = c.priceOld ? formatPrice(Number(c.priceOld)) : null
  const hasImage = Boolean(c.image_url)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--black-c)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Imagen de fondo */}
      {hasImage && (
        <>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img src={c.image_url} alt={c.label} className="anim-ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transformOrigin: 'center center' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,41,38,.98) 0%, rgba(45,41,38,.75) 40%, rgba(45,41,38,.4) 100%)' }} />
        </>
      )}

      {/* Círculo rojo decorativo */}
      {!hasImage && (
        <div style={{
          position: 'absolute', width: 800, height: 800,
          borderRadius: '50%', background: 'var(--coke-red)',
          filter: 'blur(6px)', opacity: 0.5,
          right: -300, top: -300,
        }} />
      )}

      <img src={logoW} alt="Kiosco Enjoy" className="anim-fade-in"
        style={{ position: 'absolute', top: 60, left: 56, height: 72 }} />

      <div style={{ position: 'absolute', bottom: 80, left: 56, right: 56 }}>
        {c.label && (
          <div className="anim-slide-left delay-1" style={{
            color: 'var(--promo)', fontWeight: 800, fontStyle: 'italic',
            fontSize: 46, letterSpacing: '0.02em', marginBottom: 12,
          }}>
            {c.label}
          </div>
        )}

        {c.items && (
          <div className="anim-fade-up delay-2" style={{
            fontWeight: 800, fontStyle: 'italic',
            fontSize: c.items.length > 25 ? 72 : 88,
            lineHeight: 0.92, color: '#fff',
            letterSpacing: '-0.02em', marginBottom: 36,
          }}>
            {c.items}
          </div>
        )}

        {priceNew && (
          <div className="anim-price-pop delay-3" style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            {priceOld && (
              <span style={{
                color: 'rgba(255,255,255,0.4)', fontWeight: 700,
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
        )}

        {c.footer && (
          <div className="anim-fade-in delay-5" style={{
            marginTop: 24, fontWeight: 600, fontSize: 28,
            color: 'rgba(255,255,255,0.45)',
          }}>
            {c.footer}
          </div>
        )}
      </div>
    </div>
  )
}
