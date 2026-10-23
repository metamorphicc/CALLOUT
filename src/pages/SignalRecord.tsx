import { Link, useParams } from 'react-router'
import { publishedSignals, displayDate } from '../lib/catalog'
import { markedCallers } from '../features/marked-ones/data'
import {
  EmptyState,
  ExternalLink,
  PageHeading,
  SaveButton,
} from '../components/WorkspaceUI'
import { Portrait } from '../components/Portrait'
import { CopyButton } from '../components/RecordActions'

export default function SignalRecord() {
  const { id } = useParams()
  const signal = publishedSignals.find((item) => item.id === id)
  if (!signal)
    return (
      <EmptyState
        title="Signal not found"
        description="This record is not in the archive."
        to="/signals"
        action="Browse signals"
      />
    )
  const caller = markedCallers.find((item) => item.id === signal.callerId)!
  return (
    <>
      <Link className="back-link" to="/signals">
        ← Signal archive
      </Link>
      <PageHeading
        title={`$${signal.symbol}`}
        description={`${signal.tokenName} · Solana`}
        action={
          <div className="record-actions">
            <CopyButton />
            <SaveButton id={`signal:${signal.id}`} label={signal.symbol} />
          </div>
        }
      />
      <div className="content-columns">
        <article className="panel record-body">
          <span className="source-tag">Original source linked</span>
          <h2>The callout</h2>
          <p>{signal.description}</p>
          <Link className="table-identity" to={`/callers/${caller.id}`}>
            <Portrait index={caller.sourceRank - 1} />
            <strong>{caller.displayName}</strong>
          </Link>
          <ExternalLink
            className="control control-primary"
            href={signal.sourceUrl}
          >
            Read original callout
          </ExternalLink>
          <h2>Token identity</h2>
          <dl>
            <div>
              <dt>Network</dt>
              <dd>Solana</dd>
            </div>
            <div>
              <dt>Mint address</dt>
              <dd className="mint-address">{signal.mint}</dd>
              <dd>
                <CopyButton value={signal.mint} label="Copy mint" />
              </dd>
            </div>
          </dl>
          <h2>Record history</h2>
          <div className="record-event">
            <span className="event-dot" />
            <div>
              <strong>Original callout indexed</strong>
              <p>
                {displayDate(signal.indexedAt)} · Source title and caller
                attribution recorded.
              </p>
            </div>
          </div>
        </article>
        <aside className="panel detail-aside">
          <h2>Record details</h2>
          <dl>
            <div>
              <dt>Original platform</dt>
              <dd>Pump.fun</dd>
            </div>
            <div>
              <dt>Publication time</dt>
              <dd>See original post</dd>
            </div>
            <div>
              <dt>Added to CALLOUT</dt>
              <dd>{displayDate(signal.indexedAt)}</dd>
            </div>
          </dl>
          <ExternalLink
            href={`https://explorer.solana.com/address/${signal.mint}`}
          >
            Open token explorer
          </ExternalLink>
          <Link className="inline-action" to="/methodology">
            Read the methodology →
          </Link>
        </aside>
      </div>
    </>
  )
}
