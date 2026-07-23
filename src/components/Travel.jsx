import { useEffect, useState, useMemo } from 'react'
import { useInView } from '../hooks/useInView'
import Reveal from './Reveal'
import Globe from './Globe'
import { travel, travelIntro, adventures } from '../data/travel'

const fill = (d) =>
  d.image
    ? { backgroundImage: `url(${d.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: d.gradient }

function Card({ d, delay, onOpen }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`travel-card reveal ${inView ? 'in' : ''}`} style={{ transitionDelay: `${delay}s` }} onClick={onOpen}>
      <div className="travel-fill" style={fill(d)} />
      <div className="travel-label">
        <div className="place">{d.place}</div>
        <div className="coord">{d.region} · {d.coord}</div>
        <div className="note">
          {d.note} <span className="read-more">Read story →</span>
        </div>
      </div>
    </div>
  )
}

export default function Travel() {
  const [idx, setIdx] = useState(-1)
  const [showItinerary, setShowItinerary] = useState(false)
  const close = () => setIdx(-1)
  const prev = () => setIdx((i) => (i - 1 + travel.length) % travel.length)
  const next = () => setIdx((i) => (i + 1) % travel.length)

  useEffect(() => {
    const h = (e) => {
      if (idx < 0) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    addEventListener('keydown', h)
    return () => removeEventListener('keydown', h)
  }, [idx])

  useEffect(() => {
    document.body.style.overflow = idx >= 0 ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [idx])

  // collapse itinerary whenever a different blog opens or closes
  useEffect(() => { setShowItinerary(false) }, [idx])

  // group destinations by country for the globe sidebar
  const countries = useMemo(() => {
    const map = {}
    travel.forEach((t) => {
      if (!map[t.region]) map[t.region] = { country: t.region, flag: t.flag, count: 0 }
      map[t.region].count++
    })
    return Object.values(map)
  }, [])

  const d = idx >= 0 ? travel[idx] : null

  return (
    <section id="travel">
      <Reveal className="section-tag">For Fellow Explorers</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">
        Every place <em>leaves a mark</em>
      </Reveal>

      {/* Globe hero — globe + country sidebar */}
      <Reveal delay={0.15} className="travel-globe-hero">
        <div className="globe-canvas-wrap">
          <Globe />
        </div>
        <div className="country-sidebar">
          <p className="sidebar-intro">{travelIntro}</p>
          <div className="country-list">
            {countries.map((c) => (
              <div key={c.country} className="country-entry">
                <span className="c-flag">{c.flag}</span>
                <div className="c-info">
                  <div className="c-name">{c.country}</div>
                  <div className="c-count">{c.count} destination{c.count > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="globe-stats">
            <span className="gstat">{countries.length} countries</span>
            <span className="gstat-sep">·</span>
            <span className="gstat">{travel.length} destinations</span>
          </div>
          <div className="adventures">
            {adventures.map((a, i) => (
              <span key={i} className="adventure">
                <b>{a.label}</b> {a.where}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Destination cards */}
      <div className="travel-grid">
        {travel.map((t, i) => (
          <Card key={i} d={t} delay={(i % 4) * 0.1} onOpen={() => setIdx(i)} />
        ))}
      </div>

      {/* Blog lightbox */}
      <div className={`blog-lb ${d ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('blog-lb') && close()}>
        <button className="lb-close" onClick={close}>×</button>
        <button className="tlb-nav prev" onClick={prev} aria-label="Previous">‹</button>
        {d && (
          <div className="blog-panel">
            <div className="blog-hero" style={fill(d)}>
              <div className="blog-hero-overlay">
                <div className="blog-loc">{d.region} · {d.coord}</div>
                <h2>{d.place}</h2>
                <div className="blog-date">{d.date}</div>
              </div>
            </div>
            <div className="blog-body">
              <div className="blog-tags">
                {d.tags.map((t, i) => (<span key={i} className="blog-tag">{t}</span>))}
              </div>
              {d.blog.map((p, i) => (<p key={i}>{p}</p>))}

              {d.itinerary && (
                <>
                  <button className="itinerary-toggle" onClick={() => setShowItinerary((v) => !v)}>
                    {showItinerary ? 'Hide itinerary ↑' : 'Show 7-day itinerary ↓'}
                  </button>
                  {showItinerary && (
                    <div className="blog-itinerary">
                      <div className="itinerary-heading">Day-by-Day Itinerary</div>
                      {d.itinerary.map((desc, i) => (
                        <div key={i} className="itinerary-day">
                          <div className="iday-num">{i + 1}</div>
                          <div className="iday-desc">{desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="tlb-dots">
                {travel.map((_, i) => (
                  <div key={i} className={`tlb-dot ${i === idx ? 'on' : ''}`} onClick={() => setIdx(i)} />
                ))}
              </div>
            </div>
          </div>
        )}
        <button className="tlb-nav next" onClick={next} aria-label="Next">›</button>
      </div>
    </section>
  )
}
