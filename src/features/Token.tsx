import { useState } from 'react'
import { Arrow, Mark } from '../components/Mark'
import { SectionHead } from '../components/SectionHead'
import { project } from '../config/project'

export default function Token() {
  const [copyState, setCopyState] = useState<
    'idle' | 'copying' | 'copied' | 'error'
  >('idle')
  const address = project.token.contractAddress
  async function copyAddress() {
    if (!address) return
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(address)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }
  return (
    <section className="section token-section" id="token">
      <div className="container token-grid">
        <div>
          <SectionHead
            chapter="04 / $CALLOUT"
            title="The story has a ticker."
            description="$CALLOUT is the token at the heart of the Order’s world. Follow this space for the official contract and launch details."
          />
          <p className="token-note">
            A shared identity. A growing story.
            <br />
            No promised returns or holder rewards.
          </p>
        </div>
        <div className="token-terminal">
          <div className="token-terminal-head">
            <span className="eyebrow">THE ORDER’S TOKEN</span>
            <span className="status-label">
              <span className="pixel-dot" />
              {address ? 'CONTRACT ANNOUNCED' : 'AWAITING LAUNCH'}
            </span>
          </div>
          <div className="token-symbol">
            <Mark />
            <strong>$CALLOUT</strong>
          </div>
          <div className="contract-block">
            <label htmlFor="contract-address">OFFICIAL CONTRACT</label>
            {address ? (
              <>
                <input
                  id="contract-address"
                  readOnly
                  value={address}
                  aria-label="Official token contract address"
                />
                <button
                  className="button button--small"
                  onClick={copyAddress}
                  disabled={copyState === 'copying'}
                  aria-busy={copyState === 'copying'}
                >
                  {copyState === 'copied'
                    ? 'Copied ✓'
                    : copyState === 'copying'
                      ? 'Copying…'
                      : 'Copy address'}
                </button>
              </>
            ) : (
              <p id="contract-address">
                Not announced yet <span>Check here before trading.</span>
              </p>
            )}
          </div>
          <p
            className={`copy-feedback ${copyState === 'error' ? 'form-error' : ''}`}
            role="status"
          >
            {copyState === 'error'
              ? 'Copy failed. Select and copy the address above.'
              : copyState === 'copied'
                ? 'Contract address copied.'
                : ''}
          </p>
          <div className="token-actions">
            {project.token.tradeUrl ? (
              <a
                className="button button--ink"
                href={project.token.tradeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Trade $CALLOUT <Arrow diagonal />
              </a>
            ) : (
              <button className="button" disabled>
                Trading soon <Arrow diagonal />
              </button>
            )}
            {project.token.chartUrl ? (
              <a
                className="button"
                href={project.token.chartUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View chart <Arrow diagonal />
              </a>
            ) : (
              <button className="button" disabled>
                Chart soon <Arrow diagonal />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
