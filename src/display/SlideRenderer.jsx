import SlideImage from './slides/SlideImage'
import SlideVideo from './slides/SlideVideo'
import SlideYoutube from './slides/SlideYoutube'
import PlacaOferta from './slides/PlacaOferta'
import PlacaCombo from './slides/PlacaCombo'
import PlacaCartelera from './slides/PlacaCartelera'
import PlacaHorario from './slides/PlacaHorario'
import PlacaProducto from './slides/PlacaProducto'

const MAP = {
  image:           SlideImage,
  video:           SlideVideo,
  youtube:         SlideYoutube,
  placa_oferta:    PlacaOferta,
  placa_combo:     PlacaCombo,
  placa_cartelera: PlacaCartelera,
  placa_horario:   PlacaHorario,
  placa_producto:  PlacaProducto,
}

export default function SlideRenderer({ slide, active }) {
  const Component = MAP[slide?.type]
  if (!Component) return null
  return <Component slide={slide} active={active} />
}
