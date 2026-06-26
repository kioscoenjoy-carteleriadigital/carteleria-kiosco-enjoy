export default function SlideImage({ slide }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <img
        src={slide.media_url}
        alt={slide.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
