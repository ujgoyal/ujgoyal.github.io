import { useEffect, useRef } from 'react'

// Generative golden flow-field that reacts to the cursor. Theme-aware.
export default function FlowField({ theme }) {
  const canvasRef = useRef(null)
  const themeRef = useRef(theme)
  const repaintRef = useRef(() => {})

  useEffect(() => { themeRef.current = theme; repaintRef.current() }, [theme])

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    let w, h, dpr, particles = [], raf
    const mouse = { x: -9999, y: -9999 }

    const perm = new Uint8Array(512)
    ;(() => {
      const p = []
      for (let i = 0; i < 256; i++) p[i] = i
      for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]] }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
    })()
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
    const lerp = (a, b, t) => a + t * (b - a)
    const grad = (hash, x, y) => { const hh = hash & 3, u = hh < 2 ? x : y, v = hh < 2 ? y : x; return ((hh & 1) ? -u : u) + ((hh & 2) ? -v : v) }
    const noise = (x, y) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255
      x -= Math.floor(x); y -= Math.floor(y)
      const u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y
      return lerp(lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u), lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u), v)
    }

    const tc = () => themeRef.current === 'light'
      ? { base: '#f4ece0', f: 'rgba(244,236,224,0.07)', l: 40, a: 0.2 }
      : { base: '#15100b', f: 'rgba(21,16,11,0.06)', l: 58, a: 0.12 }

    const repaintBase = () => { ctx.fillStyle = tc().base; ctx.fillRect(0, 0, w, h) }
    repaintRef.current = repaintBase

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'
      const count = Math.min(Math.floor((innerWidth * innerHeight) / 1400), 900)
      particles = []
      for (let i = 0; i < count; i++) particles.push({ x: Math.random() * w, y: Math.random() * h, px: 0, py: 0, life: Math.random() * 100, hue: 38 + Math.random() * 16 })
      repaintBase()
    }
    resize()

    const onMove = (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr }
    const onOut = () => { mouse.x = mouse.y = -9999 }
    const onTouch = (e) => { if (e.touches[0]) { mouse.x = e.touches[0].clientX * dpr; mouse.y = e.touches[0].clientY * dpr } }
    addEventListener('resize', resize); addEventListener('mousemove', onMove); addEventListener('mouseout', onOut); addEventListener('touchmove', onTouch, { passive: true })

    let t = 0
    const scale = 0.0012
    const frame = () => {
      const c = tc()
      ctx.fillStyle = c.f; ctx.fillRect(0, 0, w, h); t += 0.0016
      for (const p of particles) {
        p.px = p.x; p.py = p.y
        const ang = noise(p.x * scale, p.y * scale + t) * Math.PI * 3
        let vx = Math.cos(ang), vy = Math.sin(ang)
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy)
        if (dist < 160 * dpr) { const f = (160 * dpr - dist) / (160 * dpr); vx += (dx / dist) * f * 2.2 - (dy / dist) * f * 1.4; vy += (dy / dist) * f * 2.2 + (dx / dist) * f * 1.4 }
        const sp = 1.4 * dpr
        p.x += vx * sp; p.y += vy * sp; p.life--
        if (p.life < 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; p.life = 60 + Math.random() * 120; continue }
        const a = Math.min(0.55, c.a + (dist < 160 * dpr ? 0.4 : 0))
        ctx.strokeStyle = `hsla(${p.hue},72%,${c.l + Math.random() * 8}%,${a})`
        ctx.lineWidth = 0.8 * dpr
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke()
      }
      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize); removeEventListener('mousemove', onMove); removeEventListener('mouseout', onOut); removeEventListener('touchmove', onTouch)
    }
  }, [])

  return <canvas id="flow" ref={canvasRef} />
}
