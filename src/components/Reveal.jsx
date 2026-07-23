import { useInView } from '../hooks/useInView'

export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', style, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`.trim()} style={{ transitionDelay: `${delay}s`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
