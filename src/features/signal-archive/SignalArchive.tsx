import { useState } from 'react'
import { Arrow, Mark } from '../../components/Mark'
import { Portrait } from '../../components/Portrait'
import { SectionHead } from '../../components/SectionHead'
import { signalRecords } from './data'
import {
  defaultSignalFilters,
  filterSignals,
  originalPostUrl,
  signalStatus,
  signalStatusLabels,
} from './filter'
import SignalDialog from './SignalDialog'
import { signalDate } from './format'
import type { SignalFilters, SignalRecord } from './types'
import './signal-archive.css'

const callers = [
  ...new Map(
    signalRecords.map((record) => [record.caller.id, record.caller]),
  ).values(),
]

export default function SignalArchive() {
  const [filters, setFilters] = useState<SignalFilters>(defaultSignalFilters)
  const [selected, setSelected] = useState<SignalRecord | null>(null)
  const result = filterSignals(signalRecords, filters)
  const hasFilters = Object.keys(defaultSignalFilters).some(
    (key) =>
      filters[key as keyof SignalFilters] !==
      defaultSignalFilters[key as keyof SignalFilters],
  )
  const update = <K extends keyof SignalFilters>(
    key: K,
    value: SignalFilters[K],
  ) => setFilters((current) => ({ ...current, [key]: value }))
  const demoCount = signalRecords.filter(
    (record) => record.provenance === 'demo',
  ).length
  return (
    <section
      className="section signal-archive"
      id="signal-archive"
      aria-label="The Signal Archive"
    >
      <div className="container">
        <div className="archive-heading">
          <SectionHead
            chapter="02 / THE SIGNAL ARCHIVE"
            title="Keep the signal. Keep the evidence."
            description="Explore dated callouts, their original sources and the observations that followed."
          />
          <a className="text-link" href="#archive-method">
            How to read a record <Arrow diagonal />
          </a>
        </div>
        {demoCount > 0 && (
          <div className="archive-demo-notice">
            <span className="signal-badge">Demo archive</span>
            <p>
              {demoCount === signalRecords.length
                ? 'You are browsing fictional examples. Callers, tokens, dates and market values are illustrative; real callouts will be added when sources are supplied.'
                : 'Records marked Demo are fictional examples. Their callers, tokens, dates and market values are illustrative.'}
            </p>
          </div>
        )}
        <form
          className="archive-filters"
          aria-label="Filter signals"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="archive-filters-main">
            <div className="archive-field archive-search">
              <label htmlFor="archive-token">Token</label>
              <input
                id="archive-token"
                type="search"
                placeholder="Symbol, name or mint address"
                value={filters.token}
                onChange={(event) => update('token', event.target.value)}
              />
            </div>
            <div className="archive-field">
              <label htmlFor="archive-caller">Caller</label>
              <select
                id="archive-caller"
                value={filters.callerId}
                onChange={(event) => update('callerId', event.target.value)}
              >
                <option value="all">All callers</option>
                {callers.map((caller) => (
                  <option value={caller.id} key={caller.id}>
                    {caller.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="archive-field">
              <label htmlFor="archive-status">Data status</label>
              <select
                id="archive-status"
                value={filters.status}
                onChange={(event) =>
                  update(
                    'status',
                    event.target.value as SignalFilters['status'],
                  )
                }
              >
                <option value="all">All statuses</option>
                {Object.entries(signalStatusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="archive-filters-secondary">
            <div className="archive-field">
              <label htmlFor="archive-from">From date · UTC</label>
              <input
                id="archive-from"
                type="date"
                value={filters.from}
                aria-invalid={Boolean(result.error)}
                aria-describedby="archive-filter-feedback"
                onChange={(event) => update('from', event.target.value)}
              />
            </div>
            <div className="archive-field">
              <label htmlFor="archive-to">To date · UTC</label>
              <input
                id="archive-to"
                type="date"
                value={filters.to}
                aria-invalid={Boolean(result.error)}
                aria-describedby="archive-filter-feedback"
                onChange={(event) => update('to', event.target.value)}
              />
            </div>
            <div className="archive-field">
              <label htmlFor="archive-sort">Order</label>
              <select
                id="archive-sort"
                value={filters.sort}
                onChange={(event) =>
                  update('sort', event.target.value as SignalFilters['sort'])
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
            <button
              className="button archive-reset"
              type="button"
              disabled={!hasFilters}
              onClick={() => setFilters(defaultSignalFilters)}
            >
              Reset filters
            </button>
          </div>
        </form>
        <div className="archive-results-meta">
          <p
            id="archive-filter-feedback"
            className={result.error ? 'form-error' : ''}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {result.error ??
              `${result.records.length} of ${signalRecords.length} records`}
          </p>
          <span>Publication dates · UTC</span>
        </div>
        <div className="archive-grid">
          {result.records.map((record) => {
            const status = signalStatus(record)
            const sourceUrl = originalPostUrl(record)
            return (
              <article className="signal-card" key={record.id}>
                <div className="signal-card-top">
                  <span className="signal-badge">
                    {record.provenance === 'demo' ? 'Demo' : 'Source linked'}
                  </span>
                  <time dateTime={record.publishedAt}>
                    {signalDate(record.publishedAt)}
                  </time>
                </div>
                <div className="signal-card-title">
                  <h3>${record.token.symbol}</h3>
                  <span>{record.token.name}</span>
                </div>
                <p className="signal-card-summary">{record.summary}</p>
                <div className="signal-caller">
                  <Portrait index={record.caller.portraitIndex} />
                  <span>{record.caller.name}</span>
                </div>
                <div className="signal-card-bottom">
                  <span className={`signal-status signal-status--${status}`}>
                    <span className="pixel-dot" />
                    {signalStatusLabels[status]}
                  </span>
                  <button
                    className="text-link signal-inspect"
                    type="button"
                    aria-label={`Inspect ${record.token.symbol} by ${record.caller.name}, ${signalDate(record.publishedAt)}`}
                    onClick={() => setSelected(record)}
                  >
                    Inspect signal <Arrow diagonal />
                  </button>
                </div>
                {sourceUrl && (
                  <a
                    className="text-link signal-original-link"
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Original post <Arrow diagonal />
                  </a>
                )}
              </article>
            )
          })}
        </div>
        {!result.records.length && (
          <div className="archive-empty">
            <Mark />
            <h3>
              {result.error
                ? 'Check the date range.'
                : signalRecords.length
                  ? 'No signals match these filters.'
                  : 'The archive is waiting for its first signal.'}
            </h3>
            <p>
              {result.error
                ? 'Choose an end date on or after the start date, or reset the filters.'
                : signalRecords.length
                  ? 'Try another token, caller or date range to explore the archive.'
                  : 'Original callout posts will appear here once they are supplied.'}
            </p>
            {hasFilters && (
              <button
                className="button button--ink"
                type="button"
                onClick={() => setFilters(defaultSignalFilters)}
              >
                Reset filters <Arrow diagonal />
              </button>
            )}
          </div>
        )}
        <details className="archive-method" id="archive-method">
          <summary>
            How the archive records a signal <span aria-hidden="true">+</span>
          </summary>
          <div className="archive-method-grid">
            <div>
              <h3>Start with the original.</h3>
              <p>
                Keep the caller, token mint, exact publication time and a link
                to the original post. A source-linked record confirms the link,
                not the truth of a thesis.
              </p>
            </div>
            <div>
              <h3>Use fixed observations.</h3>
              <p>
                The archive uses a publication-time baseline and 1h / 24h USD
                price snapshots. Record actual timestamps, data sources and
                available liquidity; never substitute an all-time high.
              </p>
            </div>
            <div>
              <h3>Keep gaps visible.</h3>
              <p>
                Missing observations stay missing. Price snapshots exclude fees,
                slippage and fill availability, so they do not establish an
                executable return or caller quality.
              </p>
            </div>
          </div>
          <p className="archive-method-note">
            Demo records use synthetic values and have no original posts. No
            live market feed or automated verification is connected.
          </p>
        </details>
        <SignalDialog record={selected} onDismiss={() => setSelected(null)} />
      </div>
    </section>
  )
}
