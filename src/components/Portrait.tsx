import type { CSSProperties } from 'react'

export function Portrait({
  index,
  className = '',
}: {
  index: number
  className?: string
}) {
  return (
    <span
      className={`portrait portrait--${index} ${className}`}
      style={{ '--portrait-position': `${index * 25}%` } as CSSProperties}
      aria-hidden="true"
    />
  )
}
