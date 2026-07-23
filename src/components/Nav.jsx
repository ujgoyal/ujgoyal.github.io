import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

const LINKS = ['journey', 'engineering', 'art', 'music', 'travel', 'connect']

export default function Nav({ theme, toggle }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    addEventListener('scroll', onScroll)
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">{profile.firstName} <b>{profile.lastName}</b></div>
      <ul className={`nav-links ${open ? 'open' : ''}`}>
        {LINKS.map((l) => (
          <li key={l}><a href={`#${l}`} onClick={() => setOpen(false)}>{l}</a></li>
        ))}
      </ul>
      <div className="nav-ctrl">
        <button className="theme-toggle" aria-label="Toggle light/dark" onClick={toggle}>{theme === 'dark' ? '☀' : '☾'}</button>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)}>☰</button>
      </div>
    </nav>
  )
}
