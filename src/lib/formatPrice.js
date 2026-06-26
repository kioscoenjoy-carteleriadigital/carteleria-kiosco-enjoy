// Formatea número como precio argentino: 1250 → "$1.250"
export function formatPrice(n) {
  if (n == null) return ''
  return '$' + Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })
}
