import { formatPrice } from '../../lib/formatPrice'
import logoR from '../../design-system/assets/logo-red.svg'
import logoW from '../../design-system/assets/logo-white.svg'
import './placa-animations.css'

export default function PlacaCartelera({ slide }) {
  const c = slide.placa_config ?? {}
  const rows = c.rows ?? []
  const dark = c.theme === 'dark'

  return (
    <div style={{
      width: '100%', height: '100%',
      background: dark ? 'var(--black-c)' : 'var(--brilliant-white)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div
        className="anim-fade-in"
        style={{
          background: 'var(--coke-red)',
          padding: '48px 56px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <img src={logoW} alt="Kiosco Enjoy" style={{ height: 72 }} />
        {c.badge && (
          <div style={{
            background: 'var(--black-c)', color: '#fff',
            fontWeight: 800, fontStyle: 'italic', fontSize: 34,
            padding: '12px 28px', borderRadius: 8,
          }}>
            {c.badge}
          </div>
        )}
      </div>

      {/* Título */}
      <div
        className="anim-fade-up delay-1"
        style={{
          padding: '44px 56px 28px',
          fontWeight: 800, fontStyle: 'italic',
          fontSize: rows.length > 4 ? 68 : 86,
          lineHeight: 0.92, letterSpacing: '-0.015em',
          color: 'var(--coke-red)',
        }}
      >
        {c.title || 'OFERTAS DE LA SEMANA'}
      </div>

      {/* Filas */}
      <div style={{ flex: 1, padding: '0 56px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`anim-fade-up delay-${Math.min(i + 2, 5)}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              borderBottom: `3px solid ${dark ? 'rgba(255,255,255,0.1)' : 'var(--ink-300)'}`,
              padding: '22px 0',
            }}
          >
            <span style={{
              flex: 1, fontWeight: 700, fontStyle: 'italic',
              fontSize: rows.length > 5 ? 44 : 52,
              color: dark ? '#fff' : 'var(--black-c)',
            }}>
              {row.name}
            </span>
            {row.flag && (
              <span style={{
                background: 'var(--promo)', color: 'var(--black-c)',
                fontWeight: 800, fontStyle: 'italic', fontSize: 30,
                padding: '6px 18px', borderRadius: 8, whiteSpace: 'nowrap',
              }}>
                {row.flag}
              </span>
            )}
            <span style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: rows.length > 5 ? 54 : 66,
              color: 'var(--coke-red)', whiteSpace: 'nowrap',
            }}>
              {row.price ? formatPrice(Number(row.price)) : row.priceText ?? ''}
            </span>
          </div>
        ))}
      </div>

      {/* Footer configurable */}
      {c.footer && (
        <div
          className="anim-fade-in delay-5"
          style={{
            padding: '22px 56px',
            background: dark ? 'rgba(255,255,255,0.06)' : 'var(--black-c)',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 600, fontSize: 28, textAlign: 'center',
          }}
        >
          {c.footer}
        </div>
      )}
    </div>
  )
}
