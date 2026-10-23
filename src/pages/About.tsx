import { Link } from 'react-router'
import { Mark } from '../components/Mark'
import { Portrait } from '../components/Portrait'
import { PageHeading, ExternalLink, Icon } from '../components/WorkspaceUI'
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
        description="A shared identity. A record that stays."
      />
      <div className="content-columns">
        <article className="reading-panel">
          <div className="about-seal">
            <Mark />
            <span>THE CALLOUT ORDER</span>
          </div>
          <h2>Every signal leaves a mark.</h2>
          <p>
            A callout starts with a conviction: a name, a token, a moment on the
            timeline. Then the feed moves on. The Order began with a simple idea
            — keep the trail.
          </p>
          <p>
            CALLOUT brings caller profiles, recorded rewards and original
            signals into one workspace. Explore the people behind the calls,
            compare their records and keep the sources you want to revisit.
          </p>
          <h2>The Marked Ones</h2>
          <p>
            The first five names come from the Callout Rewards table shared by
            Alon. They open the record of the Order. Each profile connects the
            numbers to the original table and the callouts in our archive.
          </p>
          <div className="about-portraits" aria-label="Order character artwork">
            {[0, 1, 2, 3, 4].map((index) => (
              <Portrait index={index} key={index} />
            ))}
          </div>
          <Link className="inline-action" to="/callers">
            Meet the callers <Icon name="arrow" />
          </Link>
          <h2>The record belongs to its readers.</h2>
          <p>
            Your shortlist is yours to build. Save a caller, follow an original
            post, or bring a source that belongs in the archive. Contributions
            and corrections keep the record useful.
          </p>
          <Link className="inline-action" to="/community">
            Contribute to the Order <Icon name="arrow" />
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
          <h2>Find your way</h2>
          <Link to="/callers">Explore callers →</Link>
          <Link to="/compare">Compare records →</Link>
          <Link to="/signals">Follow a signal →</Link>
          <Link to="/saved">Your shortlist →</Link>
          <h3>Built around the source</h3>
          <p>
            Read the definitions behind the numbers and the references behind
            each record.
          </p>
          <Link to="/methodology">Sources & methodology →</Link>
        </aside>
      </div>
    </>
  )
}
