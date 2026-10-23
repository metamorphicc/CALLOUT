import { Component, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import SavedProvider from './components/SavedProvider'
import { EmptyState, Icon } from './components/WorkspaceUI'
import { useSaved } from './lib/saved-context'
import Overview from './pages/Overview'
import Callers from './pages/Callers'
import CallerProfile from './pages/CallerProfile'
import Compare from './pages/Compare'
import Signals from './pages/Signals'
import SignalRecord from './pages/SignalRecord'
import Saved from './pages/Saved'
import About from './pages/About'
import Methodology from './pages/Methodology'
import Community from './pages/Community'

class WorkspaceErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <div className="workspace-empty">
        <h1>Something interrupted this page.</h1>
        <p>Your saved records remain in this browser. Reload to try again.</p>
        <button className="control" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    )
  }
}

function Workspace() {
  const location = useLocation()
  const navigate = useNavigate()
  const main = useRef<HTMLElement>(null)
  const { error } = useSaved()
  const section = location.pathname.split('/')[1] || 'overview'
  const titles: Record<string, string> = {
    overview: 'Overview',
    callers: 'Callers',
    signals: 'Signals',
    saved: 'Saved records',
    about: 'Inside the Order',
    community: 'Community',
    compare: 'Compare callers',
    methodology: 'Methodology',
  }
  const title = titles[section] ?? 'Page not found'
  useEffect(() => {
    document.title = `${title} — The Callout Order`
    window.scrollTo({ top: 0 })
    main.current?.focus({ preventScroll: true })
  }, [location.pathname, title])
  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#workspace-main">
        Skip to content
      </a>
      <Header />
      <div className="workspace-main-column">
        <header className="workspace-topbar">
          <div className="workspace-breadcrumb">
            <Link to="/">The Order</Link>
            <span>/</span>
            <strong>{title}</strong>
          </div>
          <form
            className="global-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              navigate(
                `/callers?q=${encodeURIComponent(String(data.get('search') ?? ''))}`,
              )
            }}
          >
            <Icon name="search" />
            <input
              aria-label="Search callers"
              name="search"
              type="search"
              placeholder="Search callers…"
            />
            <button type="submit" aria-label="Search caller directory">
              ↵
            </button>
          </form>
          <span className="network-label">
            <span />
            Solana
          </span>
        </header>
        <main
          className="workspace-content"
          id="workspace-main"
          ref={main}
          tabIndex={-1}
        >
          {error && (
            <p className="storage-error" role="alert">
              {error}
            </p>
          )}
          <div className="route-content" key={location.pathname}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/callers" element={<Callers />} />
              <Route path="/callers/:id" element={<CallerProfile />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/signals/:id" element={<SignalRecord />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/about" element={<About />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/community" element={<Community />} />
              <Route
                path="*"
                element={
                  <EmptyState
                    title="Page not found"
                    description="The address does not match a record in the Order."
                    to="/"
                    action="Back to overview"
                  />
                }
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WorkspaceErrorBoundary>
      <SavedProvider>
        <Workspace />
      </SavedProvider>
    </WorkspaceErrorBoundary>
  )
}
