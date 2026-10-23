import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { markedCallers } from '../features/marked-ones/data'
import { publishedSignals, validSavedItems } from '../lib/catalog'
import { SavedContext } from '../lib/saved-context'

const storageKey = 'callout.saved.v1'
const allowed = [
  ...markedCallers.map((item) => `caller:${item.id}`),
  ...publishedSignals.map((item) => `signal:${item.id}`),
]
function readSaved() {
  try {
    return validSavedItems(localStorage.getItem(storageKey), allowed)
  } catch {
    return []
  }
}
export default function SavedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(readSaved)
  const [error, setError] = useState('')
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) setItems(readSaved())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  function toggle(id: string) {
    if (!allowed.includes(id)) return
    try {
      const current = readSaved()
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
      localStorage.setItem(storageKey, JSON.stringify(next))
      setItems(next)
      setError('')
    } catch {
      setError(
        'Your browser could not save this item. Allow site storage and try again.',
      )
    }
  }
  return (
    <SavedContext value={{ items, toggle, error }}>{children}</SavedContext>
  )
}
