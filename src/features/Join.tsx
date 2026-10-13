import { useState } from 'react'
import type { FormEvent } from 'react'
import CommunityLinks from '../components/CommunityLinks'
import { Arrow, Mark } from '../components/Mark'
import { SectionHead } from '../components/SectionHead'
import { validateNomination } from './nomination'

export default function Join() {
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [errorField, setErrorField] = useState<
    'handle' | 'evidence' | undefined
  >()
  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const result = validateNomination(
      String(form.get('handle') ?? ''),
      String(form.get('evidence') ?? ''),
    )
    if (result.error || !result.draft) {
      setError(result.error ?? 'Check the nomination details.')
      setErrorField(result.field)
      const field = event.currentTarget.elements.namedItem(
        result.field ?? 'handle',
      )
      if (field instanceof HTMLElement) field.focus()
      setSaved(false)
      return
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(result.draft, null, 2)], {
        type: 'application/json',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `callout-nomination-${result.draft.twitterHandle}.json`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setError('')
    setSaved(true)
  }
  return (
    <section className="section join-section" id="join">
      <div className="container join-grid">
        <div className="join-copy">
          <SectionHead
            chapter="06 / JOIN THE ORDER"
            title="There’s room under the hood."
            description="Follow the story, meet the callers, and help write the next chapter. The Order starts with its people."
          />
          <CommunityLinks />
          <div className="join-signoff">
            <Mark />
            <span>
              A good call deserves
              <br />
              to be remembered.
            </span>
          </div>
        </div>
        <div className="nomination-desk">
          <h3>Know a caller worth marking?</h3>
          <p>
            Bring the receipts. Prepare a nomination with links to their
            original callouts.
          </p>
          <form
            onSubmit={saveDraft}
            noValidate
            onChange={() => {
              setError('')
              setSaved(false)
              setErrorField(undefined)
            }}
          >
            <div className="form-field">
              <label htmlFor="caller-handle">Twitter handle</label>
              <input
                id="caller-handle"
                name="handle"
                placeholder="@caller"
                maxLength={16}
                autoComplete="off"
                required
                aria-describedby="nomination-feedback"
                aria-invalid={errorField === 'handle'}
              />
            </div>
            <div className="form-field">
              <label htmlFor="callout-evidence">Original callout links</label>
              <textarea
                id="callout-evidence"
                name="evidence"
                placeholder="https://x.com/caller/status/…"
                rows={3}
                maxLength={10000}
                required
                aria-describedby="evidence-help nomination-feedback"
                aria-invalid={errorField === 'evidence'}
              />
              <span className="helper" id="evidence-help">
                Up to 5 links, one per line.
              </span>
            </div>
            <p
              className={`form-feedback ${error ? 'form-error' : ''}`}
              id="nomination-feedback"
              role="status"
              aria-live="polite"
            >
              {error ||
                (saved
                  ? 'Draft saved to your device. It has not been submitted.'
                  : 'Community submissions are coming soon. Save your draft for now.')}
            </p>
            <button className="button button--ink" type="submit">
              {saved ? 'Save draft again' : 'Save nomination draft'}
              <Arrow diagonal />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
