<script setup lang="ts">
import DataTableSorting from '../.vitepress/theme/demos/data-table/sorting.vue'
import DataTableExpanding from '../.vitepress/theme/demos/data-table/expanding.vue'
import DataTableLoading from '../.vitepress/theme/demos/data-table/loading.vue'
import DataTableSelection from '../.vitepress/theme/demos/data-table/selection.vue'
import DataTableFiltering from '../.vitepress/theme/demos/data-table/filtering.vue'
import DataTableColumns from '../.vitepress/theme/demos/data-table/columns.vue'
import DataTablePagination from '../.vitepress/theme/demos/data-table/pagination.vue'
</script>

# DataTable

`DataTable` is a headless, generic table built on `@tanstack/vue-table` v9, styled with the
same primitives as [Table](/components/table). You describe your rows with column
definitions, and it renders sortable headers, an optional expansion row, a loading state,
and an empty state.

```vue
<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable, type DataTableFeatures } from '@myghf/ui'

const data = [
  { id: 'r1', patient: 'Amina Farouk', waiting: 3 },
]
const columnHelper = createColumnHelper<DataTableFeatures, (typeof data)[number]>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('waiting', { header: 'Waiting (days)' }),
])
const getRowId = (row: (typeof data)[number]) => row.id
</script>

<template>
  <DataTable :data="data" :columns="columns" :get-row-id="getRowId" />
</template>
```

## Examples

### Sorting

Click a header to sort by that column; click again to reverse. By default the
sort lives in the component and is reported through `update:sorting`. Bind
`v-model:sorting` to own the state in the parent instead — the component then
only sorts when you write the prop back, which is what a server-side sort
(`manual`) needs. Set `sortable` to `false` to make every header static.

<Demo>
  <DataTableSorting />
</Demo>

<<< ../.vitepress/theme/demos/data-table/sorting.vue

### Expanding rows and cell slots

With `expandable`, clicking a row toggles an expansion row rendered through the `expansion`
slot. Expansion is single-row (opening one closes the other). Use a `cell-<columnId>` slot
to override a column's cell — here the `status` column renders a [Tag](/components/tag).

<Demo>
  <DataTableExpanding />
</Demo>

<<< ../.vitepress/theme/demos/data-table/expanding.vue

### Loading

Set `loading` while data is in flight and `DataTable` replaces the body with `loadingRows`
placeholder rows (default `5`), each a [`Skeleton`](/components/skeleton) per column, while
keeping the real header. The wrapper gets `aria-busy="true"` and a screen-reader-only
`loadingLabel` (default `Loading…`) announces the status. The empty state is suppressed
while loading, so an empty `data` array does not flash "No results" before the rows arrive.

<Demo>
  <DataTableLoading />
</Demo>

<<< ../.vitepress/theme/demos/data-table/loading.vue

## Types

### Row selection and bulk actions

Set `selectable` and bind `v-model:selection` to a map keyed by row id (provide `getRowId` so the
keys are stable). A leading checkbox column appears; the header checkbox selects every row, and a
bulk-actions bar is shown while rows are selected. Fill it through the `bulk-actions` slot, which
receives the selected `rows` and a `clear` function. Pair it with [`toCsv`](/utilities/csv) +
`downloadCsv` to export the selection — the demo's **Export** button does exactly that.

<Demo>
  <DataTableSelection />
</Demo>

<<< ../.vitepress/theme/demos/data-table/selection.vue

### Error state

Set `error` to a message and `DataTable` replaces the body with it (use the `error` slot for
custom content). The loading state still wins while `loading` is `true`.

### Searching and filters

`searchable` renders a global search input, bound with `v-model:global-filter`. Per-column
filters are a `ColumnFiltersState` bound with `v-model:filters` — every active filter shows as a
removable chip in the toolbar, with a **Clear filters** button. When rows are filtered out the
empty state switches to `noResultsLabel`. Use the `toolbar` slot to add your own controls
(e.g. a per-column filter select).

