export default function SlideYoutube({ slide }) {
  const { youtube_id, placa_config } = slide
  const startAt = placa_config?.startAt ?? 0
  const src = [
    `https://www.youtube-nocookie.com/embed/${youtube_id}`,
    `?autoplay=1&mute=1&loop=1&playlist=${youtube_id}`,
    `&controls=0&disablekb=1&fs=0&modestbranding=1`,
    `&iv_load_policy=3&rel=0&start=${startAt}`,
  ].join('')

  return (
    <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
      <iframe
        src={src}
        title={slide.title}
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', height: '100%',
          border: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
