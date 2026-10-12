import Header from './components/Header'
import Hero from './features/Hero'
import MarkedOnes from './features/marked-ones/MarkedOnes'
import Lore from './features/Lore'
import Token from './features/Token'
import Genesis from './features/Genesis'
import Join from './features/Join'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main className="site-main" id="main-content">
        <Hero />
        <MarkedOnes />
        <Lore />
        <Token />
        <Genesis />
        <Join />
      </main>
      <Footer />
    </>
  )
}
