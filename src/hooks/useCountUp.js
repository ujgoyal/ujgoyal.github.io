import { useEffect, useState } from 'react'

export function useCountUp(target, suffix = '', start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let n = 0
    const step = target / 45
    const t = setInterval(() => {
      n += step
      if (n >= target) { n = target; clearInterval(t) }
      setVal(Math.floor(n))
    }, 22)
    return () => clearInterval(t)
  }, [start, target])
  return `${val}${suffix}`
}
