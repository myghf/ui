---
'@myghf/ui': minor
---

DataTable: column visibility, order, pinning, and resizing

- Register TanStack's `columnVisibilityFeature`, `columnOrderingFeature`, `columnPinningFeature`,
  `columnSizingFeature`, and `columnResizingFeature`.
- New `v-model` bindings: `column-visibility` (id → visible), `column-order` (ids), and
  `column-pinning` (`{ start, end }`). Pinning is logical, so pinned cells stick with
  `inset-inline-start`/`inset-inline-end` and mirror under RTL.
- New `resizable` prop renders drag handles on each header (double-click resets a column's size).
