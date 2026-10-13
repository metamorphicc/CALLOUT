import { useEffect, useRef } from 'react'
import { Arrow } from '../../components/Mark'
import { Portrait } from '../../components/Portrait'
import { originalPostUrl, signalStatus, signalStatusLabels } from './filter'
import { signalDate } from './format'
import type { SignalRecord } from './types'

const signalTime = (value: string) =>
  `${new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).format(new Date(value))} UTC`

const price = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(value)

const liquidity = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

function isEvidenceUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password
  } catch {
    return false
  }
}

function EvidenceLink({ url }: { url: string | null }) {
  if (!url) return <span className="signal-missing">No source attached</span>
  if (!isEvidenceUrl(url))
    return <span className="signal-missing">Source unavailable</span>
  return (
    <a
      className="text-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      View evidence <Arrow diagonal />
    </a>
  )
}

export default function SignalDialog({
  record,
  onDismiss,
}: {
  record: SignalRecord | null
  onDismiss: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (record && !dialog.current?.open) {
      dialog.current?.showModal()
      heading.current?.focus({ preventScroll: true })
      if (dialog.current) dialog.current.scrollTop = 0
    } else if (!record && dialog.current?.open) dialog.current.close()
  }, [record])
  const sourceUrl = record ? originalPostUrl(record) : null
  return (
    <dialog
      ref={dialog}
      className="caller-dialog signal-dialog"
      aria-labelledby="signal-dialog-title"
      aria-describedby="signal-dialog-provenance"
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }}
    >
      {record && (
        <div className="dialog-content">
          <div className="signal-dialog-top">
            <span className="signal-badge">
              {record.provenance === 'demo'
                ? 'Demo record'
                : 'Source-linked record'}
            </span>
            <p id="signal-dialog-provenance" className="helper">
              {record.provenance === 'demo'
                ? 'Fictional caller, token and observations. This is an interface example.'
                : 'Linked to a published callout. Source linkage does not verify its claims.'}
            </p>
          </div>
          <div className="signal-dialog-identity">
            <div>
              <p className="eyebrow">SOLANA / SIGNAL RECORD</p>
              <h2 ref={heading} tabIndex={-1} id="signal-dialog-title">
                ${record.token.symbol}
              </h2>
              <p className="helper">
                {record.token.name} · Mint address{' '}
                {record.token.mint ?? 'not supplied'}
              </p>
            </div>
            <div className="signal-caller">
              <Portrait index={record.caller.portraitIndex} />
              <span>{record.caller.name}</span>
            </div>
          </div>
          <div className="signal-published">
            <span>
              Published{' '}
              <time dateTime={record.publishedAt}>
                {signalDate(record.publishedAt)} ·{' '}
                {signalTime(record.publishedAt)}
              </time>
            </span>
            <span className="signal-status">
              <span className="pixel-dot" />
              {signalStatusLabels[signalStatus(record)]}
            </span>
          </div>
          <p className="signal-thesis">{record.summary}</p>
          <div className="signal-source-block">
            <h3>Original callout</h3>
            {sourceUrl ? (
              <>
                <a
                  className="text-link"
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open original post <Arrow diagonal />
                </a>
                <p className="helper">
                  Source checked {record.source?.checkedAt}
                </p>
              </>
            ) : (
              <p className="helper">
                {record.provenance === 'demo'
                  ? 'No original post exists for this demo.'
                  : 'An original-post link has not been supplied.'}
              </p>
            )}
          </div>
          <section
            className="signal-observations"
            aria-labelledby="signal-observations-title"
          >
            <h3 id="signal-observations-title">Observation timeline</h3>
            <p className="helper">
              {record.provenance === 'demo'
                ? 'All displayed prices and liquidity values are synthetic.'
                : 'USD price snapshots at fixed intervals. These are observations, not executable returns.'}
            </p>
            <ol className="signal-timeline">
              <li>
                <div className="signal-timeline-label">
                  <strong>At publication</strong>
                  <span>Baseline</span>
                </div>
                <div className="signal-timeline-value">
                  {record.entry ? (
                    <>
                      <strong>{price(record.entry.priceUsd)}</strong>
                      <time dateTime={record.entry.observedAt}>
                        {signalDate(record.entry.observedAt)} ·{' '}
                        {signalTime(record.entry.observedAt)}
                      </time>
                      <EvidenceLink
                        url={
                          record.provenance === 'demo'
                            ? null
                            : record.entry.referenceUrl
                        }
                      />
                    </>
                  ) : (
                    <span className="signal-missing">
                      Baseline not recorded
                    </span>
                  )}
                </div>
              </li>
              {(['1h', '24h'] as const).map((horizon) => {
                const observation = record.observations.find(
                  (item) => item.horizon === horizon,
                )
                return (
                  <li key={horizon}>
                    <div className="signal-timeline-label">
                      <strong>After {horizon}</strong>
                      <span>Observation</span>
                    </div>
                    <div className="signal-timeline-value">
                      {observation ? (
                        <>
                          <strong>{price(observation.priceUsd)}</strong>
                          <time dateTime={observation.observedAt}>
                            {signalDate(observation.observedAt)} ·{' '}
                            {signalTime(observation.observedAt)}
                          </time>
                          <span>
                            Liquidity:{' '}
                            {observation.liquidityUsd === null
                              ? 'not recorded'
                              : liquidity(observation.liquidityUsd)}
                          </span>
                          <EvidenceLink
                            url={
                              record.provenance === 'demo'
                                ? null
                                : observation.referenceUrl
                            }
                          />
                        </>
                      ) : (
                        <span className="signal-missing">
                          Observation not recorded
                        </span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
          <p className="signal-record-note">{record.note}</p>
          <a
            className="text-link"
            href="#archive-method"
            onClick={() => dialog.current?.close()}
          >
            Read the archive method <Arrow diagonal />
          </a>
          <button
            type="button"
            className="dialog-close"
            aria-label="Close signal record"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  )
}
