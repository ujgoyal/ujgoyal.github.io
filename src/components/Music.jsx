import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { music } from '../data/music'

function Visualizer({ playing }) {
  const ref = useRef(null)
  const playingRef = useRef(playing)
  useEffect(() => { playingRef.current = playing }, [playing])
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const size = () => { cv.width = cv.clientWidth * 2; cv.height = 240 }
    size(); addEventListener('resize', size)
    const bars = 64, vals = new Array(bars).fill(0)
    let phase = 0, raf
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      const bw = cv.width / bars, on = playingRef.current
      for (let i = 0; i < bars; i++) {
        const target = on
          ? (0.25 + 0.75 * Math.abs(Math.sin(i * 0.35 + phase) * Math.cos(i * 0.13 - phase * 0.7))) * (1 - (Math.abs(i - bars / 2) / bars) * 0.6)
          : 0.04 + 0.03 * Math.sin(i * 0.4 + phase * 0.5)
        vals[i] += (target - vals[i]) * 0.18
        const bh = vals[i] * cv.height * 0.92
        const g = ctx.createLinearGradient(0, cv.height, 0, cv.height - bh)
        g.addColorStop(0, '#b07d32'); g.addColorStop(1, '#f0cf8a')
        ctx.fillStyle = g
        const x = i * bw + bw * 0.18
        ctx.beginPath(); ctx.roundRect(x, cv.height - bh, bw * 0.64, bh, 3); ctx.fill()
      }
      phase += on ? 0.09 : 0.02
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [])
  return <canvas id="viz" ref={ref} />
}

export default function Music() {
  const [playing, setPlaying] = useState(false)
  const [now, setNow] = useState(music.tracks[0])
  const audioRef = useRef(null)
  const toggle = () => {
    setPlaying((p) => {
      const next = !p
      const a = audioRef.current
      if (a && a.src) next ? a.play().catch(() => {}) : a.pause()
      return next
    })
  }
  const pick = (t) => { setNow(t); if (!playing) toggle() }
  return (
    <section id="music">
      <Reveal className="section-tag" style={{ justifyContent: 'center' }}>For Collaborators</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">Sound & <em>composition</em></Reveal>
      <Reveal as="p" delay={0.2} className="lead" style={{ margin: '0 auto' }}>{music.intro}</Reveal>
      <Reveal delay={0.2} className="player">
        <Visualizer playing={playing} />
        <div className="track-row">
          <button className="play-btn" onClick={toggle} aria-label="Play">{playing ? '❚❚' : '▶'}</button>
          <div className="track-info"><div className="t">{now.title}</div><div className="s">{music.nowSubtitle}</div></div>
        </div>
        <audio ref={audioRef} src={now.src || undefined} />
      </Reveal>
      <Reveal delay={0.3} className="track-list">
        {music.tracks.map((t, i) => (
          <div key={i} className="track-item" onClick={() => pick(t)}>
            <span>{String(i + 1).padStart(2, '0')} · {t.title}</span><span className="dur">{t.duration}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
