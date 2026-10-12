import { Arrow, Mark } from './Mark'

export default function Header() {
  return (
    <header className="site-header">
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
        <a className="button button--small button--ink" href="#join">
          Join the Order <Arrow diagonal />
        </a>
      </div>
    </header>
  )
}
