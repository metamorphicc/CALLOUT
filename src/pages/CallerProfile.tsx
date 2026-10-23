import { Link, useParams } from 'react-router'
import { markedCallers, leaderboardSource } from '../features/marked-ones/data'
import { Portrait } from '../components/Portrait'
import { publishedSignals, money, count, displayDate } from '../lib/catalog'
import {
  ExternalLink,
  SaveButton,
  SignalCard,
  EmptyState,
  SourceNote,
} from '../components/WorkspaceUI'

export default function CallerProfile() {
  const { id } = useParams()
  const caller = markedCallers.find((item) => item.id === id)
  if (!caller)
    return (
      <EmptyState
        title="Caller not found"
        description="This profile is not in the directory."
        to="/callers"
        action="Browse callers"
      />
    )
  const signals = publishedSignals.filter((item) => item.callerId === caller.id)
  const stats = caller.sourceStatistics
  return (
    <>
      <Link className="back-link" to="/callers">
        ← Caller directory
      </Link>
      <div className="profile-heading">
        <Portrait index={caller.sourceRank - 1} />
        <div>
          <span className="source-tag">Source rank #{caller.sourceRank}</span>
          <h1>{caller.displayName}</h1>
          <p>Rewards snapshot · {displayDate(leaderboardSource.checkedOn)}</p>
        </div>
        <SaveButton id={`caller:${caller.id}`} label={caller.displayName} />
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>Callout Rewards</span>
          <strong>{money(caller.rewards?.amount ?? 0)}</strong>
          <small>Recorded USD</small>
        </div>
        <div className="metric">
          <span>Followers</span>
          <strong>{count(stats?.followers ?? 0)}</strong>
          <small>At the same snapshot</small>
        </div>
        <div className="metric">
          <span>Median gain¹</span>
          <strong>{stats?.medianGainMultiple.toFixed(1)}×</strong>
          <small>Last 100 callouts · source</small>
        </div>
        <div className="metric">
          <span>Average callout cap</span>
          <strong>{money(stats?.averageMarketCapLast100 ?? 0)}</strong>
          <small>Last 100 callouts · source</small>
        </div>
      </div>
      <div className="content-columns">
        <section>
          <div className="panel-heading standalone">
            <h2>Indexed callouts</h2>
            <span>
              {signals.length} {signals.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          {signals.length ? (
            <div className="signal-grid">
              {signals.map((signal) => (
                <SignalCard signal={signal} key={signal.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Add to the record"
              description={`Have an original callout from ${caller.displayName}? Link the post to this profile.`}
              to={`/community?caller=${caller.id}`}
              action="Contribute a callout"
            />
          )}
        </section>
        <aside className="panel detail-aside">
          <h2>Snapshot details</h2>
          <dl>
            <div>
              <dt>Ranking basis</dt>
              <dd>Callout Rewards</dd>
            </div>
            <div>
              <dt>Recorded on</dt>
              <dd>{displayDate(leaderboardSource.checkedOn)}</dd>
            </div>
            <div>
              <dt>Average source gain</dt>
              <dd>{stats?.averageGainMultiple.toFixed(1)}×</dd>
            </div>
            <div>
              <dt>Gain sample</dt>
              <dd>Last 100 callouts · below $500M</dd>
            </div>
          </dl>
          <ExternalLink href={leaderboardSource.url}>
            Open source table
          </ExternalLink>
          <Link className="inline-action" to="/methodology">
            Reading the statistics →
          </Link>
        </aside>
      </div>
      <SourceNote />
    </>
  )
}
