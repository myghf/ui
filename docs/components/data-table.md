<script setup lang="ts">
import DataTableSorting from '../.vitepress/theme/demos/data-table/sorting.vue'
import DataTableExpanding from '../.vitepress/theme/demos/data-table/expanding.vue'
import DataTableLoading from '../.vitepress/theme/demos/data-table/loading.vue'
import DataTableSelection from '../.vitepress/theme/demos/data-table/selection.vue'
import DataTableFiltering from '../.vitepress/theme/demos/data-table/filtering.vue'
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

Click a header to sort by that column; click again to reverse. Sorting state lives in the
component and is reported through `update:sorting`. Set `sortable` to `false` to make every
header static.

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

### DataTableFeatures

`columns` is typed against `DataTableFeatures`, the feature set registered in
`src/lib/table.ts` and re-exported from `@myghf/ui`. It enables exactly three TanStack
features:

| Feature | What it adds |
| --- | --- |
| `rowSortingFeature` (+ `sortedRowModel`, `sortFns`) | Sortable columns and the `update:sorting` state. |
| `rowPaginationFeature` (+ `paginatedRowModel`) | Registers the paginated row model. `DataTable` itself renders no pagination controls and does not expose the table instance, so reach this model by composing TanStack directly with `DataTableFeatures`. |
| `rowExpandingFeature` (+ `expandedRowModel`) | Per-row expansion driven by the `expanded` map. |
| `rowSelectionFeature` | Per-row selection, select-all, and the bulk-actions bar. |
| `columnFilteringFeature` (+ `filteredRowModel`, `filterFns`) | Per-column filters, the toolbar chips, and `update:filters`. |
| `globalFilteringFeature` | The global search term and `update:globalFilter`. |

TanStack v9 tree-shakes anything not registered, so features outside this list — column
resizing, grouping — are **not** available through
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

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:sorting` | `{ id: string; desc: boolean }[]` | Emitted whenever the sort state changes. |
| `update:expanded` | `Record<string, boolean>` | Emitted with the new expansion map. |
| `update:selection` | `Record<string, boolean>` | Emitted with the new selection map. |
| `update:globalFilter` | `string` | Emitted with the new global filter term. |
| `update:filters` | `ColumnFiltersState` | Emitted with the new per-column filters. |
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
