import { Arrow, Mark } from './Mark'
import { useRef, useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="container header-inner">
        <a
          className="wordmark"
          href="#hero"
          aria-label="The Callout Order home"
        >
          <Mark />
          <span>
            CALLOUT<span>ORDER</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#marked-ones">The Marked Ones</a>
          <a href="#lore">The Lore</a>
          <a href="#token">$CALLOUT</a>
          <a href="#genesis">Genesis</a>
        </nav>
        <div className="header-actions">
          <a
            className="button button--small button--ink"
            href="#join"
            onClick={() => setMenuOpen(false)}
          >
            Join<span className="join-long-label"> the Order</span>{' '}
            <Arrow diagonal />
          </a>
          <button
            ref={menuButton}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <span aria-hidden="true">×</span>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <nav
        className="mobile-nav"
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {[
          { label: 'The Marked Ones', id: 'marked-ones' },
          { label: 'The Lore', id: 'lore' },
          { label: '$CALLOUT', id: 'token' },
          { label: 'Genesis Collection', id: 'genesis' },
          { label: 'Join the Order', id: 'join' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
            <Arrow diagonal />
          </a>
        ))}
      </nav>
    </header>
  )
}
