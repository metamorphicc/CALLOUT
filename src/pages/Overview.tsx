import { Link } from 'react-router'
import { markedCallers } from '../features/marked-ones/data'
import { money, publishedSignals } from '../lib/catalog'
import { useSaved } from '../lib/saved-context'
import { Portrait } from '../components/Portrait'
import {
  CallerTable,
  PageHeading,
  SignalCard,
  Icon,
  SaveButton,
  SourceNote,
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
  const shortlist = [
    ...markedCallers
      .filter((caller) => items.includes('caller:' + caller.id))
      .map((caller) => ({
        id: 'caller:' + caller.id,
        name: caller.displayName,
        to: '/callers/' + caller.id,
        label: 'Caller profile',
        portrait: caller.sourceRank - 1,
      })),
    ...publishedSignals
      .filter((signal) => items.includes('signal:' + signal.id))
      .map((signal) => ({
        id: 'signal:' + signal.id,
        name: '$' + signal.symbol,
        to: '/signals/' + signal.id,
        label: 'Original callout',
        portrait: markedCallers.findIndex(
          (caller) => caller.id === signal.callerId,
        ),
      })),
  ]
  return (
    <>
      <PageHeading
        title="The Order at a glance."
        description="Your view of the callers, the rewards and the signals worth following."
        action={
          <div className="record-actions">
            <Link className="control" to="/signals">
              Explore signals <Icon name="arrow" />
            </Link>
            <Link className="control control-primary" to="/compare">
              Compare callers <Icon name="compare" />
            </Link>
          </div>
        }
      />
      <div className="metric-grid">
        <Link className="metric" to="/callers">
          <span>Recorded rewards</span>
          <strong>{money(total)}</strong>
          <small>Historical rewards snapshot</small>
        </Link>
        <Link className="metric" to="/callers">
          <span>The Marked Ones</span>
          <strong>{String(markedCallers.length).padStart(2, '0')}</strong>
          <small>Explore caller profiles ↗</small>
        </Link>
        <Link className="metric" to="/signals">
          <span>Original callouts</span>
          <strong>{String(publishedSignals.length).padStart(2, '0')}</strong>
          <small>Go to the source ↗</small>
        </Link>
        <Link className="metric" to="/saved">
          <span>Your shortlist</span>
          <strong>{String(items.length).padStart(2, '0')}</strong>
          <small>Callers and signals you saved ↗</small>
        </Link>
      </div>
      <div className="overview-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Rewards distribution</h2>
              <p>Callout Rewards across the five marked callers</p>
            </div>
            <span className="source-tag">Recorded USD</span>
          </div>
          <div
            className="reward-chart"
            role="group"
            aria-label={markedCallers
              .map(
                (caller) =>
                  caller.displayName +
                  ': ' +
                  money(caller.rewards?.amount ?? 0),
              )
              .join('; ')}
          >
            {markedCallers.map((caller, index) => (
              <div className="reward-bar-row" key={caller.id}>
                <Link to={'/callers/' + caller.id}>{caller.displayName}</Link>
                <div className="reward-bar-track">
                  <span
                    style={{
                      width:
                        (Number(caller.rewards?.amount ?? 0) / highest) * 100 +
                        '%',
                      animationDelay: index * 55 + 'ms',
                    }}
                  />
                </div>
                <strong>{money(caller.rewards?.amount ?? 0)}</strong>
              </div>
            ))}
          </div>
        </section>
        <aside className="panel shortlist-panel">
          <div className="panel-heading">
            <h2>Your shortlist</h2>
            <Link className="inline-action" to="/saved">
              Open list <Icon name="arrow" />
            </Link>
          </div>
          <div className="shortlist-content">
            <p className="fine-print">
              {shortlist.length
                ? 'Pick up where you left off.'
                : 'Keep a caller close. Save a profile to start your list.'}
            </p>
            {shortlist.length
              ? shortlist.slice(0, 3).map((item) => (
                  <div className="shortlist-row" key={item.id}>
                    <Link className="table-identity" to={item.to}>
                      <Portrait index={item.portrait} />
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.label}</small>
                      </span>
                    </Link>
                    <SaveButton id={item.id} label={item.name} />
                  </div>
                ))
              : markedCallers.slice(0, 2).map((caller) => (
                  <div className="shortlist-row" key={caller.id}>
                    <Link
                      className="table-identity"
                      to={'/callers/' + caller.id}
                    >
                      <Portrait index={caller.sourceRank - 1} />
                      <span>
                        <strong>{caller.displayName}</strong>
                        <small>Rank #{caller.sourceRank}</small>
                      </span>
                    </Link>
                    <SaveButton
                      id={'caller:' + caller.id}
                      label={caller.displayName}
                    />
                  </div>
                ))}
          </div>
        </aside>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>The Marked Ones</h2>
            <p>The callers behind the record</p>
          </div>
          <Link className="inline-action" to="/callers">
            Open directory <Icon name="arrow" />
          </Link>
        </div>
        <CallerTable callers={markedCallers} />
      </section>
      <section className="workspace-section">
        <div className="panel-heading standalone">
          <div>
            <h2>From the signal archive</h2>
            <p>Original posts, connected to their callers</p>
          </div>
          <Link className="inline-action" to="/signals">
            All signals <Icon name="arrow" />
          </Link>
        </div>
        <div className="signal-grid">
          {publishedSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>
      <SourceNote />
    </>
  )
}