<Demo>
  <DataTableFiltering />
</Demo>

<<< ../.vitepress/theme/demos/data-table/filtering.vue

### Column visibility, order, pinning, and resizing

Three pieces of column state are bound with `v-model`: `column-visibility` (id → visible),
`column-order` (ids), and `column-pinning` (`{ start, end }`, logical so it mirrors under RTL —
pinned cells stick with `inset-inline-start`/`inset-inline-end`). Set `resizable` to show drag
handles on each header. Build the controls in the `toolbar` slot (the demo toggles a column and
pins another).

<Demo>
  <DataTableColumns />
</Demo>

<<< ../.vitepress/theme/demos/data-table/columns.vue

### Pagination and server-side mode

Set `paginate` to render the pagination footer (bound with `v-model:page-index` / `v-model:page-size`)
over the client-side rows. For large datasets set `manual` instead: TanStack skips client
sorting/filtering/pagination, `rowCount` supplies the server total, and you refetch on
`update:pageIndex`, `update:pageSize`, `update:sorting`, and `update:filters`. The `pagination`
slot replaces the default footer.

```vue
<DataTable
  v-model:page-index="pageIndex"
  v-model:page-size="pageSize"
  :data="rows"
  :columns="columns"
  :get-row-id="getRowId"
  :row-count="total"
  manual
/>
```

<Demo>
  <DataTablePagination />
</Demo>

<<< ../.vitepress/theme/demos/data-table/pagination.vue

### Virtual scrolling

For very large datasets set `maxHeight` and `virtual` together: `DataTable` renders only the
visible slice (plus a small overscan) and pads the rest with spacer rows, so the DOM stays small
however many rows you pass. It assumes a uniform `rowHeight` (default `40`) and does not account
for expansion rows, so use it with flat rows.

```vue
<DataTable :data="rows" :columns="columns" :get-row-id="getRowId" max-height="24rem" virtual />
```

### DataTableFeatures

`columns` is typed against `DataTableFeatures`, the feature set registered in
`src/lib/table.ts` and re-exported from `@myghf/ui`. It enables exactly three TanStack
features:

| Feature | What it adds |
| --- | --- |
| `rowSortingFeature` (+ `sortedRowModel`, `sortFns`) | Sortable columns and the `update:sorting` state. |
| `rowPaginationFeature` (+ `paginatedRowModel`) | Pagination state. `DataTable` renders the footer when `paginate` (or `manual`) is set; otherwise reach the row model by composing TanStack directly with `DataTableFeatures`. |
| `rowExpandingFeature` (+ `expandedRowModel`) | Per-row expansion driven by the `expanded` map. |
| `rowSelectionFeature` | Per-row selection, select-all, and the bulk-actions bar. |
| `columnFilteringFeature` (+ `filteredRowModel`, `filterFns`) | Per-column filters, the toolbar chips, and `update:filters`. |
| `globalFilteringFeature` | The global search term and `update:globalFilter`. |
| `columnVisibilityFeature` | Column visibility and `update:columnVisibility`. |
| `columnOrderingFeature` | Column order and `update:columnOrder`. |
| `columnPinningFeature` | Logical `start`/`end` pinning and `update:columnPinning`. |
| `columnSizingFeature` + `columnResizingFeature` | Column sizes and the drag-to-resize handles. |

TanStack v9 tree-shakes anything not registered, so features outside this list — column
grouping — are **not** available through
`DataTable`. Use it when you need exactly this set; otherwise compose
[Table](/components/table) yourself.

