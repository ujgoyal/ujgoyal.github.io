import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => { document.body.dataset.theme = theme }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
