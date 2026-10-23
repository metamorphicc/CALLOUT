import { Link } from 'react-router'
import type { ReactNode } from 'react'
import { Portrait } from './Portrait'
import { leaderboardSource, markedCallers } from '../features/marked-ones/data'
import type { MarkedCaller } from '../features/marked-ones/types'
import { money, count, displayDate } from '../lib/catalog'
import type { PublishedSignal } from '../lib/catalog'
import { useSaved } from '../lib/saved-context'

export function Icon({
  name,
}: {
  name:
    | 'overview'
    | 'callers'
    | 'signals'
    | 'saved'
    | 'about'
    | 'community'
    | 'arrow'
    | 'search'
    | 'compare'
    | 'copy'
    | 'download'
}) {
  const paths = {
    overview: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    callers:
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    signals: 'M4 4h16v16H4zM8 9h8M8 13h5M8 17h3',
    saved: 'M6 3h12v18l-6-4-6 4z',
    about: 'M12 11v6M12 7v.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    community: 'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    compare: 'M4 3v18M20 3v18M8 7h8M8 12h8M8 17h8',
    copy: 'M9 8h12v13H9zM15 8V3H3v13h6',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="workspace-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      className={`external-link ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}
export function SourceNote() {
  return (
    <div className="source-disclosure">
      <span className="source-symbol">↳</span>
      <span>Rewards snapshot · {displayDate(leaderboardSource.checkedOn)}</span>
      <ExternalLink href={leaderboardSource.url}>Original table</ExternalLink>
      <Link className="inline-action" to="/methodology">
        Metric definitions
      </Link>
    </div>
  )
}
export function SaveButton({ id, label }: { id: string; label: string }) {
  const { items, toggle } = useSaved()
  const saved = items.includes(id)
  return (
    <button
      className={`save-control ${saved ? 'is-saved' : ''}`}
      type="button"
      aria-label={`${saved ? 'Unsave' : 'Save'} ${label}`}
      aria-pressed={saved}
      onClick={() => toggle(id)}
    >
      <Icon name="saved" />
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  )
}
export function EmptyState({
  title,
  description,
  to,
  action,
}: {
  title: string
  description: string
  to: string
  action: string
}) {
  return (
    <div className="workspace-empty">
      <Icon name="signals" />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="control control-primary" to={to}>
        {action}
        <Icon name="arrow" />
      </Link>
    </div>
  )
}
export function CallerTable({
  callers,
  selected,
  onSelect,
}: {
  callers: readonly MarkedCaller[]
  selected?: string[]
  onSelect?: (id: string) => void
}) {
  if (!callers.length)
    return (
      <EmptyState
        title="No callers found"
        description="Try another name or clear the search to see the directory."
        to="/callers"
        action="View all callers"
      />
    )
  return (
    <div className="caller-table-wrap">
      <table className="workspace-table">
        <thead>
          <tr>
            {onSelect && (
              <th className="select-cell">
                <span className="sr-only">Compare</span>
              </th>
            )}
            <th>Rank</th>
            <th>Caller</th>
            <th className="numeric">Rewards</th>
            <th className="numeric hide-small">Followers</th>
            <th className="numeric hide-medium">Median gain¹</th>
            <th>
              <span className="sr-only">Save caller</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {callers.map((caller) => (
            <tr key={caller.id}>
              {onSelect && (
                <td className="select-cell">
                  <label className="compare-check">
                    <input
                      type="checkbox"
                      aria-label={`Compare ${caller.displayName}`}
                      checked={selected?.includes(caller.id) ?? false}
                      onChange={() => onSelect(caller.id)}
                      disabled={
                        selected?.length === 3 && !selected.includes(caller.id)
                      }
                    />
                  </label>
                </td>
              )}
              <td className="rank-cell">
                {String(caller.sourceRank).padStart(2, '0')}
              </td>
              <td>
                <Link className="table-identity" to={`/callers/${caller.id}`}>
                  <Portrait index={caller.sourceRank - 1} />
                  <span>
                    <strong>{caller.displayName}</strong>
                    <small>
                      View profile <span aria-hidden="true">↗</span>
                    </small>
                  </span>
                </Link>
              </td>
              <td className="numeric reward-cell">
                {caller.rewards ? money(caller.rewards.amount) : '—'}
                <small>Recorded USD</small>
              </td>
              <td className="numeric hide-small">
                {caller.sourceStatistics
                  ? count(caller.sourceStatistics.followers)
                  : '—'}
              </td>
              <td className="numeric hide-medium">
                {caller.sourceStatistics?.medianGainMultiple.toFixed(1)}×
              </td>
              <td className="save-cell">
                <SaveButton
                  id={`caller:${caller.id}`}
                  label={caller.displayName}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export function SignalCard({ signal }: { signal: PublishedSignal }) {
  const caller = markedCallers.find((item) => item.id === signal.callerId)!
  return (
    <article className="workspace-signal">
      <div className="signal-record-top">
        <span className="source-tag">Pump.fun callout</span>
        <SaveButton id={`signal:${signal.id}`} label={signal.symbol} />
      </div>
      <div className="signal-record-title">
        <Link to={`/signals/${signal.id}`}>
          <h2>${signal.symbol}</h2>
        </Link>
        <span>{signal.tokenName}</span>
      </div>
      <p>{signal.description}</p>
      <Link className="signal-author" to={`/callers/${caller.id}`}>
        <Portrait index={caller.sourceRank - 1} />
        {caller.displayName}
      </Link>
      <div className="signal-record-footer">
        <span>Added {displayDate(signal.indexedAt)}</span>
        <Link className="inline-action" to={`/signals/${signal.id}`}>
          View record <Icon name="arrow" />
        </Link>
      </div>
    </article>
  )
}
