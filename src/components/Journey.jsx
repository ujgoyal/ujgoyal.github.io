import Reveal from './Reveal'
import { journey, journeyIntro } from '../data/journey'

export default function Journey() {
  return (
    <section id="journey">
      <Reveal className="section-tag">The Story</Reveal>
      <Reveal as="h2" delay={0.1} className="section-title">A journey across <em>code, canvas & continents</em></Reveal>
      <Reveal as="p" delay={0.2} className="lead">{journeyIntro}</Reveal>
      <div className="timeline">
        {journey.map((it, i) => (
          <Reveal key={i} className="tl-item">
            <div className="tl-year">{it.year}</div>
            <div className="tl-role">{it.role}</div>
            <div className="tl-note">{it.note}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
