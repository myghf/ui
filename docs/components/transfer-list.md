<script setup lang="ts">
import TransferListBasic from '../.vitepress/theme/demos/transfer-list/basic.vue'
</script>

# TransferList

`TransferList` moves items between an available ("source") list and a selected ("target")
list. Each side supports multi-select with checkboxes, with buttons to move the selection or
all items in either direction.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TransferList } from '@myghf/ui'

const selected = ref<string[]>([])
const options = [
  { value: 'echo', label: 'Echocardiography' },
  { value: 'ecg', label: 'ECG' },
]
</script>

<template>
  <TransferList v-model="selected" :options="options" />
</template>
```

## Examples

### Moving items

Tick items on one side, then use the arrow buttons to move them across. The faded
double-chevrons move everything. `modelValue` is always the list of values on the target
side.

<Demo>
  <TransferListBasic />
</Demo>

<<< ../.vitepress/theme/demos/transfer-list/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ value: string; label: string }[]` | — (required) | All items, split by selection state. |
| `modelValue` | `string[]` | `[]` | Values on the target side. Read **once**, at setup (see below). |
| `sourceLabel` | `string` | `'Available'` | Header text of the left (source) panel. |
| `targetLabel` | `string` | `'Selected'` | Header text of the right (target) panel. |
| `disabled` | `boolean` | `false` | Disables both panels and all move buttons. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | Emitted after every move with the current target-side values. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `source-header` | — | Replaces the source panel's header text. |
| `target-header` | — | Replaces the target panel's header text. |
| `item` | `{ option }` | Renders each item's content in both panels. Defaults to the option's `label`. |

## Exposed methods

None. `TransferList` does not call `defineExpose`.

## Accessibility

- Move controls are real `<button>`s with explicit `aria-label`s ("Move selected to target",
  "Move selected to source", "Move all to target", "Move all to source"). The two
  move-selected buttons are disabled when their selection is empty; the move-all buttons are
  gated only by the `disabled` prop.
- Each list item is a `<button>` containing a `Checkbox` (itself a `<button>`). **Nested
  buttons are invalid HTML** and can confuse assistive technology; this is a known gap. The
  inner checkbox stops click propagation so the item button does not double-toggle.
- The panels are plain `<div>`s with a heading row and a `<ul>`/`<li>` list. They have no
  `aria-label`, so the two lists are not individually named; add context in your layout.
- Empty sides render a list item reading "Empty".

## Dark mode & RTL

- Panels, borders, headers, and the empty state use semantic tokens (`bg-surface`,
  `border-border`, `text-muted`), so both themes adapt automatically. Move buttons use the
  `Button` outline/ghost variants.
- The panels stack vertically on narrow screens (`flex-col sm:flex-row`). The move-button
  column and list layout use logical flex ordering, but the chevron glyphs are physical
  (right = to target, left = to source); under RTL the panels swap visual sides while the
  glyphs do not, which is a minor known gap.
