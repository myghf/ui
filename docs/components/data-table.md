<script setup lang="ts">
import DataTableSorting from '../.vitepress/theme/demos/data-table/sorting.vue'
import DataTableExpanding from '../.vitepress/theme/demos/data-table/expanding.vue'
</script>

# DataTable

`DataTable` is a headless, generic table built on `@tanstack/vue-table` v9, styled with the
same primitives as [Table](/components/table). You describe your rows with column
definitions, and it renders sortable headers, an optional expansion row, and an empty
state.

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

## Types

### DataTableFeatures

`columns` is typed against `DataTableFeatures`, the feature set registered in
`src/lib/table.ts` and re-exported from `@myghf/ui`. It enables exactly three TanStack
features:

| Feature | What it adds |
| --- | --- |
| `rowSortingFeature` (+ `sortedRowModel`, `sortFns`) | Sortable columns and the `update:sorting` state. |
| `rowPaginationFeature` (+ `paginatedRowModel`) | Registers the paginated row model. `DataTable` itself renders no pagination controls and does not expose the table instance, so reach this model by composing TanStack directly with `DataTableFeatures`. |
| `rowExpandingFeature` (+ `expandedRowModel`) | Per-row expansion driven by the `expanded` map. |

TanStack v9 tree-shakes anything not registered, so features outside this list — row
selection, column filtering, column resizing, grouping — are **not** available through
`DataTable`. Use it when you need exactly this set; otherwise compose
[Table](/components/table) yourself.

`columns` has the type
`ColumnDef<typeof dataTableFeatures, T>[]`, so author them with
`createColumnHelper<DataTableFeatures, T>()` from `@tanstack/vue-table`. A column's numeric
`size` is read structurally and used as the header/cell width.

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

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:sorting` | `{ id: string; desc: boolean }[]` | Emitted whenever the sort state changes. |
| `update:expanded` | `Record<string, boolean>` | Emitted with the new expansion map. |
| `row-click` | `unknown` | Emitted with the clicked row's original data. Fires even when `expandable` is `false`. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `empty` | — | Replaces `emptyLabel` when there are no rows. |
| `cell-<columnId>` | `{ row, cell, value }` | Overrides that column's cell. The column id is its accessor key (or `id`). |
| `expansion` | `{ row }` | Content of the expansion row, shown for expanded rows only. |

`DataTable` renders no default slot — all cells come from `FlexRender` or a `cell-*` slot.

## Exposed methods

None. `DataTable` does not call `defineExpose`. Sort and expand through `v-model` bindings
and the events above.

## Accessibility

- Sortable headers are real `<button>`s inside `<th>`, with the `aria-sort` state written
  by the underlying [TableHead](/components/table). Non-sortable headers render plain text.
  Keyboard users can focus and activate each sort button.
- Expansion is toggled by clicking the row (`TableRow` gets `clickable` and
  `data-state="expanded"`). `stopRowToggleOnInteractiveCells` prevents a click on an
  interactive cell from also toggling the row. **Known gap:** the `<tr>` itself has no
  `tabindex`, role, or keyboard handler, so row expansion is pointer-only — provide an
  explicit control (or keep essential detail outside the expansion) if keyboard users must
  open rows.
- With `expandable`, the expansion row spans all columns and is revealed inline after the
  row it belongs to.
- The empty state renders a full-width `TableEmpty` row, so the table keeps its structure
  when there is no data.

## Dark mode & RTL

- `DataTable` renders through [Table](/components/table), so it inherits the same semantic
  tokens (`bg-surface`, `border-border`, `bg-surface-muted`) and adapts to dark mode.
  Expansion rows use `bg-surface-muted/30`.
- Sorting icons are Lucide chevrons, and the width is applied per column, so no physical
  direction is baked in. The wrapper's `overflow-auto` scroll region and the underlying
  table's logical `text-start`/`text-end` alignment mirror correctly under `dir="rtl"`.
