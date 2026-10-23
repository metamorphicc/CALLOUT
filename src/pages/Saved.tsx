import { markedCallers } from '../features/marked-ones/data'
import { publishedSignals } from '../lib/catalog'
import { useSaved } from '../lib/saved-context'
import { DownloadButton } from '../components/RecordActions'
import {
  CallerTable,
  EmptyState,
  PageHeading,
  SignalCard,
} from '../components/WorkspaceUI'

export default function Saved() {
  const { items } = useSaved()
  const callers = markedCallers.filter((caller) =>
    items.includes(`caller:${caller.id}`),
  )
  const signals = publishedSignals.filter((signal) =>
    items.includes(`signal:${signal.id}`),
  )
  const rows = [
    [
      'Type',
      'Name',
      'Caller',
      'Recorded rewards USD',
      'Mint',
      'Original source',
    ],
    ...callers.map((caller) => [
      'Caller',
      caller.displayName,
      caller.displayName,
      Number(caller.rewards?.amount ?? 0),
      '',
      caller.rewards?.sourceUrl ?? '',
    ]),
    ...signals.map((signal) => [
      'Signal',
      signal.symbol,
      signal.callerId,
      '',
      signal.mint,
      signal.sourceUrl,
    ]),
  ]
  return (
    <>
      <PageHeading
        title="Your reading list"
        description="Callers and original signals you want to revisit. Saved privately in this browser, with no account required."
        action={
          items.length > 0 ? (
            <DownloadButton rows={rows} filename="callout-shortlist.csv" />
          ) : undefined
        }
      />
      {!items.length && (
        <EmptyState
          title="Keep the records that matter"
          description="Use Save on any caller or signal. Your selections will appear here and remain after you reload."
          to="/callers"
          action="Explore callers"
        />
      )}
      {callers.length > 0 && (
        <section className="panel">
          <div className="panel-heading">
            <h2>Saved callers</h2>
            <span>{callers.length}</span>
          </div>
          <CallerTable callers={callers} />
        </section>
      )}
      {signals.length > 0 && (
        <section className="workspace-section">
          <div className="panel-heading standalone">
            <h2>Saved signals</h2>
            <span>{signals.length}</span>
          </div>
          <div className="signal-grid">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
