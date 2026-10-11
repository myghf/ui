---
'@myghf/ui': minor
---

DataTable: row selection, bulk actions, and an error state

- Register TanStack's `rowSelectionFeature`, so `DataTableFeatures` now includes row selection.
- New `selectable` prop adds a labelled checkbox column (header select-all + per-row), bound
  with `v-model:selection` (a map keyed by row id) and emitting `update:selection`.
- New `bulk-actions` slot renders a bar with the selected count while rows are selected,
  receiving `{ rows, clear }`.
- New `error` prop/slot replaces the body with an error message (unless `loading`).
