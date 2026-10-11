# CSV export

`toCsv` serializes rows to a CSV string (RFC 4180 quoting, CRLF line endings, optional UTF-8
BOM) and `downloadCsv` triggers a browser download. Both are dependency-free; `toCsv` is pure
and `downloadCsv` is a no-op outside a DOM, so they are safe to call from shared code.

```ts
import { downloadCsv, toCsv } from '@myghf/ui'

const csv = toCsv(
  [
    { id: 'patient', header: 'Patient' },
    { id: 'unit', header: 'Unit' },
    { id: 'waiting', header: 'Waiting (days)', value: (row) => row.waiting },
  ],
  rows,
)

downloadCsv('referrals.csv', csv)
```

## toCsv

```ts
function toCsv<T>(columns: CsvColumn<T>[], rows: T[], options?: CsvOptions): string
```

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `CsvColumn<T>[]` | — | The columns to write. |
| `rows` | `T[]` | — | The records. |
| `options.bom` | `boolean` | `true` | Prepend a UTF-8 BOM so Excel opens non-ASCII (Arabic) content correctly. |
| `options.delimiter` | `string` | `','` | Field delimiter. |

```ts
interface CsvColumn<T> {
  id: string              // header text and value key
  header?: string         // overrides the header text
  value?: (row: T) => unknown // reads the cell; defaults to `row[id]`
}
```

Fields containing the delimiter, a double quote, or a line break are quoted, and embedded
quotes are doubled. `null` and `undefined` render as empty fields.

## downloadCsv

```ts
function downloadCsv(filename: string, csv: string): void
```

Creates a `text/csv;charset=utf-8` blob, clicks a temporary anchor, then revokes the object URL.
Outside a DOM (`document`/`URL` undefined, e.g. during SSR) it returns without doing anything.

## With DataTable

Pair it with [`DataTable`](/components/data-table)'s `bulk-actions` slot to export the current
selection, or put a button in your own toolbar to export every row — see the
[selection example](/components/data-table#row-selection-and-bulk-actions).

## Accessibility

Export is a normal action; use a real `<button>` and an accessible name (a
[`Button`](/components/button) does both). The utility layer itself renders nothing.
