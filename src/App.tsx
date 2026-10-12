import Header from './components/Header'
import Hero from './features/Hero'
import MarkedOnes from './features/marked-ones/MarkedOnes'

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
      </main>
    </>
  )
}
