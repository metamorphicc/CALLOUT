import { Link, NavLink } from 'react-router'
import { useRef, useState } from 'react'
import { Mark } from './Mark'
import { Icon } from './WorkspaceUI'
import { useSaved } from '../lib/saved-context'

const navigation = [
  { to: '/', label: 'Overview', icon: 'overview' },
  { to: '/callers', label: 'The Marked Ones', icon: 'callers' },
  { to: '/signals', label: 'Signal archive', icon: 'signals' },
  { to: '/compare', label: 'Compare callers', icon: 'compare' },
  { to: '/saved', label: 'Saved records', icon: 'saved' },
  { to: '/about', label: 'Inside the Order', icon: 'about' },
  { to: '/community', label: 'Community desk', icon: 'community' },
] as const

export default function Header() {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const { items } = useSaved()
  return (
    <aside
      className={`workspace-sidebar ${open ? 'menu-is-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false)
          button.current?.focus()
        }
      }}
    >
      <div className="sidebar-brand">
        <Link
          className="workspace-wordmark"
          to="/"
          onClick={() => setOpen(false)}
          aria-label="The Callout Order home"
        >
          <Mark />
          <span>
            CALLOUT<small>THE ORDER</small>
          </span>
        </Link>
        <button
          className="mobile-menu-button"
          ref={button}
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="workspace-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>
      <div className="sidebar-navigation" id="workspace-navigation">
        <p className="navigation-label">Research workspace</p>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              key={item.to}
              onClick={() => setOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.to === '/saved' && items.length > 0 && (
                <small className="nav-count">{items.length}</small>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-seal">
            <Mark />
            <p>
              Every signal
              <br />
              <strong>leaves a mark.</strong>
            </p>
          </div>
          <Link to="/methodology" onClick={() => setOpen(false)}>
            Sources & methodology ↗
          </Link>
        </div>
      </div>
    </aside>
  )
}
