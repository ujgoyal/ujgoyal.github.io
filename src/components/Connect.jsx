import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { profile } from '../data/profile'

const AUDIENCES = [
  { label: 'Hiring', value: 'Hiring / a role' },
  { label: 'Art inquiry', value: 'An art inquiry' },
  { label: 'Music collab', value: 'A music collaboration' },
  { label: 'Just saying hi', value: 'Travel / something else' },
]

export default function Connect() {
  const [audience, setAudience] = useState(AUDIENCES[0].value)
  const [form, setForm] = useState({ name: '', email: '', msg: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const h = (e) => setAudience(e.detail)
    window.addEventListener('select-audience', h)
    return () => window.removeEventListener('select-audience', h)
  }, [])

  useEffect(() => {
    const h = (e) => setForm((f) => ({ ...f, msg: e.detail }))
    window.addEventListener('pre-fill-message', h)
    return () => window.removeEventListener('pre-fill-message', h)
  }, [])

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const send = () => {
    const { name, email, msg } = form
    if (!name.trim() || !email.trim() || !msg.trim()) { setStatus('Please fill in every field so I can reply properly.'); return }
    const subject = encodeURIComponent(`Portfolio · ${audience} — from ${name}`)
    const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}\nRegarding: ${audience}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setStatus('Opening your email app… thank you for reaching out!')
  }

  return (
    <section id="connect">
      <Reveal className="section-tag" style={{ justifyContent: 'center' }}>Get in Touch</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">Let's <em>create something</em></Reveal>
      <Reveal as="p" delay={0.2} className="lead" style={{ margin: '0 auto' }}>
        Whether you're hiring, collecting, collaborating, or just want to swap travel stories — I'd love to hear from you.
      </Reveal>
      <Reveal delay={0.2} className="audience-pills">
        {AUDIENCES.map((a) => (
          <button key={a.value} className={`pill ${audience === a.value ? 'active' : ''}`} onClick={() => setAudience(a.value)}>{a.label}</button>
        ))}
      </Reveal>
      <Reveal delay={0.3} className="form">
        <input type="text" placeholder="Your name" value={form.name} onChange={upd('name')} />
        <input type="email" placeholder="Your email" value={form.email} onChange={upd('email')} />
        <textarea placeholder="Tell me a little about what you have in mind…" value={form.msg} onChange={upd('msg')} />
        <button className="btn" style={{ alignSelf: 'center' }} onClick={send}><span>Send Message</span></button>
        <div className="form-msg">{status}</div>
      </Reveal>
      <Reveal delay={0.3} className="socials">
        {profile.socials.map((s) => (<a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>))}
      </Reveal>
    </section>
  )
}
