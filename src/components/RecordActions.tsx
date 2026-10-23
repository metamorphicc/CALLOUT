import { useEffect, useRef, useState } from 'react'
import { Icon } from './WorkspaceUI'
import { toCsv } from '../lib/csv'
import type { CsvRow } from '../lib/csv'

export function CopyButton({
  value,
  label = 'Copy link',
}: {
  value?: string
  label?: string
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const [manual, setManual] = useState('')
  useEffect(() => {
    if (state !== 'copied') return
    const timer = window.setTimeout(() => setState('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [state])
  async function copy() {
    const text = value ?? window.location.href
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setManual(text)
      setState('manual')
    }
  }
  return (
    <div className="copy-action">
      <button
        type="button"
        className="control"
        onClick={copy}
        aria-label={label}
      >
        <Icon name="copy" />
        {state === 'copied' ? 'Copied' : label}
      </button>
      <span className="sr-only" role="status">
        {state === 'copied' ? label + ': copied to clipboard.' : ''}
      </span>
      {state === 'manual' && (
        <label className="copy-fallback">
          Select and copy
          <input
            readOnly
            value={manual}
            onFocus={(event) => event.currentTarget.select()}
            aria-label={label + ' manually'}
          />
        </label>
      )}
    </div>
  )
}

export function DownloadButton({
  rows,
  filename,
  label = 'Export CSV',
}: {
  rows: readonly CsvRow[]
  filename: string
  label?: string
}) {
  const [status, setStatus] = useState('')
  const pending = useRef<string | null>(null)
  useEffect(
    () => () => {
      if (pending.current) URL.revokeObjectURL(pending.current)
    },
    [],
  )
  function download() {
    try {
      if (pending.current) URL.revokeObjectURL(pending.current)
      const url = URL.createObjectURL(
        new Blob(['\uFEFF' + toCsv(rows)], { type: 'text/csv;charset=utf-8' }),
      )
      pending.current = url
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.append(link)
      link.click()
      link.remove()
      setStatus('Your CSV download is ready.')
    } catch {
      setStatus('Download could not start. Try again in your browser.')
    }
  }
  return (
    <div className="download-action">
      <button className="control" type="button" onClick={download}>
        <Icon name="download" />
        {label}
      </button>
      <span role="status" className="action-feedback">
        {status}
      </span>
    </div>
  )
}
