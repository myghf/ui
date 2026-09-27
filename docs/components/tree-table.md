<script setup lang="ts">
import TreeTableBasic from '../.vitepress/theme/demos/tree-table/basic.vue'
</script>

# TreeTable

`TreeTable` renders a hierarchical `TreeNode<T>[]` as an expandable grid: one tree column
with indentation and disclosure controls, plus any number of data columns. It is built on
reka-ui's tree primitive and shares the table family's surface/border tokens.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TreeTable, type TreeTableColumn, type TreeNode } from '@myghf/ui'

const nodes: TreeNode[] = [
  {
    value: 'cardiology',
    label: 'Cardiology',
    children: [{ value: 'echo', label: 'Echocardiography' }],
  },
]
const columns: TreeTableColumn[] = [{ key: 'lead', header: 'Lead' }]
const expanded = ref<string[]>(['cardiology'])
</script>

<template>
  <TreeTable v-model:expanded="expanded" :nodes="nodes" :columns="columns">
    <template #cell-lead="{ node }">{{ node.label }} lead</template>
  </TreeTable>
</template>
```

## Examples

### Departments and staff

`expanded` is the flat list of expanded node keys. Every row exposes its node to the
`row-label` slot and to each `cell-<key>` slot, so you can render arbitrary content per
column — here reading a `data` payload typed as `Department`.

<Demo>
  <TreeTableBasic />
</Demo>

<<< ../.vitepress/theme/demos/tree-table/basic.vue

## Types

### TreeTableColumn

```ts
interface TreeTableColumn {
  key: string        // matches the `cell-<key>` slot name
  header: string     // header text for the column
  width?: string     // CSS grid track, e.g. 'minmax(5rem, 0.5fr)'
  align?: 'start' | 'center' | 'end'
}
```

The tree column is fixed at `minmax(12rem, 1fr)`; each data column uses its `width` (or
`minmax(6rem, 1fr)` when omitted).

### TreeNode

```ts
interface TreeNode<T = unknown> {
  value: string        // stable key, emitted in `expanded`
  label?: string       // default tree-column label (falls back to `value`)
  disabled?: boolean   // reserved — not currently enforced by TreeTable
  children?: TreeNode<T>[]
  data?: T             // your payload, available in the cell slots
}
```

`TreeNode` is the shared tree shape (also used by [TreeSelect](/components/tree-select)).
Related exported types are `FlatTreeRow<T>` (one flattened, visible row with `node`,
`key`, `level`, `parentKey`, and `hasChildren`) and `CheckedState`
(`'checked' | 'indeterminate' | 'unchecked'`), which the library's tree helpers use.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `TreeNode<T>[]` | — (required) | The tree to render. |
| `columns` | `TreeTableColumn[]` | — (required) | Data columns after the tree column. |
| `expanded` | `string[]` | `[]` | Keys of expanded nodes. Bind with `v-model:expanded`. |
| `rowLabel` | `(node: TreeNode<T>) => string` | `node.label ?? node.value` | Text used for the tree column and the disclosure button's `aria-label`. |
| `rowColumnHeader` | `string` | `'Name'` | Header of the tree column. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | `string[]` | Emitted with the new list of expanded node keys when a node is toggled. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `header` | — | Replaces `rowColumnHeader` in the tree column header. |
| `row-label` | `{ node, level }` | Replaces the tree column's label. |
| `cell-<key>` | `{ node, row, isExpanded, hasChildren, handleToggle }` | Renders the cell for the column whose `key` matches. |

`TreeTable` has no default slot. Columns without a matching `cell-<key>` slot render
nothing.

## Exposed methods

None. `TreeTable` does not call `defineExpose`. Control expansion through
`v-model:expanded`.

## Accessibility

- The rows are reka-ui tree items: `role="tree"` with `role="treeitem"`, `aria-level`, and
  `aria-expanded` for nodes that have children. Keyboard navigation follows the tree
  pattern (arrow keys to move and expand/collapse, <kbd>Home</kbd>/<kbd>End</kbd> to jump).
- The disclosure control is a real `<button>`; when present its accessible name comes from
  `rowLabel`. **Known gap:** that name is the node label (for example "Echocardiography"),
  not an action like "Expand", so it does not announce what the button does.
- The header and data cells are `<div>`s in a CSS grid, **not** a real `<table>`, so there
  are no `table`/`columnheader` roles. Assistive technology receives the tree structure and
  each row's content, but not the column associations. Keep cell content self-describing.
- `TreeNode.disabled` is part of the type but is not passed to the tree items, so a
  `disabled` node stays interactive. Treat it as reserved.

## Dark mode & RTL

- The container uses `border-border` / `bg-surface`, the header `bg-surface-muted/60`,
  row borders `border-border/60`, and selected rows `bg-surface-muted/30` — semantic tokens
  for both themes.
- Indentation uses `paddingInlineStart: calc(0.75rem + (level − 1) × 1.25rem)`, so nesting
  mirrors under `dir="rtl"`, and the disclosure chevron uses `rtl:rotate-180`. Column
  alignment maps to logical `text-start` / `text-center` / `text-end`, and the CSS grid
  follows the writing direction, so the tree column sits at the inline-start edge in bidi
  layouts.
