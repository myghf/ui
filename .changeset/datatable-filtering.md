---
'@myghf/ui': minor
---

DataTable: searching and column filters

- Register TanStack's `columnFilteringFeature` + `globalFilteringFeature` (with the filtered row
  model and `filterFns`) in `DataTableFeatures`.
- New `searchable` prop renders a global search input bound with `v-model:global-filter`.
- New `filters` prop (`ColumnFiltersState`) bound with `v-model:filters`; active filters render as
  removable chips in the toolbar, with a **Clear filters** button (`clearFiltersLabel`).
- New `noResultsLabel` distinguishes "no rows match your filters" from the empty state, and a
  `toolbar` slot lets consumers add their own controls.
