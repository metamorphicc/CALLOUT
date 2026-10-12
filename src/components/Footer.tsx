import { Mark } from './Mark'
import { leaderboardSource } from '../features/marked-ones/data'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="wordmark" href="#hero">
            <Mark />
            <span>
              CALLOUT<span>ORDER</span>
            </span>
          </a>
          <p>Every signal leaves a mark.</p>
          <a className="text-link" href="#hero">
            Back to the signal ↑
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            Independent community project. No affiliation with Pump.fun or
            endorsement by listed callers.
          </p>
          <a
            href={leaderboardSource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Leaderboard source ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
