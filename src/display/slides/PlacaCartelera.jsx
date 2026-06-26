import { formatPrice } from '../../lib/formatPrice'
import logoR from '../../design-system/assets/logo-red.svg'

export default function PlacaCartelera({ slide }) {
  const c = slide.placa_config ?? {}
  const rows = c.rows ?? []

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--brilliant-white)',
      fontFamily: 'var(--font-display)',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--coke-red)',
        padding: '52px 56px 44px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img src={logoR} alt="Kiosco Enjoy" style={{ height: 76, filter: 'brightness(0) invert(1)' }} />
        <div style={{
          background: 'var(--black-c)', color: '#fff',
          fontWeight: 800, fontStyle: 'italic', fontSize: 36,
          padding: '12px 28px', borderRadius: 8,
        }}>
          HOY
        </div>
      </div>

      {/* Título */}
      <div style={{
        padding: '48px 56px 32px',
        fontWeight: 800, fontStyle: 'italic',
        fontSize: rows.length > 4 ? 72 : 90,
        lineHeight: 0.92, letterSpacing: '-0.015em',
        color: 'var(--coke-red)',
      }}>
        {c.title || 'OFERTAS DE LA SEMANA'}
      </div>

      {/* Filas de precios */}
      <div style={{ flex: 1, padding: '0 56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 20,
            borderBottom: '3px solid var(--ink-300)',
            padding: '24px 0',
          }}>
            <span style={{
              flex: 1, fontWeight: 700, fontStyle: 'italic',
              fontSize: rows.length > 5 ? 46 : 54,
              color: 'var(--black-c)',
            }}>
              {row.name}
            </span>
            {row.flag && (
              <span style={{
                background: 'var(--promo)', color: 'var(--black-c)',
                fontWeight: 800, fontStyle: 'italic', fontSize: 32,
                padding: '6px 18px', borderRadius: 8, whiteSpace: 'nowrap',
              }}>
                {row.flag}
              </span>
            )}
            <span style={{
              fontWeight: 800, fontStyle: 'italic',
              fontSize: rows.length > 5 ? 56 : 68,
              color: 'var(--coke-red)', whiteSpace: 'nowrap',
            }}>
              {row.price ? formatPrice(Number(row.price)) : row.priceText ?? ''}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '24px 56px',
        background: 'var(--black-c)',
        color: 'rgba(255,255,255,0.7)',
        fontWeight: 600, fontSize: 28, textAlign: 'center',
      }}>
        Pedilo por la app · @kioscoenjoy
      </div>
    </div>
  )
}
