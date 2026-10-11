export interface CsvColumn<T> {
  /** Column key. Used as the header when `header` is omitted, and to read the value. */
  id: string
  /** Header text. Defaults to `id`. */
  header?: string
  /** Reads the cell value. Defaults to `row[id]`. */
  value?: (row: T) => unknown
}

export interface CsvOptions {
  /** Prepend a UTF-8 BOM so Excel opens non-ASCII (e.g. Arabic) content correctly. Default `true`. */
  bom?: boolean
  /** Field delimiter. Default `','`. */
  delimiter?: string
}

function needsQuoting(text: string, delimiter: string): boolean {
  return (
    text.includes('"') || text.includes('\n') || text.includes('\r') || text.includes(delimiter)
  )
}

function escapeField(value: unknown, delimiter: string): string {
  const text = value == null ? '' : String(value)
  return needsQuoting(text, delimiter) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * Serializes rows to CSV (RFC 4180 quoting, CRLF line endings). Pure and
 * dependency-free, so it can run on the server.
 */
export function toCsv<T>(columns: CsvColumn<T>[], rows: T[], options: CsvOptions = {}): string {
  const { bom = true, delimiter = ',' } = options
  const header = columns.map((column) => escapeField(column.header ?? column.id, delimiter)).join(delimiter)
  const body = rows.map((row) =>
    columns
      .map((column) =>
        escapeField(
          column.value ? column.value(row) : (row as Record<string, unknown>)[column.id],
          delimiter,
        ),
      )
      .join(delimiter),
  )
  const csv = [header, ...body].join('\r\n')
  return bom ? `\uFEFF${csv}` : csv
}

/**
 * Triggers a browser download of a CSV string. A no-op outside a DOM
 * (e.g. during SSR), so it is safe to call in shared code.
 */
export function downloadCsv(filename: string, csv: string): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
