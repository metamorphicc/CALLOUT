import { useState } from 'react'
import type { FormEvent } from 'react'
import { validateNomination } from '../features/nomination'
import { reviewUrl } from '../lib/catalog'
import { project } from '../config/project'
import { ExternalLink, PageHeading } from '../components/WorkspaceUI'

export default function Community() {
  const [error, setError] = useState('')
  const [field, setField] = useState<string>()
  const [review, setReview] = useState('')
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const result = validateNomination(
      String(data.get('handle') ?? ''),
      String(data.get('evidence') ?? ''),
    )
    if (result.error || !result.draft) {
      setError(result.error ?? 'Check the evidence links.')
      setField(result.field)
      const target = event.currentTarget.elements.namedItem(
        result.field ?? 'handle',
      )
      if (target instanceof HTMLElement) target.focus()
      return
    }
    setError('')
    setField(undefined)
    setReview(reviewUrl(result.draft.twitterHandle, result.draft.calloutUrls))
  }
  const links = Object.entries(project.links).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  )
  return (
    <>
      <PageHeading
        title="Community desk"
        description="Bring the original posts. Help keep the Order’s record accurate and useful."
      />
      <div className="content-columns">
        <section className="panel submission-panel">
          <h2>Propose a caller or callout</h2>
          <p>
            Add the caller’s X handle and up to five original posts. You will
            review the details on GitHub before submitting a public issue.
          </p>
          <form
            noValidate
            onSubmit={prepare}
            onChange={() => {
              setError('')
              setField(undefined)
              setReview('')
            }}
          >
            <label className="field">
              X / Twitter handle
              <input
                name="handle"
                maxLength={16}
                placeholder="@caller"
                required
                aria-invalid={field === 'handle'}
                aria-describedby="submission-feedback"
              />
            </label>
            <label className="field">
              Original callout posts
              <textarea
                name="evidence"
                maxLength={10000}
                rows={5}
                placeholder="https://x.com/caller/status/…"
                required
                aria-invalid={field === 'evidence'}
                aria-describedby="submission-feedback"
              />
            </label>
            <p className="fine-print">
              Use original X/Twitter or Pump.fun callout posts, one per line.
              You’ll need a GitHub account to submit. Issues and their contents
              are public.
            </p>
            <p
              className={error ? 'error-text' : 'submission-feedback'}
              id="submission-feedback"
              role="status"
            >
              {error ||
                (review
                  ? 'Your evidence is ready to review. Nothing has been submitted yet.'
                  : 'Review the source links before publishing a contribution.')}
            </p>
            {review ? (
              <ExternalLink href={review} className="control control-primary">
                Review on GitHub
              </ExternalLink>
            ) : (
              <button type="submit" className="control control-primary">
                Prepare review →
              </button>
            )}
          </form>
        </section>
        <aside className="panel detail-aside">
          <h2>Contribute to the record</h2>
          <p>
            Useful contributions include original callouts, corrected
            attributions and references for missing dates or observations.
          </p>
          <ExternalLink href="https://github.com/metamorphicc/CALLOUT/issues">
            Open reviews
          </ExternalLink>
          <ExternalLink href="https://github.com/metamorphicc/CALLOUT">
            Project repository
          </ExternalLink>
          {links.length > 0 && (
            <>
              <h3>Project channels</h3>
              {links.map(([key, value]) => (
                <ExternalLink href={value} key={key}>
                  {key === 'twitter'
                    ? 'X / Twitter'
                    : key === 'pump'
                      ? 'Pump.fun'
                      : 'Telegram'}
                </ExternalLink>
              ))}
            </>
          )}
          <h3>Evidence first</h3>
          <p>
            Reviewers assess attribution and source quality before adding
            records. Public contributions do not automatically become directory
            entries.
          </p>
        </aside>
      </div>
    </>
  )
}
