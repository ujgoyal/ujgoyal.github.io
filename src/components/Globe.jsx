import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

const MARKERS = [
  { location: [11.7, 92.7], size: 0.07 },   // Andaman & Nicobar
  { location: [7.9, 98.4], size: 0.07 },    // Phuket & Phi Phi
  { location: [-8.3, 115.1], size: 0.07 },  // Bali
  { location: [25.1, 55.1], size: 0.07 },   // Dubai
  { location: [32.0, 76.7], size: 0.06 },   // Bir, Himachal
  { location: [30.1, 78.3], size: 0.06 },   // Rishikesh
  { location: [40.4, 49.9], size: 0.07 },   // Baku
]

// cobe v2 internally does: canvas.width = config.width * config.devicePixelRatio
// so pass the CSS display size here, NOT pre-multiplied by DPR
const GLOBE_SIZE = 460

export default function Globe() {
  const canvasRef = useRef()
  const phi = useRef(1.8)      // start centered over Asia/Indian Ocean
  const dragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const globe = createGlobe(el, {
      devicePixelRatio: dpr,
      width: GLOBE_SIZE,   // cobe sets canvas.width = GLOBE_SIZE * dpr
      height: GLOBE_SIZE,
      phi: phi.current,
      theta: 0.22,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      // land dot color = baseColor × mapBrightness → [0.3×6, 0.22×6, 0.12×6]
      // → [1.8, 1.32, 0.72] → clamped → warm cream: clearly visible continents
      mapBrightness: 6,
      baseColor: [0.3, 0.22, 0.12],
      markerColor: [0.95, 0.75, 0.3],
      glowColor: [0.85, 0.6, 0.15],
      markers: MARKERS,
      onRender(state) {
        if (!dragging.current) phi.current += 0.003
        state.phi = phi.current
      },
    })

    // Use document-level listeners so drag keeps working outside the canvas
    const onDown = (e) => {
      dragging.current = true
      lastX.current = e.clientX
      document.body.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!dragging.current) return
      const w = el.getBoundingClientRect().width || GLOBE_SIZE
      const delta = (e.clientX - lastX.current) / w
      phi.current -= delta * Math.PI * 2
      lastX.current = e.clientX
    }
    const onUp = () => {
      dragging.current = false
      document.body.style.cursor = ''
    }

    el.addEventListener('pointerdown', onDown)
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)

    return () => {
      globe.destroy()
      el.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
  }, [])

  return <canvas ref={canvasRef} className="globe-canvas" />
}
