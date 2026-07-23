import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Engineering from './components/Engineering'
import Art from './components/Art'
import ArtPage from './components/ArtPage'
import Music from './components/Music'
import Travel from './components/Travel'
import Connect from './components/Connect'
import Footer from './components/Footer'

export default function App() {
  const { theme, toggle } = useTheme()
  const [artPageOpen, setArtPageOpen] = useState(false)

  useEffect(() => {
    if (window.location.search.includes('gallery=art')) setArtPageOpen(true)
  }, [])

  return (
    <>
      <Nav theme={theme} toggle={toggle} />
      <Hero theme={theme} />
      <Journey />
      <Engineering />
      <Art onOpenGallery={() => setArtPageOpen(true)} />
      <Music />
      <Travel />
      <Connect />
      <Footer />
      {artPageOpen && <ArtPage onClose={() => setArtPageOpen(false)} />}
    </>
  )
}
