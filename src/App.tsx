import Header from './components/Header'
import Hero from './features/Hero'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main className="site-main" id="main-content">
        <Hero />
      </main>
    </>
  )
}
