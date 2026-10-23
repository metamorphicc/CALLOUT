import { Link, useSearchParams } from 'react-router'
import { markedCallers } from '../features/marked-ones/data'
import { money, count } from '../lib/catalog'
import { Portrait } from '../components/Portrait'
import { EmptyState, PageHeading, SourceNote } from '../components/WorkspaceUI'

export default function Compare() {
  const [params] = useSearchParams()
  const ids = [...new Set((params.get('callers') ?? '').split(','))].slice(0, 3)
  const callers = ids.flatMap((id) =>
    markedCallers.filter((caller) => caller.id === id),
  )
  if (callers.length < 2)
    return (
      <EmptyState
        title="Choose your comparison"
        description="Select two or three callers in the directory to compare the same source metrics."
        to="/callers"
        action="Choose callers"
      />
    )
  return (
    <>
      <PageHeading
        title="Caller comparison"
        description="A side-by-side view of the same source snapshot. The page URL preserves your selection."
        action={
          <Link className="control" to="/callers">
            Change selection
          </Link>
        }
      />
      <div className="comparison-grid">
        {callers.map((caller) => (
          <article className="panel comparison-profile" key={caller.id}>
            <Portrait index={caller.sourceRank - 1} />
            <Link to={`/callers/${caller.id}`}>
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
                <dt>Median gain in source</dt>
                <dd>
                  {caller.sourceStatistics?.medianGainMultiple.toFixed(1)}×
                </dd>
              </div>
              <div>
                <dt>Average gain in source</dt>
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
          </article>
        ))}
      </div>
      <SourceNote />
    </>
  )
}
