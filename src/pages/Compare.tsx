import { Link, useSearchParams } from 'react-router'
import { markedCallers, leaderboardSource } from '../features/marked-ones/data'
import { money, count } from '../lib/catalog'
import { Portrait } from '../components/Portrait'
import { CopyButton, DownloadButton } from '../components/RecordActions'
import { EmptyState, PageHeading, SourceNote } from '../components/WorkspaceUI'

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('callers')
  const ids =
    requested === null
      ? ['chairman', 'cupsey']
      : [...new Set(requested.split(','))]
          .filter((id) => markedCallers.some((caller) => caller.id === id))
          .slice(0, 3)
  const callers = ids.flatMap((id) =>
    markedCallers.filter((caller) => caller.id === id),
  )
  function choose(next: string[]) {
    setParams({ callers: next.join(',') })
  }
  const remaining = markedCallers.filter((caller) => !ids.includes(caller.id))
  const rows = [
    [
      'Caller',
      'Source rank',
      'Recorded rewards USD',
      'Followers at snapshot',
      'Median gain in source',
      'Average gain in source',
      'Average callout market cap USD',
      'Snapshot recorded',
      'Original source',
    ],
    ...callers.map((caller) => [
      caller.displayName,
      caller.sourceRank,
      Number(caller.rewards?.amount ?? 0),
      caller.sourceStatistics?.followers ?? 0,
      caller.sourceStatistics?.medianGainMultiple ?? 0,
      caller.sourceStatistics?.averageGainMultiple ?? 0,
      Number(caller.sourceStatistics?.averageMarketCapLast100 ?? 0),
      leaderboardSource.checkedOn,
      leaderboardSource.url,
    ]),
    ['Gain sample: last 100 callouts; excludes callouts above $500M.'],
  ]
  if (callers.length < 2)
    return (
      <EmptyState
        title="Choose your comparison"
        description="Select two or three callers to compare their recorded statistics."
        to="/callers"
        action="Choose callers"
      />
    )
  return (
    <>
      <PageHeading
        title="Compare callers"
        description="Recorded rewards, audience and source statistics, side by side."
        action={
          <div className="record-actions">
            <CopyButton />
            <DownloadButton rows={rows} filename="callout-comparison.csv" />
          </div>
        }
      />
      <div className="comparison-toolbar">
        <p>{callers.length} callers · One rewards snapshot</p>
        <div className="record-actions">
          {callers.length < 3 && remaining[0] && (
            <button
              className="control"
              onClick={() => {
                const next = remaining[0]
                if (next) choose([...ids, next.id])
              }}
            >
              Add a third caller
            </button>
          )}
          <Link
            className="inline-action"
            to={'/callers?compare=' + ids.join(',')}
          >
            Open directory ↗
          </Link>
        </div>
      </div>
      <div className="comparison-grid">
        {callers.map((caller, index) => (
          <article className="panel comparison-profile" key={caller.id}>
            <label className="field comparison-select">
              Caller {index + 1}
              <select
                value={caller.id}
                onChange={(event) =>
                  choose(
                    ids.map((id, i) => (i === index ? event.target.value : id)),
                  )
                }
              >
                {markedCallers
                  .filter(
                    (option) =>
                      option.id === caller.id || !ids.includes(option.id),
                  )
                  .map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
              </select>
            </label>
            <Portrait index={caller.sourceRank - 1} />
            <Link to={'/callers/' + caller.id}>
              <h2>{caller.displayName}</h2>
            </Link>
            <span className="source-tag">Source rank #{caller.sourceRank}</span>
            <dl>
              <div>
                <dt>Callout Rewards</dt>
                <dd>{money(caller.rewards?.amount ?? 0)}</dd>
              </div>
              <div>
                <dt>Followers</dt>
                <dd>{count(caller.sourceStatistics?.followers ?? 0)}</dd>
              </div>
              <div>
                <dt>Median gain in source¹</dt>
                <dd>
                  {caller.sourceStatistics?.medianGainMultiple.toFixed(1)}×
                </dd>
              </div>
              <div>
                <dt>Average gain in source¹</dt>
                <dd>
                  {caller.sourceStatistics?.averageGainMultiple.toFixed(1)}×
                </dd>
              </div>
              <div>
                <dt>Average callout market cap</dt>
                <dd>
                  {money(caller.sourceStatistics?.averageMarketCapLast100 ?? 0)}
                </dd>
              </div>
            </dl>
            {callers.length > 2 && (
              <button
                className="control comparison-remove"
                aria-label={'Remove ' + caller.displayName}
                onClick={() => choose(ids.filter((id) => id !== caller.id))}
              >
                Remove
              </button>
            )}
          </article>
        ))}
      </div>
      <SourceNote />
      <p className="fine-print">
        ¹ Last 100 callouts in the source, excluding callouts above $500M.
      </p>
    </>
  )
}
