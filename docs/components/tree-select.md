<script setup lang="ts">
import TreeSelectBasic from '../.vitepress/theme/demos/tree-select/basic.vue'
</script>

# TreeSelect

`TreeSelect` is a dropdown for picking from a tree. The model is the flat list of selected
**leaf** keys (by default), and parent nodes render a derived checked/indeterminate state.
It shows the selection as `Tag`s in the trigger and supports filtering.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TreeSelect, type TreeNode } from '@myghf/ui'

const selected = ref<string[]>([])
const nodes: TreeNode[] = [
  {
    value: 'cardiology',
    label: 'Cardiology',
    children: [
      { value: 'echo', label: 'Echocardiography' },
      { value: 'ecg', label: 'ECG' },
    ],
  },
]
</script>

<template>
  <TreeSelect v-model="selected" :nodes="nodes" />
</template>
```

## Examples

### Selecting leaf services

Selecting a parent selects all of its leaves, and a partially selected parent shows an
indeterminate marker. The emitted value is always a flat array of leaf keys; a Clear action
appears while anything is selected.

<Demo>
  <TreeSelectBasic />
</Demo>

<<< ../.vitepress/theme/demos/tree-select/basic.vue

### Node shape

Each node is a `TreeNode<T>`:

```ts
interface TreeNode<T = unknown> {
  value: string        // stable key; the value emitted by TreeSelect
  label?: string       // shown in the tree and the trigger tags
  disabled?: boolean   // present in the type, but not currently enforced
  children?: TreeNode<T>[]
  data?: T
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | Selected leaf keys. |
| `nodes` | `TreeNode<T>[]` | — (required) | The tree. |
| `placeholder` | `string` | `'Select'` | Trigger text when nothing is selected. |
| `filterable` | `boolean` | `true` | Shows a search input above the tree. |
| `filterPlaceholder` | `string` | `'Search'` | Placeholder for the search input. |
| `disabled` | `boolean` | `false` | Disables the trigger and the popup. |
| `leafOnly` | `boolean` | `true` | Emits only leaf keys, so parent groups are not selectable values. Set `false` to emit parent keys too. |
| `size` | `'sm' \| 'default'` | `'default'` | Trigger height. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | Emitted with the flat list of selected keys. Clear emits `[]`. |

## Slots

`TreeSelect` renders no slots. Node content is limited to `label` / `value`.

## Exposed methods

None. `TreeSelect` does not call `defineExpose`.

## Accessibility

- The trigger is a `<button>`; the popup is a reka-ui `Tree` (`role="tree"` / `treeitem`) in
  multiple, bubble-select mode, so keyboard navigation and selection follow the tree pattern.
  The search input is a native `<input>`.
- The checkbox squares are `aria-hidden` spans; selection state comes from the tree item, so
  assistive technology is not double-announcing. Give the trigger a name through its visible
  placeholder/tags, or add `aria-label` in your layout.
- `TreeNode.disabled` is part of the type but is **not** passed to the tree items, so marked
  nodes remain selectable. Treat it as reserved.
- There is no `invalid` prop and no `aria-invalid` wiring.

## Dark mode & RTL

- The trigger, popup, search field, and tags use semantic tokens (`bg-surface`,
  `text-foreground`, `border-border`, `surface-muted`), so both themes adapt automatically.
  Selected-node rows use `bg-primary-500` with white marks.
- Indentation uses `paddingInlineStart`, so nesting mirrors under RTL, and the search icon is
  positioned with `start-2` while the input reserves space with `ps-7`. No physical
  directional utilities are used.