`columns` has the type
`ColumnDef<typeof dataTableFeatures, T>[]`, so author them with
`createColumnHelper<DataTableFeatures, T>()` from `@tanstack/vue-table`. A column's numeric
`size` is read structurally and used as the column (header) width.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | — (required) | Row data. |
| `columns` | `ColumnDef<DataTableFeatures, T>[]` | — (required) | Column definitions. |
| `getRowId` | `(row: T) => string` | — | Stable row id, used for keys and the expansion map. Strongly recommended. |
| `striped` | `boolean` | `false` | Shades every even body row. |
| `size` | `'sm' \| 'default'` | `'default'` | Compact or default text size. |
| `emptyLabel` | `string` | `'No results'` | Message shown when there are no rows. |
| `sortable` | `boolean` | `true` | Renders clicking/sorting headers for columns that can sort. |
| `sorting` | `SortingState` | — | Active sort. Uncontrolled unless bound — bind with `v-model:sorting` to own it in the parent. |
| `expandable` | `boolean` | `false` | Makes rows toggle a detail row. |
| `expanded` | `Record<string, boolean>` | `{}` | Expansion map keyed by row id. Bind with `v-model:expanded`. |
| `stopRowToggleOnInteractiveCells` | `boolean` | `true` | Keeps clicks on buttons/links/inputs from also toggling the row. |
| `maxHeight` | `string` | — | When set, makes the wrapper scroll vertically at this height. |
| `loading` | `boolean` | `false` | Renders placeholder skeleton rows instead of the data rows. Sets `aria-busy="true"` on the wrapper and suppresses the empty state. |
| `loadingRows` | `number` | `5` | Number of placeholder rows shown while `loading`. |
| `loadingLabel` | `string` | `'Loading…'` | Screen-reader-only text announced as the loading status. |
| `selectable` | `boolean` | `false` | Renders a leading checkbox column and the bulk-actions bar. |
| `selection` | `Record<string, boolean>` | `{}` | Selected-row map keyed by row id. Bind with `v-model:selection`. |
| `selectAllLabel` | `string` | `'Select all rows'` | Accessible name for the header checkbox. |
| `selectRowLabel` | `string` | `'Select row'` | Accessible-name prefix for each row checkbox (the row number is appended). |
| `selectedLabel` | `string` | `'selected'` | Word following the count in the bulk-actions bar. |
| `error` | `string` | — | Error message. Replaces the body unless `loading` is set. |
| `expandRowLabel` | `string` | `'Toggle row'` | Accessible-name prefix for each row's expander button (the row number is appended). |
| `searchable` | `boolean` | `false` | Renders a global search input in the toolbar. |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder for the search input. |
| `searchLabel` | `string` | `'Search'` | Accessible name for the search input. |
| `globalFilter` | `string` | `''` | Global filter term. Bind with `v-model:global-filter`. |
| `filters` | `ColumnFiltersState` | `[]` | Per-column filters. Bind with `v-model:filters`. |
| `noResultsLabel` | `string` | `'No results match your filters'` | Empty-state text shown while a filter is active. |
| `clearFiltersLabel` | `string` | `'Clear filters'` | Toolbar button that clears all filters. |
| `columnVisibility` | `Record<string, boolean>` | `{}` | Column visibility by id. Bind with `v-model:column-visibility`. |
| `columnOrder` | `string[]` | `[]` | Column order (ids). Bind with `v-model:column-order`. |
| `columnPinning` | `{ start?: string[]; end?: string[] }` | `{ start: [], end: [] }` | Pinned columns (logical). Bind with `v-model:column-pinning`. |
| `resizable` | `boolean` | `false` | Render drag handles to resize columns. |
| `manual` | `boolean` | `false` | Server-side mode: skip client sorting/filtering/pagination. |
| `paginate` | `boolean` | `false` | Render the pagination footer. |
| `pageIndex` | `number` | `0` | Current page (0-based). Bind with `v-model:page-index`. |
| `pageSize` | `number` | `10` | Rows per page. Bind with `v-model:page-size`. |
| `rowCount` | `number` | `0` | Total rows across all pages (server-side). |
| `pageSizeOptions` | `number[]` | `[5, 10, 20]` | Page-size choices in the footer. |
| `virtual` | `boolean` | `false` | Window the rows (requires `maxHeight`). Assumes uniform row height. |
| `rowHeight` | `number` | `40` | Assumed height of one data row, in pixels, when `virtual`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:sorting` | `{ id: string; desc: boolean }[]` | Emitted whenever the sort state changes. |
| `update:expanded` | `Record<string, boolean>` | Emitted with the new expansion map. |
| `update:selection` | `Record<string, boolean>` | Emitted with the new selection map. |
| `update:globalFilter` | `string` | Emitted with the new global filter term. |
| `update:filters` | `ColumnFiltersState` | Emitted with the new per-column filters. |
| `update:columnVisibility` | `Record<string, boolean>` | Emitted with the new visibility map. |
| `update:columnOrder` | `string[]` | Emitted with the new column order. |
| `update:columnPinning` | `{ start?: string[]; end?: string[] }` | Emitted with the new pinning state. |
| `update:pageIndex` | `number` | Emitted when the page changes. |
| `update:pageSize` | `number` | Emitted when the page size changes. |
| `row-click` | `unknown` | Emitted with the clicked row's original data. Fires even when `expandable` is `false`. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `empty` | — | Replaces `emptyLabel` when there are no rows. |
| `cell-<columnId>` | `{ row, cell, value }` | Overrides that column's cell. The column id is its accessor key (or `id`). |
| `expansion` | `{ row }` | Content of the expansion row, shown for expanded rows only. |
| `bulk-actions` | `{ rows, clear }` | Content of the bulk-actions bar, shown while rows are selected. |
| `error` | — | Replaces the error text when `error` is set. |
| `toolbar` | — | Extra controls in the toolbar (next to the search input and chips). |
| `pagination` | `{ pageIndex, pageSize, total }` | Replaces the default pagination footer. |

`DataTable` renders no default slot — all cells come from `FlexRender` or a `cell-*` slot.

## Exposed methods

None. `DataTable` does not call `defineExpose`. Sort and expand through `v-model` bindings
and the events above.

## Accessibility

- Sortable headers are real `<button>`s inside `<th>`, with the `aria-sort` state written
  by the underlying [TableHead](/components/table). Non-sortable headers render plain text.
  Keyboard users can focus and activate each sort button.
- Expansion is toggled by clicking the row (`TableRow` gets `clickable` and
  `data-state="expanded"`), and by a leading expander button rendered when `expandable`.
  `stopRowToggleOnInteractiveCells` prevents a click on an interactive cell from also toggling
  the row. The expander is a real `<button>` with `aria-expanded` and an
  `aria-label` (`expandRowLabel` plus the row number), so expansion is keyboard reachable.
- With `expandable`, the expansion row spans all columns and is revealed inline after the
  row it belongs to.
- While `loading`, the wrapper carries `aria-busy="true"` and a `sr-only` element holds
  `loadingLabel`, so assistive technology hears a status without seeing the placeholder
  rows. Placeholder rows are inert — they carry no click handler and cannot expand.
- The empty state renders a full-width `TableEmpty` row, so the table keeps its structure
  when there is no data. It is suppressed while `loading`, so an empty `data` array does
  not flash "No results" before the first rows arrive.
- With `selectable`, the header and row checkboxes are real [Checkbox](/components/checkbox)
  controls with `aria-label`s (`selectAllLabel`, and `selectRowLabel` plus the row number), and
  `aria-checked` reflects the selection. Clicking them never toggles row expansion.

## Dark mode & RTL

- `DataTable` renders through [Table](/components/table), so it inherits the same semantic
  tokens (`bg-surface`, `border-border`, `bg-surface-muted`) and adapts to dark mode.
  Expansion rows use `bg-surface-muted/30`.
- Loading placeholders use [Skeleton](/components/skeleton), whose `bg-surface-muted` fill
  is defined for both themes, so the loading state needs no extra dark-mode styles.
- Sorting icons are Lucide chevrons, and the width is applied per column, so no physical
  direction is baked in. When `maxHeight` is set the wrapper adds an `overflow-auto` scroll
  region; the underlying table's logical `text-start`/`text-end` alignment mirrors correctly
  under `dir="rtl"`.
