---
'@myghf/ui': minor
---

DataTable keyboard expansion + CSV export utilities

- `DataTable` now renders a leading expander button per row when `expandable`, a real
  `<button>` with `aria-expanded` and an `aria-label` (`expandRowLabel`). Row expansion is no
  longer pointer-only.
- Add `toCsv` and `downloadCsv` (with the `CsvColumn`/`CsvOptions` types): RFC 4180 CSV
  serialization with a UTF-8 BOM by default, and a browser download helper that is a no-op
  outside a DOM. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
