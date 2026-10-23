import { Link } from 'react-router'
import { Mark } from '../components/Mark'
import { Portrait } from '../components/Portrait'
import { PageHeading, ExternalLink } from '../components/WorkspaceUI'
import { project } from '../config/project'
import { useState } from 'react'

export default function About() {
  const [copy, setCopy] = useState('Copy address')
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(project.token.contractAddress ?? '')
      setCopy('Copied')
    } catch {
      setCopy('Select the address to copy')
    }
  }
  return (
    <>
      <PageHeading
        title="Inside the Order"
        description="The people, the record and the identity behind CALLOUT."
      />
      <div className="content-columns">
        <article className="reading-panel">
          <div className="about-seal">
            <Mark />
            <span>THE CALLOUT ORDER</span>
          </div>
          <h2>Every signal leaves a mark.</h2>
          <p>
            A callout is a public idea attached to a moment. Its value comes
            from what can be traced: who published it, what they said, and what
            the evidence shows afterward.
          </p>
          <p>
            The Callout Order keeps those records together. The caller directory
            starts with the rewards table shared by Alon. The signal archive
            links back to original posts, while your reading list gives you a
            personal way to follow the record.
          </p>
          <h2>The Marked Ones</h2>
          <p>
            These are the names in the source rewards snapshot. Inclusion
            records that source; it does not imply endorsement, a partnership,
            or a guarantee about future calls.
          </p>
          <Link className="inline-action" to="/callers">
            Meet the callers →
          </Link>
          <h2>The visual language</h2>
          <p>
            The triangle is the Order’s seal. Hooded pixel characters carry its
            identity, with a mint palette drawn from the community banner. They
            are original brand illustrations, distinct from verified caller
            portraits.
          </p>
          <div className="about-portraits" aria-label="Order character artwork">
            {[0, 1, 2, 3, 4].map((index) => (
              <Portrait index={index} key={index} />
            ))}
          </div>
          <h2>Built around the source</h2>
          <p>
            The directory keeps ranking facts separate from interpretation.
            Original references stay attached, unknowns stay explicit, and the
            record remains open to correction.
          </p>
          <Link className="inline-action" to="/methodology">
            How the records are read →
          </Link>
          {project.token.contractAddress && (
            <section className="asset-details">
              <h2>$CALLOUT</h2>
              <label className="field">
                Contract address
                <input readOnly value={project.token.contractAddress} />
              </label>
              <button className="control" onClick={copyAddress}>
                {copy}
              </button>
              <p role="status">{copy === 'Copy address' ? '' : copy}</p>
              {project.token.tradeUrl && (
                <ExternalLink href={project.token.tradeUrl}>
                  Trade $CALLOUT
                </ExternalLink>
              )}
              {project.token.chartUrl && (
                <ExternalLink href={project.token.chartUrl}>
                  View chart
                </ExternalLink>
              )}
            </section>
          )}
        </article>
        <aside className="panel detail-aside">
          <h2>Explore the Order</h2>
          <Link to="/callers">Caller directory →</Link>
          <Link to="/signals">Signal archive →</Link>
          <Link to="/community">Contribute a record →</Link>
          <h3>Independent by design</h3>
          <p>
            A community research project. No affiliation with Pump.fun or
            endorsement by listed callers.
          </p>
        </aside>
      </div>
    </>
  )
}
