import { formatPrice } from '../../lib/formatPrice'
import logoW from '../../design-system/assets/logo-white.svg'
import './placa-animations.css'

export default function PlacaOferta({ slide }) {
  const c = slide.placa_config ?? {}
  const price = c.price ? formatPrice(Number(c.price)) : null
  const hasImage = Boolean(c.image_url)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: c.bg === 'dark' ? 'var(--black-c)' : 'var(--coke-red)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Imagen del producto con Ken Burns */}
      {hasImage && (
        <>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              src={c.image_url}
              alt={c.title}
              className="anim-ken-burns"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transformOrigin: 'center center' }}
            />
          </div>
          {/* Gradiente de protección */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(45,41,38,.97) 0%, rgba(45,41,38,.7) 30%, rgba(45,41,38,.15) 60%, rgba(45,41,38,.4) 100%)',
          }} />
          {/* Tinte de color de marca arriba */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            background: c.bg === 'dark'
              ? 'linear-gradient(to bottom, rgba(45,41,38,.85), transparent)'
              : 'linear-gradient(to bottom, rgba(244,0,0,.75), transparent)',
          }} />
        </>
      )}

      {/* Círculo decorativo (solo sin imagen) */}
      {!hasImage && (
        <div style={{
          position: 'absolute', width: 700, height: 700,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
          right: -200, top: -200,
        }} />
      )}

      {/* Logo */}
      <img
        src={logoW}
        alt="Kiosco Enjoy"
        className="anim-fade-in"
        style={{ position: 'absolute', top: 56, left: 56, height: 72 }}
      />

      {/* Tag (eyebrow) */}
      {c.eyebrow && (
        <div
          className="anim-slide-left delay-1"
          style={{
            position: 'absolute', top: 62, right: 56,
            background: 'var(--promo)', color: 'var(--black-c)',
            fontWeight: 800, fontStyle: 'italic', fontSize: 36,
            padding: '10px 28px', borderRadius: 10,
            transform: 'rotate(-4deg)',
          }}
        >
          {c.eyebrow}
        </div>
      )}

      {/* Contenido inferior */}
      <div style={{ position: 'absolute', bottom: 80, left: 56, right: 56 }}>
        {/* Categoría / subtítulo */}
        {c.subtitle && (
          <div
            className="anim-fade-up delay-1"
            style={{
              fontWeight: 600, fontStyle: 'italic', fontSize: 36,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: 12,
            }}
          >
            {c.subtitle}
          </div>
        )}

        {/* Nombre del producto */}
        <div
          className="anim-fade-up delay-2"
          style={{
            fontWeight: 800, fontStyle: 'italic',
            fontSize: c.title?.length > 20 ? 80 : 100,
            lineHeight: 0.92, letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: 32,
          }}
        >
          {c.title || 'Producto'}
        </div>

        {/* Precio */}
        {price && (
          <div className="anim-price-pop delay-3" style={{ display: 'inline-block' }}>
            {c.priceLabel && (
              <div style={{
                fontWeight: 700, fontStyle: 'italic', fontSize: 38,
                color: 'rgba(255,255,255,0.55)', marginBottom: 4,
              }}>
                {c.priceLabel}
              </div>
            )}
            <div style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: 190, lineHeight: 0.85,
              color: hasImage ? '#fff' : '#fff',
              letterSpacing: '-0.03em',
              textShadow: hasImage ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
            }}>
              {price}
            </div>
            {c.unit && (
              <div style={{
                fontWeight: 700, fontStyle: 'italic', fontSize: 36,
                color: 'rgba(255,255,255,0.6)', marginTop: 6,
              }}>
                {c.unit}
              </div>
            )}
          </div>
        )}

        {/* Footer configurable */}
        {c.footer && (
          <div
            className="anim-fade-in delay-5"
            style={{
              marginTop: 28,
              fontWeight: 600, fontSize: 28,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {c.footer}
          </div>
        )}
      </div>
    </div>
  )
}
