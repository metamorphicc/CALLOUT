import { Link, useSearchParams } from 'react-router'
import { markedCallers } from '../features/marked-ones/data'
import { selectCallers } from '../lib/catalog'
import type { CallerSort } from '../lib/catalog'
import { CallerTable, PageHeading, SourceNote } from '../components/WorkspaceUI'

export default function Callers() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sort = (
    ['rank', 'rewards', 'followers', 'median'].includes(
      params.get('sort') ?? '',
    )
      ? params.get('sort')
      : 'rank'
  ) as CallerSort
  const selected = [...new Set((params.get('compare') ?? '').split(','))]
    .filter((id) => markedCallers.some((caller) => caller.id === id))
    .slice(0, 3)
  const callers = selectCallers(markedCallers, query, sort)
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  function select(id: string) {
    update(
      'compare',
      (selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
      ).join(','),
    )
  }
  return (
    <>
      <PageHeading
        title="The Marked Ones"
        description="Explore the callers behind the rewards. Compare the source data and build your own reading list."
      />
      <div className="workspace-toolbar">
        <label className="field search-field">
          Search callers
          <input
            type="search"
            placeholder="Search by name"
            value={query}
            onChange={(event) => update('q', event.target.value)}
          />
        </label>
        <label className="field">
          Sort by
          <select
            value={sort}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="rank">Source rank</option>
            <option value="rewards">Highest rewards</option>
            <option value="followers">Most followers</option>
            <option value="median">Median source gain</option>
          </select>
        </label>
        <div className="compare-action">
          {selected.length >= 2 ? (
            <Link
              className="control control-primary"
              to={`/compare?callers=${selected.join(',')}`}
            >
              Compare ({selected.length})
            </Link>
          ) : (
            <span>Select 2–3 callers to compare</span>
          )}
        </div>
      </div>
      <div className="panel">
        <div className="panel-heading">
          <h2>Caller directory</h2>
          <span>
            {callers.length} {callers.length === 1 ? 'caller' : 'callers'}
          </span>
        </div>
        <CallerTable callers={callers} selected={selected} onSelect={select} />
      </div>
      <SourceNote />
      <p className="fine-print">
        ¹ Median gain is reproduced from the source’s last-100-callouts
        statistics. It is not an independently measured return.
      </p>
    </>
  )
}
