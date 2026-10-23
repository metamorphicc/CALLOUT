import { Link } from 'react-router'
import { markedCallers, leaderboardSource } from '../features/marked-ones/data'
import { money, publishedSignals } from '../lib/catalog'
import { useSaved } from '../lib/saved-context'
import {
  CallerTable,
  PageHeading,
  SignalCard,
  ExternalLink,
  Icon,
} from '../components/WorkspaceUI'

export default function Overview() {
  const { items } = useSaved()
  const total = markedCallers.reduce(
    (sum, caller) => sum + Number(caller.rewards?.amount ?? 0),
    0,
  )
  const highest = Math.max(
    ...markedCallers.map((caller) => Number(caller.rewards?.amount ?? 0)),
  )
  return (
    <>
      <PageHeading
        title="Research overview"
        description="A clear view of the callers, rewards and original signals in the Order’s record."
        action={
          <ExternalLink className="control" href={leaderboardSource.url}>
            Source table
          </ExternalLink>
        }
      />
      <div className="metric-grid">
        <Link className="metric" to="/callers">
          <span>Recorded rewards</span>
          <strong>{money(total)}</strong>
          <small>Combined source values · 5 callers</small>
        </Link>
        <Link className="metric" to="/callers">
          <span>Marked callers</span>
          <strong>{markedCallers.length.toString().padStart(2, '0')}</strong>
          <small>Ranked by source rewards</small>
        </Link>
        <Link className="metric" to="/signals">
          <span>Indexed callouts</span>
          <strong>{publishedSignals.length.toString().padStart(2, '0')}</strong>
          <small>Linked to original posts</small>
        </Link>
        <Link className="metric" to="/saved">
          <span>Your reading list</span>
          <strong>{items.length.toString().padStart(2, '0')}</strong>
          <small>Saved on this device</small>
        </Link>
      </div>
      <div className="overview-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Rewards distribution</h2>
              <p>The five callers in the source snapshot</p>
            </div>
            <span className="source-tag">USD values</span>
          </div>
          <div
            className="reward-chart"
            role="group"
            aria-label={markedCallers
              .map(
                (caller) =>
                  `${caller.displayName}: ${money(caller.rewards?.amount ?? 0)}`,
              )
              .join('; ')}
          >
            {markedCallers.map((caller) => (
              <div className="reward-bar-row" key={caller.id}>
                <Link to={`/callers/${caller.id}`}>{caller.displayName}</Link>
                <div className="reward-bar-track">
                  <span
                    style={{
                      width: `${(Number(caller.rewards?.amount ?? 0) / highest) * 100}%`,
                    }}
                  />
                </div>
                <strong>{money(caller.rewards?.amount ?? 0)}</strong>
              </div>
            ))}
          </div>
          <div className="panel-footnote">
            One source snapshot. Reporting period unspecified.
          </div>
        </section>
        <aside className="order-note">
          <span className="source-tag">The Callout Order</span>
          <h2>A record worth keeping.</h2>
          <p>
            The Order brings source records and caller profiles into one place.
            Start with the evidence, keep what matters, and return to the
            original.
          </p>
          <Link className="inline-action" to="/about">
            Inside the Order <Icon name="arrow" />
          </Link>
          <div className="order-note-art" aria-hidden="true">
            <span>△</span>
            <span>CALLOUT</span>
          </div>
        </aside>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <h2>The Marked Ones</h2>
          <Link className="inline-action" to="/callers">
            Open directory <Icon name="arrow" />
          </Link>
        </div>
        <CallerTable callers={markedCallers} />
        <div className="panel-footnote">
          Source rewards are historical observations, not a ranking of verified
          signal quality.
        </div>
      </section>
      <section className="workspace-section">
        <div className="panel-heading standalone">
          <h2>From the signal archive</h2>
          <Link className="inline-action" to="/signals">
            All records <Icon name="arrow" />
          </Link>
        </div>
        <div className="signal-grid">
          {publishedSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>
    </>
  )
}
