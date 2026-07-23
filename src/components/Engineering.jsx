import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import Reveal from './Reveal'
import { engineering } from '../data/engineering'
import { profile } from '../data/profile'

function Stat({ value, suffix, label, delay }) {
  const [ref, inView] = useInView(0.4)
  const display = useCountUp(value, suffix, inView)
  return (
    <div ref={ref} className={`stat reveal ${inView ? 'in' : ''}`} style={{ transitionDelay: `${delay}s` }}>
      <div className="num">{display}</div>
      <div className="label">{label}</div>
    </div>
  )
}

export default function Engineering() {
  const brandsLoop = [...engineering.brands, ...engineering.brands]
  return (
    <section id="engineering">
      <Reveal className="section-tag">For Recruiters & Teams</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">Engineering <em>leadership</em></Reveal>
      <Reveal as="p" delay={0.2} className="lead">{engineering.intro}</Reveal>

      <Reveal delay={0.2} className="brands">
        <div className="brands-label">Selected clients & brands I've delivered for</div>
        <div className="marquee"><div className="marquee-track">
          {brandsLoop.map((b, i) => (<span key={i}>{b}</span>))}
        </div></div>
      </Reveal>

      <div className="eng-grid">
        <div>
          <Reveal className="creds">
            {engineering.credentials.map((c, i) => (<span key={i} className="cred">{c}</span>))}
          </Reveal>
          <div className="stats">
            {engineering.stats.map((s, i) => (<Stat key={i} {...s} delay={i * 0.1} />))}
          </div>
          <Reveal delay={0.2} className="skills">
            {engineering.skills.map((s, i) => (<span key={i} className="skill">{s}</span>))}
          </Reveal>
          <Reveal as="a" delay={0.3} className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer"><span>Download Résumé</span></Reveal>
        </div>
        <div>
          {engineering.principles.map((p, i) => (
            <Reveal key={i} delay={0.1 * (i + 1)} className="principle">
              <h4><span>{p.n}</span>{p.title}</h4>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
