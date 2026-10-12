export function SectionHead({
  chapter,
  title,
  description,
}: {
  chapter: string
  title: string
  description?: string
}) {
  return (
    <header className="section-head">
      <p className="eyebrow">{chapter}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}
