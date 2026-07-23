import { useState, useEffect, useRef } from 'react'
import { artFilters, artworks } from '../data/art'

const fill = (p) => p.image
  ? { backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  : { background: p.gradient }

const ASPECT_RATIOS = [1.2, 1.5, 1.0, 1.35, 1.6, 1.1, 1.4, 1.25, 1.45]

const tagStyle = (available) => {
  if (available === 'sold') return 'ap-badge ap-badge--sold'
  if (available === 'commission') return 'ap-badge ap-badge--commission'
  return 'ap-badge ap-badge--sale'
}

function WatercolorCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const blobs = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 60 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      hue: [30, 45, 200, 170, 280][i % 5],
      alpha: 0.025 + Math.random() * 0.03,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      blobs.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r) b.x = canvas.width + b.r
        if (b.x > canvas.width + b.r) b.x = -b.r
        if (b.y < -b.r) b.y = canvas.height + b.r
        if (b.y > canvas.height + b.r) b.y = -b.r

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, `hsla(${b.hue},60%,60%,${b.alpha})`)
        g.addColorStop(1, `hsla(${b.hue},60%,60%,0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="ap-canvas" />
}

function MasonryCard({ piece, index, onClick }) {
  const aspectRatio = piece.ratio ?? ASPECT_RATIOS[index % ASPECT_RATIOS.length]
  return (
    <div
      className="art-masonry-item"
      style={{ paddingBottom: `${aspectRatio * 100}%`, position: 'relative' }}
      onClick={() => onClick(piece)}
    >
      <div className="ami-fill" style={fill(piece)} />
      <span className={tagStyle(piece.available)}>{piece.tag}</span>
      <div className="ami-overlay">
        <h4>{piece.title}</h4>
        <div className="ami-meta">{piece.metaShort}</div>
        <div className="ami-view">View →</div>
      </div>
    </div>
  )
}

const COMMISSION_SERVICES = [
  {
    icon: '✏️',
    title: 'Portrait Sketches',
    desc: 'Detailed digital portraits of individuals — friends, family, or yourself. Monochrome or with subtle colour accents.',
    msg: "I'd like to commission a portrait sketch. Here are my details:\n\n",
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family & Pet Portraits',
    desc: 'Group caricatures or realistic portraits of families and beloved pets. Perfect as personalised gifts.',
    msg: "I'd like to commission a family/pet portrait. Here are my details:\n\n",
  },
  {
    icon: '🎭',
    title: 'Caricatures',
    desc: 'Playful exaggerated likenesses for birthdays, corporate events, farewell gifts, or just for fun.',
    msg: "I'd like to commission a caricature. Here are my details:\n\n",
  },
]

export default function ArtPage({ onClose }) {
  const [cat, setCat] = useState('all')
  const [active, setActive] = useState(null)
  const commissionRef = useRef(null)
  const pageRef = useRef(null)

  useEffect(() => {
    history.pushState({ artPage: true }, '', '?gallery=art')
    const handlePop = () => onClose()
    window.addEventListener('popstate', handlePop)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('popstate', handlePop)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleClose = () => {
    history.pushState({}, '', window.location.pathname.replace(/\?.*$/, ''))
    onClose()
  }

  const scrollToCommission = () => {
    commissionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fireContact = (audience, msg) => {
    handleClose()
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('select-audience', { detail: audience }))
      window.dispatchEvent(new CustomEvent('pre-fill-message', { detail: msg }))
      document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }

  const purchase = (piece) => {
    fireContact('An art inquiry', `Hi Ujjwal,\n\nI'm interested in purchasing "${piece.title}". Could you share more details about pricing and availability?\n\nThanks!`)
  }

  const commissionStyle = (piece) => {
    fireContact('An art inquiry', `Hi Ujjwal,\n\nI'd love to commission a piece in the style of "${piece.title}". Here's what I have in mind:\n\n`)
  }

  const startCommission = (msg) => {
    fireContact('An art inquiry', msg)
  }

  const filtered = cat === 'all' ? artworks : artworks.filter((p) => p.cat === cat)

  return (
    <div className="art-page" ref={pageRef}>
      <WatercolorCanvas />

      {/* Header */}
      <header className="ap-header">
        <button className="ap-back" onClick={handleClose} aria-label="Back to portfolio">
          ← Back
        </button>
        <div className="ap-header-title">
          <h1 className="art-page-title">The <em>Studio</em></h1>
          <p className="ap-subtitle">Digital Sketches · Paintings · Caricatures of People, Families &amp; Pets</p>
        </div>
        <button className="ap-commission-btn" onClick={scrollToCommission}>
          Commission a Piece
        </button>
      </header>

      <div className="ap-body">
        {/* Filters */}
        <div className="ap-filters">
          {artFilters.map((f) => (
            <button key={f.cat} className={`filter ${cat === f.cat ? 'active' : ''}`} onClick={() => setCat(f.cat)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="art-masonry">
          {filtered.map((piece, i) => (
            <MasonryCard key={piece.title} piece={piece} index={i} onClick={setActive} />
          ))}
        </div>

        {/* Commission Section */}
        <div className="ap-commission-section" ref={commissionRef}>
          <div className="ap-commission-kicker">Work with me</div>
          <h2 className="ap-commission-heading">Commission Your Own <em>Piece</em></h2>
          <p className="ap-commission-intro">
            Each commission starts with a conversation. Share a photo, describe the mood, and I'll create something made just for you — whether it's a birthday gift, a family keepsake, or a pet portrait that captures their true self.
          </p>
          <div className="commission-cards">
            {COMMISSION_SERVICES.map((s) => (
              <div key={s.title} className="commission-card">
                <div className="commission-card-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <button className="btn" style={{ marginTop: '18px' }} onClick={() => startCommission(s.msg)}>
                  <span>Start a Commission</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {active && (
        <div className="ap-modal-backdrop" onClick={(e) => e.target.classList.contains('ap-modal-backdrop') && setActive(null)}>
          <div className="ap-modal">
            <button className="lb-close" onClick={() => setActive(null)}>×</button>
            <div className="ap-modal-img" style={fill(active)} />
            <div className="ap-modal-body">
              <span className={`${tagStyle(active.available)} ap-modal-badge`}>{active.tag}</span>
              <h2 className="ap-modal-title">{active.title}</h2>
              <div className="ap-modal-meta">{active.meta}</div>
              <p className="ap-modal-desc">{active.description}</p>
              <div className="lb-actions">
                {active.available === 'for-sale' && (
                  <button className="btn" onClick={() => purchase(active)}><span>Purchase / Inquire</span></button>
                )}
                <button className={active.available === 'for-sale' ? 'btn btn-outline' : 'btn'} onClick={() => commissionStyle(active)}>
                  <span>{active.available === 'commission' ? 'Commission a Piece Like This' : 'Commission Similar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
