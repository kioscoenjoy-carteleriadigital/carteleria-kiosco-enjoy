import { useEffect, useRef } from 'react'

export default function SlideVideo({ slide, active }) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    if (active) {
      ref.current.currentTime = 0
      ref.current.play().catch(() => {})
    } else {
      ref.current.pause()
    }
  }, [active])

  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <video
        ref={ref}
        src={slide.media_url}
        muted
        playsInline
        loop
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
