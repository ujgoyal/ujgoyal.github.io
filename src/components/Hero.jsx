import { useEffect, useState } from 'react'
import FlowField from './FlowField'
import { profile } from '../data/profile'

export default function Hero({ theme }) {
  const [wi, setWi] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setWi((i) => (i + 1) % profile.rotatingWords.length); setFading(false) }, 300)
    }, 2400)
    return () => clearInterval(id)
  }, [])
  return (
    <header id="hero">
      <FlowField theme={theme} />
      <div className="hero-content">
        <div className="hero-kicker">{profile.kicker}</div>
        <h1 className="hero-name">{profile.firstName} {profile.lastName}</h1>
        <div className="hero-roles">
          I build{' '}
          <span className="word" style={{ opacity: fading ? 0 : 1, transition: 'opacity .3s' }}>{profile.rotatingWords[wi]}</span>
        </div>
        <div className="hero-paths">
          {profile.heroPaths.map((p) => (<a key={p.target} href={`#${p.target}`} className="hpath">{p.label}</a>))}
        </div>
      </div>
      <div className="scroll-hint"><span>Scroll</span><span className="line"></span></div>
    </header>
  )
}
