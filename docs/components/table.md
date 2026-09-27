<script setup lang="ts">
import TableBasic from '../.vitepress/theme/demos/table/basic.vue'
import TablePagination from '../.vitepress/theme/demos/table/pagination.vue'
import TableEmpty from '../.vitepress/theme/demos/table/empty.vue'
</script>

# Table

The `Table` family is a set of unstyled primitives for building accessible tables from
slots: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, and
`TableEmpty`. `TablePagination` is a companion control that pairs with them. For sorting
and expanding, use [DataTable](/components/data-table).

```vue
<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@myghf/ui'

const rows = [
  { id: 1, name: 'Amina Farouk', clinic: 'Cardiology' },
]
</script>

<template>
  <Table striped>
    <TableHeader>
      <TableRow>
        <TableHead>Patient</TableHead>
        <TableHead>Clinic</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in rows" :key="row.id">
        <TableCell>{{ row.name }}</TableCell>
        <TableCell>{{ row.clinic }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

## Examples

### Rows, cells, and zones

Compose `<thead>`/`<tbody>` through `TableHeader`/`TableBody`, and rows/cells through
`TableRow`/`TableHead`/`TableCell`. `striped` shades every even body row, `size` switches
to compact text, `contained` (default) draws the rounded border, and `clickable` adds a
hover/pointer affordance to a row. Column alignment uses logical `start`/`end`.

<Demo>
  <TableBasic />
</Demo>

<<< ../.vitepress/theme/demos/table/basic.vue

### Pagination

`TablePagination` is controlled through `v-model:page-index` and `v-model:page-size` and
only needs the `total` count — slice your data yourself. `pageIndex` is **0-based**.

<Demo>
  <TablePagination />
</Demo>

<<< ../.vitepress/theme/demos/table/pagination.vue

### Empty state

`TableEmpty` renders one full-width row that is empty by default; pass `columns` so its
`colspan` matches the table, and provide a `label` or the default slot for the message.

<Demo>
  <TableEmpty />
</Demo>

<<< ../.vitepress/theme/demos/table/empty.vue

## Props

### Table

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `striped` | `boolean` | `false` | Shades every even body row with `bg-surface-muted/40`. |
| `size` | `'sm' \| 'default'` | `'default'` | `sm` renders `text-xs`, `default` renders `text-sm`. |
| `contained` | `boolean` | `true` | Wraps the table in a rounded border with a surface background. |

### TableHeader / TableBody

No props. They render `<thead>` and `<tbody>` respectively.

### TableRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `clickable` | `boolean` | `false` | Adds a pointer cursor and a hover background. The click is not wired for you — attach `@click`. |

### TableHead

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sortDirection` | `'ascending' \| 'descending' \| 'none'` | — | Sets `aria-sort`; `'none'` omits it. Visual/AT state only — it does not sort. |
| `width` | `string` | — | Applied as the cell's inline `width`. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Text alignment using logical properties. |

### TableCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Text alignment using logical properties. |
| `truncate` | `boolean` | — (falsy) | Caps the cell at `max-w-0` and truncates overflowing text with an ellipsis. |

### TableEmpty

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `number` | — (required) | Number of columns to span, so the row lines up with the header. |
| `label` | `string` | — | Message rendered when no default slot is provided. |

### TablePagination

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pageIndex` | `number` | — (required) | 0-based index of the current page. Bind with `v-model:page-index`. |
| `pageSize` | `number` | — (required) | Rows per page. Bind with `v-model:page-size`. |
| `total` | `number` | — (required) | Total number of rows across all pages. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20]` | Options shown in the rows-per-page select. |
| `rowsPerPageLabel` | `string` | `'Rows per page'` | Label beside the page-size select. |
| `ofLabel` | `string` | `'of'` | Word between the visible range and the total. |
| `previousLabel` | `string` | `'Previous page'` | `aria-label` of the previous button. |
| `nextLabel` | `string` | `'Next page'` | `aria-label` of the next button. |

## Events

| Component | Event | Payload | Description |
| --- | --- | --- | --- |
| `TablePagination` | `update:pageIndex` | `number` | Requested page change. |
| `TablePagination` | `update:pageSize` | `number` | Requested page-size change. |

`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, and `TableEmpty`
declare no custom events. Native listeners fall through to their root element (for example,
`@click` on `TableRow`).

## Slots

| Component | Slot | Description |
| --- | --- | --- |
| `Table` | `default` | Table content (`TableHeader` then `TableBody`). |
| `TableHeader` | `default` | Header rows. |
| `TableBody` | `default` | Body rows. |
| `TableRow` | `default` | Cells. |
| `TableHead` | `default` | Header cell content. |
| `TableCell` | `default` | Cell content. |
| `TableEmpty` | `default` | Overrides `label`. |

`TablePagination` renders no slots.

## Exposed methods

None. No component in the family calls `defineExpose`.

## Accessibility

- `Table` renders a plain `<table>`. Attributes fall through, so pass `aria-label` (or a
  `<caption>` as the first child of the default slot) to name the table.
- `TableHead` renders `<th scope="col">` and writes `aria-sort` only for `ascending` /
  `descending`. It does **not** make the header interactive: wrap the label in your own
  `<button>` when the column is sortable, or let [DataTable](/components/data-table) do it.
- `TableEmpty` spans every column with `colspan` so the message is announced in context.
- `TablePagination` uses a native `<select>` and real `<button>`s. The active page button
  gets `aria-current="page"`, previous/next buttons carry `aria-label`s, and both are
  disabled at the first/last page.

## Dark mode & RTL

- The contained wrapper uses `border-border` / `bg-surface`, the header
  `bg-surface-muted/60`, striping `bg-surface-muted/40`, and rows `border-border/60` — all
  semantic tokens, so light and dark both adapt.
- Alignment uses `text-start` / `text-end`, and cell padding is symmetric (`px-3 py-2`), so
  the table mirrors with no overrides when the container is `dir="rtl"`.
- `TablePagination` lays out with flex and `justify-between`; its previous/next chevrons use
  `rtl:rotate-180`, so they point the right way in bidi layouts.
