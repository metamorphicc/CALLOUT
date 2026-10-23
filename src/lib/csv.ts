export type CsvRow = readonly (string | number)[]

export function toCsv(rows: readonly CsvRow[]): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value)
          // Keep text supplied by a record from becoming a spreadsheet formula.
          const safe =
            typeof value === 'string' && /^[\s]*[=+\-@]/.test(text)
              ? "'" + text
              : text
          return '"' + safe.replaceAll('"', '""') + '"'
        })
        .join(','),
    )
    .join('\r\n')
}
