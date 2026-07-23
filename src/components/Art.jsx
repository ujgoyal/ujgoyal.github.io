import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import Reveal from './Reveal'
import { artFilters, artworks, artIntro } from '../data/art'

const fill = (p) => p.image
  ? { backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  : { background: p.gradient }

const tagColor = (available) => {
  if (available === 'sold') return { background: 'rgba(80,80,80,.6)', borderColor: 'rgba(150,150,150,.4)', color: '#aaa' }
  if (available === 'commission') return {}
  return { background: 'rgba(216,169,86,.15)', borderColor: 'rgba(216,169,86,.5)', color: '#f0cf8a' }
}

function ArtPiece({ piece, delay, visible, onOpen }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`art-piece reveal ${inView ? 'in' : ''}`}
      style={{ transitionDelay: `${delay}s`, display: visible ? '' : 'none' }}
      onClick={onOpen}
    >
      <div className="art-fill" style={fill(piece)} />
      <span className="art-tag" style={tagColor(piece.available)}>{piece.tag}</span>
      <div className="art-overlay">
        <h4>{piece.title}</h4>
        <div className="meta">{piece.metaShort}</div>
      </div>
    </div>
  )
}

const fireContact = (audience, msg) => {
  window.dispatchEvent(new CustomEvent('select-audience', { detail: audience }))
  window.dispatchEvent(new CustomEvent('pre-fill-message', { detail: msg }))
  document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Art({ onOpenGallery }) {
  const [cat, setCat] = useState('all')
  const [active, setActive] = useState(null)
  const close = () => setActive(null)

  const purchase = () => {
    close()
    fireContact('An art inquiry', `Hi Ujjwal,\n\nI'm interested in purchasing "${active?.title}". Could you share more details about pricing and availability?\n\nThanks!`)
  }

  const commission = () => {
    close()
    fireContact('An art inquiry', `Hi Ujjwal,\n\nI'd love to commission a piece in the style of "${active?.title}". Here's what I have in mind:\n\n`)
  }

  return (
    <section id="art">
      <Reveal className="section-tag">For Art Buyers &amp; Collectors</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">Selected <em>works</em></Reveal>
      <Reveal as="p" delay={0.2} className="lead">{artIntro}</Reveal>
      <Reveal delay={0.2} className="art-filters">
        {artFilters.map((f) => (
          <button key={f.cat} className={`filter ${cat === f.cat ? 'active' : ''}`} onClick={() => setCat(f.cat)}>{f.label}</button>
        ))}
      </Reveal>
      <div className="gallery">
        {artworks.filter((p) => p.featured).map((p, i) => (
          <ArtPiece key={i} piece={p} delay={(i % 3) * 0.1} visible={cat === 'all' || p.cat === cat} onOpen={() => setActive(p)} />
        ))}
      </div>

      <Reveal delay={0.3} className="art-view-all">
        <button className="btn" onClick={onOpenGallery}><span>Explore Full Gallery →</span></button>
      </Reveal>

      <div className={`lightbox ${active ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('lightbox') && close()}>
        <button className="lb-close" onClick={close}>×</button>
        <div className="lb-card">
          <div className="lb-img" style={active ? fill(active) : {}} />
          <h3>{active?.title}</h3>
          <div className="meta">{active?.meta}</div>
          {active?.description && <p className="lb-desc">{active.description}</p>}
          <div className="lb-actions">
            {active?.available === 'for-sale' && (
              <button className="btn" onClick={purchase}><span>Purchase This Piece</span></button>
            )}
            <button className={active?.available === 'for-sale' ? 'btn btn-outline' : 'btn'} onClick={commission}>
              <span>{active?.available === 'commission' ? 'Commission a Piece Like This' : 'Commission Similar'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
