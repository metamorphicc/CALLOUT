export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 4h4v5h4v7h4v7h4v7h4v10H6V30h4v-7h4v-7h4V9h4Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <path d="m24 18 9 17H15Z" fill="currentColor" />
    </svg>
  )
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export function PixelStar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0h4v6h2v2h6v4h-6v2h-2v6H8v-6H6v-2H0V8h6V6h2Z"
      />
    </svg>
  )
}
