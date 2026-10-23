import { createContext, useContext } from 'react'

export const SavedContext = createContext<{
  items: string[]
  toggle: (id: string) => void
  error: string
}>({ items: [], toggle: () => {}, error: '' })

export const useSaved = () => useContext(SavedContext)
