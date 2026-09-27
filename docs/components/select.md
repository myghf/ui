<script setup lang="ts">
import SelectBasic from '../.vitepress/theme/demos/select/basic.vue'
import SelectMultiple from '../.vitepress/theme/demos/select/multiple.vue'
</script>

# Select

`Select` is a dropdown for choosing from a list. It is built on reka-ui's listbox, supports
single and `multiple` selection, options given as objects or primitives, an optional
clear control, and two sizes.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Select } from '@myghf/ui'

const department = ref<string | null>(null)
const options = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Radiology', value: 'radiology' },
]
</script>

<template>
  <Select v-model="department" :options="options" placeholder="Choose" clearable />
</template>
```

## Examples

### Single selection

`optionLabel` / `optionValue` name the object keys (both default to `label` / `value`).
`clearable` adds a clear button that emits `null` (or `[]` when `multiple`).

<Demo>
  <SelectBasic />
</Demo>

<<< ../.vitepress/theme/demos/select/basic.vue

### Multiple selection

With `multiple`, the model is an array of values and the trigger shows the selected labels
joined by commas. Clearing emits an empty array.

<Demo>
  <SelectMultiple />
</Demo>

<<< ../.vitepress/theme/demos/select/multiple.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `AcceptableValue \| AcceptableValue[]` | — | Selected value, or an array of values when `multiple`. |
| `options` | `unknown[]` | — | Choices. Objects (read via `optionLabel` / `optionValue`) or primitives. |
| `optionLabel` | `string` | `'label'` | Key whose value is shown as an option's label (objects only). |
| `optionValue` | `string` | `'value'` | Key whose value is emitted as an option's value (objects only). |
| `placeholder` | `string` | `''` | Text shown when nothing is selected. |
| `clearable` | `boolean` | `false` | Shows a clear button while a value is selected. |
| `disabled` | `boolean` | `false` | Disables the trigger and the popup. |
| `multiple` | `boolean` | `false` | Allows multiple selections; the model becomes an array. |
| `size` | `'sm' \| 'default'` | `'default'` | Trigger height. |
| `invalid` | `boolean` | `false` | Applies the error border and focus ring. Visual only; it does not set `aria-invalid`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown` | Emitted when the selection changes: a single value, an array when `multiple`, `null`/`[]` when cleared. |

## Slots

`Select` renders no slots. Options are data-only (`options` + `optionLabel` / `optionValue`);
there is no per-option slot for custom content.

## Exposed methods

None. `Select` does not call `defineExpose`.

## Accessibility

- The trigger and popup come from reka-ui's listbox: the trigger exposes combobox semantics,
  the popup is a listbox, and typeahead, arrow-key navigation, <kbd>Enter</kbd>, and
  <kbd>Esc</kbd> are handled.
- Extra attributes (`aria-label`, `aria-labelledby`, `id`, `class`) fall through to the
  trigger button. Give it a name with `aria-label` or `aria-labelledby`, since it renders no
  visible `<label>` of its own:
  ```vue
  <Select v-model="department" :options="options" aria-label="Department" />
  ```
- The built-in clear control is a `<button>` with `aria-label="Clear selection"`; it is
  focusable and does not close the popup.
- `invalid` only changes colour. It does **not** set `aria-invalid` — add it via a
  fall-through attribute when the field is in an error state.
- **Visual content is limited to option labels.** Because there is no option slot, richer
  rows (icons, descriptions, grouping) are not supported.

## Dark mode & RTL

- The trigger and popup use semantic tokens (`bg-surface`, `text-foreground`, `border-border`,
  `shadow-popover`); the selected check uses `primary-600` and highlighted rows use
  `surface-muted`, so both themes are covered.
- Layout is logical: the value truncates, the trailing controls use `ms-auto`, the check
  indicator uses `end-2`, and option text reserves space with `pe-8`. Under RTL the chevron
  and clear button move to the start edge and the popup content mirrors automatically.
