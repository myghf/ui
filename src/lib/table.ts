import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'
import type { DataTableHideBelow } from './responsive'

/**
 * Single registration point for the suite's engine.
 * Add a feature here only when a DataTable consumer needs it — v9 tree-shakes
 * whatever is not registered.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  sortFns,
  filterFns,
  // Type-only: types `ColumnDef.meta` (e.g. `hideBelow`) — phantom, stripped at runtime.
  columnMeta: {} as DataTableColumnMeta,
})

export type DataTableFeatures = typeof dataTableFeatures

/** Per-column meta typed into `ColumnDef.meta` through the features' `columnMeta` slot. */
export interface DataTableColumnMeta {
  /** Hide the column while the viewport is narrower than this screen (Tailwind semantics). */
  hideBelow?: DataTableHideBelow
  /** Text alignment for this column's header and cells, using logical properties. */
  align?: 'start' | 'center' | 'end'
}
