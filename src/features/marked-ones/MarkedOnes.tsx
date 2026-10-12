import { useEffect, useRef, useState } from 'react'
import { Arrow, Mark } from '../../components/Mark'
import { Portrait } from '../../components/Portrait'
import { SectionHead } from '../../components/SectionHead'
import { leaderboardSource, markedCallers } from './data'
import type { MarkedCaller, OrderTitle } from './types'

const titles: OrderTitle[] = [
  'Grand Caller',
  'Elder',
  'Elder',
  'Initiate',
  'Initiate',
]
const dollars = (amount: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount))

function CallerDialog({
  caller,
  onDismiss,
}: {
  caller: MarkedCaller | null
  onDismiss: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const sourceLink = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (caller && !dialog.current?.open) {
      dialog.current?.showModal()
      sourceLink.current?.focus({ preventScroll: true })
      if (dialog.current) dialog.current.scrollTop = 0
    } else if (!caller && dialog.current?.open) dialog.current.close()
  }, [caller])
  const stats = caller?.sourceStatistics
  return (
    <dialog
      ref={dialog}
      className="caller-dialog"
      aria-labelledby="caller-name"
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }}
    >
      {caller && (
        <div className="dialog-content">
          <div className="dialog-identity">
            <Portrait index={caller.sourceRank - 1} />
            <div>
              <p className="eyebrow">
                SOURCE RANK / {String(caller.sourceRank).padStart(2, '0')}
              </p>
              <h2 id="caller-name">{caller.displayName}</h2>
              <span className="order-title">
                {titles[caller.sourceRank - 1]} <small>Order lore</small>
              </span>
            </div>
          </div>
          <div className="dialog-reward">
            <span>Callout Rewards</span>
            <strong>
              {caller.rewards ? dollars(caller.rewards.amount) : '—'}
            </strong>
            <span className="helper">
              USD value shown in the source table · reward period unspecified
            </span>
          </div>
          {stats && (
            <dl className="stats-grid">
              <div>
                <dt>Followers in snapshot</dt>
                <dd>{stats.followers.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Avg. callout market cap</dt>
                <dd>{dollars(stats.averageMarketCapLast100)}</dd>
              </div>
              <div>
                <dt>Median gain in source</dt>
                <dd>{stats.medianGainMultiple.toFixed(1)}×</dd>
              </div>
              <div>
                <dt>Average gain in source</dt>
                <dd>{stats.averageGainMultiple.toFixed(1)}×</dd>
              </div>
            </dl>
          )}
          <p className="source-note">
            Source statistics cover the last 100 callouts with callouts above
            $500M excluded. These figures are a historical source snapshot, not
            a forecast or an independent assessment of signal quality.
          </p>
          <p className="source-note">
            The avatar and Order title are creative interpretations. This
            listing does not imply affiliation or endorsement.
          </p>
          <a
            ref={sourceLink}
            className="text-link"
            href={leaderboardSource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the original table <Arrow diagonal />
          </a>
          <button
            className="dialog-close"
            aria-label="Close caller statistics"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  )
}

export default function MarkedOnes() {
  const [selected, setSelected] = useState<MarkedCaller | null>(null)
  return (
    <section className="section marked-section" id="marked-ones">
      <div className="container">
        <div className="section-heading-row">
          <SectionHead
            chapter="01 / THE MARKED ONES"
            title="Names that left a mark."
            description="Meet the first five callers, selected by the Callout Rewards shown in Alon’s source table."
          />
          <a
            className="text-link source-link"
            href={leaderboardSource.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View source table <Arrow diagonal />
          </a>
        </div>
        <div className="callers-grid">
          {markedCallers.map((caller, index) => (
            <button
              className={`caller-card ${index === 0 ? 'caller-card--first' : ''}`}
              key={caller.id}
              onClick={() => setSelected(caller)}
              aria-label={`View ${caller.displayName} statistics`}
            >
              <div className="caller-art">
                <span className="rank-stamp">
                  #{String(caller.sourceRank).padStart(2, '0')}
                </span>
                {index === 0 && <Mark className="caller-mark" />}
                <Portrait index={index} />
                <span className="caller-inspect">
                  <Arrow diagonal />
                </span>
              </div>
              <div className="caller-info">
                <span className="order-title">{titles[index]}</span>
                <h3>{caller.displayName}</h3>
                <span className="reward-label">CALLOUT REWARDS</span>
                <strong className="caller-reward">
                  {caller.rewards ? dollars(caller.rewards.amount) : '—'}
                </strong>
              </div>
            </button>
          ))}
        </div>
        <div className="leaderboard-footnote">
          <span>
            <span className="pixel-dot" />
            SOURCE SNAPSHOT · TRANSCRIBED OCT 12, 2026
          </span>
          <p>Ranked by rewards. Titles belong to the lore of the Order.</p>
        </div>
        <CallerDialog caller={selected} onDismiss={() => setSelected(null)} />
      </div>
    </section>
  )
}
