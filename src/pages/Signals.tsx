import { useSearchParams } from 'react-router'
import { publishedSignals } from '../lib/catalog'
import { markedCallers } from '../features/marked-ones/data'
import { PageHeading, SignalCard, EmptyState } from '../components/WorkspaceUI'

export default function Signals() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const caller = params.get('caller') ?? ''
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''
  const oldest = params.get('sort') === 'oldest'
  const invalid = Boolean(from && to && from > to)
  const signals = publishedSignals
    .filter(
      (signal) =>
        (!caller || signal.callerId === caller) &&
        (!from || signal.indexedAt >= from) &&
        (!to || signal.indexedAt <= to) &&
        `${signal.symbol} ${signal.tokenName} ${signal.mint}`
          .toLowerCase()
          .includes(query.trim().replace(/^\$/, '').toLowerCase()),
    )
    .sort(
      (a, b) =>
        (oldest
          ? a.indexedAt.localeCompare(b.indexedAt)
          : b.indexedAt.localeCompare(a.indexedAt)) || a.id.localeCompare(b.id),
    )
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  return (
    <>
      <PageHeading
        title="Signal archive"
        description="Original callouts, linked to their sources. Search the record and follow a thesis back to its author."
      />
      <div className="workspace-toolbar">
        <label className="field search-field">
          Find a token
          <input
            type="search"
            placeholder="Symbol, name or mint address"
            value={query}
            onChange={(event) => update('q', event.target.value)}
          />
        </label>
        <label className="field">
          Caller
          <select
            value={caller}
            onChange={(event) => update('caller', event.target.value)}
          >
            <option value="">All callers</option>
            {markedCallers.map((item) => (
              <option value={item.id} key={item.id}>
                {item.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Order
          <select
            value={oldest ? 'oldest' : 'newest'}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="newest">Newest added</option>
            <option value="oldest">Oldest added</option>
          </select>
        </label>
      </div>
      <div className="date-toolbar">
        <label className="field">
          Added from
          <input
            type="date"
            value={from}
            onChange={(event) => update('from', event.target.value)}
            aria-invalid={invalid}
            aria-describedby="signal-filter-status"
          />
        </label>
        <label className="field">
          Added through
          <input
            type="date"
            value={to}
            onChange={(event) => update('to', event.target.value)}
            aria-invalid={invalid}
            aria-describedby="signal-filter-status"
          />
        </label>
        {params.size > 0 && (
          <button className="control" onClick={() => setParams({})}>
            Clear filters
          </button>
        )}
      </div>
      <p
        id="signal-filter-status"
        className={`result-count ${invalid ? 'error-text' : ''}`}
        role="status"
      >
        {invalid
          ? 'The end date must be on or after the start date.'
          : `${signals.length} original-source ${signals.length === 1 ? 'record' : 'records'}`}
      </p>
      {!invalid && signals.length ? (
        <div className="signal-grid">
          {signals.map((signal) => (
            <SignalCard signal={signal} key={signal.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={invalid ? 'Check the date range' : 'No matching signals'}
          description="Adjust the caller, token or date-added filters to search the archive."
          to="/signals"
          action="View all signals"
        />
      )}
      <div className="source-disclosure">
        <p>
          Dates above describe when records were added to this directory.
          Original publication times and historical price observations are shown
          only when independently sourced. A listed callout is not an
          endorsement.
        </p>
      </div>
    </>
  )
}
