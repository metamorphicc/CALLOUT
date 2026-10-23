import { leaderboardSource } from '../features/marked-ones/data'
import { PageHeading, ExternalLink } from '../components/WorkspaceUI'

export default function Methodology() {
  return (
    <>
      <PageHeading
        title="Sources & methodology"
        description="What the records establish, how they are organized, and where the evidence ends."
      />
      <article className="reading-panel methodology">
        <h2>The rewards snapshot</h2>
        <p>
          The caller directory reproduces five rows from the Callout Rewards
          table in Alon’s source post. The source was transcribed on October 12,
          2026. Ranking follows the dollar reward values shown there.
        </p>
        <ExternalLink href={leaderboardSource.url}>
          Read the original rewards table
        </ExternalLink>
        <h2>Reading the statistics</h2>
        <dl className="definition-list">
          <div>
            <dt>Callout Rewards</dt>
            <dd>
              The USD value displayed in the source. The reporting period and
              payout asset were not specified.
            </dd>
          </div>
          <div>
            <dt>Followers</dt>
            <dd>
              The count in the same historical snapshot, not a live social
              count.
            </dd>
          </div>
          <div>
            <dt>Source gains</dt>
            <dd>
              The source’s median and average statistics for the last 100
              callouts, excluding callouts above $500 million. These are not
              independently reproduced, executable returns.
            </dd>
          </div>
          <div>
            <dt>Average callout market cap</dt>
            <dd>
              The source value for average market capitalization at callout. It
              is not token price or available liquidity.
            </dd>
          </div>
        </dl>
        <h2>Original-source records</h2>
        <p>
          Each signal identifies its caller, token mint, source URL and date
          added to this directory. The source title establishes the indexed
          attribution. Full publication text, updates and publication time
          remain available at the original post.
        </p>
        <p>
          Archive date filters use the date added. When an exact publication
          time cannot be confirmed, the directory does not substitute the
          indexing date for it.
        </p>
        <h2>Price observations</h2>
        <p>
          A performance series requires a source, market, token identity and
          timestamp for the baseline and every later observation. A caller’s
          displayed position or P&L does not establish the outcome available to
          followers. The current source directory does not calculate price
          returns.
        </p>
        <h2>Corrections & contributions</h2>
        <p>
          Propose original callouts or flag a record through the community
          review form. Contributions open a GitHub issue for review; they do not
          directly modify the public directory. Submitted content is public on
          GitHub.
        </p>
        <h2>Interpretation</h2>
        <p>
          Caller inclusion records a historical source. Illustrations, project
          identity and source statistics do not establish affiliation,
          endorsement or future performance. Use the original evidence to form
          your own assessment.
        </p>
      </article>
    </>
  )
}
