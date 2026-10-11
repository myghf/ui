<script setup lang="ts">
import ComboboxBasic from '../.vitepress/theme/demos/combobox/basic.vue'
</script>

# Combobox

`Combobox` is a searchable select built on reka-ui. Type to filter the options, then pick one
(or several); the input carries `role="combobox"` and the standard `aria-expanded` /
`aria-controls` / `aria-autocomplete` wiring. Reach for it when a list is too long to scan —
for short lists use [Select](/components/select), and for a tree use
[TreeSelect](/components/tree-select).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from '@myghf/ui'

const unit = ref('')
const options = [
  { label: 'Cardiology', value: 'cardio' },
  { label: 'Neurology', value: 'neuro' },
]
</script>

<template>
  <Combobox v-model="unit" :options="options" placeholder="Search units…" />
</template>
```

## Examples

### Single and multiple, with clear

Single-select shows the chosen label in the input and resets the search on select. Set
`multiple` to collect several values as removable [Tags](/components/tag); `clearable` adds a
button that clears the whole selection.

<Demo>
  <ComboboxBasic />
</Demo>

<<< ../.vitepress/theme/demos/combobox/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `AcceptableValue \| AcceptableValue[]` | — | Selected value (an array when `multiple`). |
| `options` | `unknown[]` | — | The choices. Objects by default (see `optionLabel`/`optionValue`), or primitives. |
| `optionLabel` | `string` | `'label'` | Object key to read each option's label from. |
| `optionValue` | `string` | `'value'` | Object key to read each option's value from. |
| `placeholder` | `string` | — | Placeholder for the search input. |
| `searchPlaceholder` | `string` | — | Overrides `placeholder`; wins when both are set. |
| `emptyLabel` | `string` | `'No results'` | Message shown when filtering yields nothing. |
| `multiple` | `boolean` | `false` | Collect several values, rendered as removable tags. |
| `disabled` | `boolean` | `false` | Disables the control. |
| `clearable` | `boolean` | `false` | Shows a button that clears the selection. |
| `invalid` | `boolean` | `false` | Marks the control invalid. Falls through to the `FormField` context when omitted. |
| `required` | `boolean` | `false` | Marks the control required. Falls through to the `FormField` context when omitted. |
| `size` | `'sm' \| 'default'` | `'default'` | Control size. |
| `id` | `string` | — | Applied to the search input so an external `<label for>` matches. |
| `name` | `string` | — | Submitted with the owning form as a name/value pair. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown` | Emitted with the new value (a single value, or an array when `multiple`). |

## Exposed methods

None. `Combobox` does not call `defineExpose`.

## Accessibility

- reka-ui renders the search input as `role="combobox"` with `aria-expanded`, `aria-controls`,
  and `aria-autocomplete="list"`, and gives the popup `role="listbox"` with
  `role="option"` items. <kbd>Arrow</kbd> keys move the highlight, <kbd>Enter</kbd> selects,
  and <kbd>Esc</kbd> closes.
- Provide an accessible name with a [`FormField`](/components/form-field) label (its
  `<label for>` points at the input's `id`) or an `aria-label`.
- Inside a `FormField` the input picks up `id`, `aria-describedby`, `aria-invalid`, and
  `aria-required` through the shared `useFieldControl` composable.

## Dark mode & RTL

- The anchor, popup, and items style from semantic tokens (`bg-surface`, `border-border`,
  `bg-surface-muted`), so they adapt to dark mode automatically. The focus ring uses
  `bg-surface` surfaces and the shared `focus-within` ring.
- Layout is direction-safe: the anchor is a flex row with logical `gap`, the item indicator is
  positioned with `end-2`, and the selected tags flow with logical spacing, so everything
  mirrors under `dir="rtl"`.
