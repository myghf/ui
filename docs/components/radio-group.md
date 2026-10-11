<script setup lang="ts">
import RadioGroupBasic from '../.vitepress/theme/demos/radio-group/basic.vue'
</script>

# RadioGroup

`RadioGroup` is a single-choice control for a small, always-visible set of options, built on
reka-ui. It renders a `role="radiogroup"` with a `role="radio"` item per option, each named by
its own `<label for>`, and arrow-key navigation between options. Use it when every choice
should be visible at once; for a compact dropdown use [Select](/components/select), and for a
segmented look use [SelectButton](/components/select-button).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup } from '@myghf/ui'

const priority = ref('normal')

const options = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
]
</script>

<template>
  <RadioGroup v-model="priority" :options="options" />
</template>
```

## Examples

### Vertical and horizontal, with disabled options

Options stack vertically by default; set `orientation="horizontal"` to lay them in a row. An
individual option can carry `disabled: true`.

<Demo>
  <RadioGroupBasic />
</Demo>

<<< ../.vitepress/theme/demos/radio-group/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `AcceptableValue` | — | Selected option value. |
| `options` | `unknown[]` | — | The choices. Objects by default (see `optionLabel`/`optionValue`), or primitives. |
| `optionLabel` | `string` | `'label'` | Object key to read each option's label from. |
| `optionValue` | `string` | `'value'` | Object key to read each option's value from. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout, and the arrow-key axis. |
| `disabled` | `boolean` | `false` | Disables every option. |
| `invalid` | `boolean` | `false` | Marks the group invalid. Falls through to the `FormField` context when omitted. |
| `required` | `boolean` | `false` | Marks the group required. Falls through to the `FormField` context when omitted. |
| `id` | `string` | — | Applied to the group so an external label association matches. |
| `name` | `string` | — | Submitted with the owning form as a name/value pair. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown` | Emitted with the newly selected value. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `option` | `{ option, label }` | Replaces an option's label text with custom content. |

## Exposed methods

None. `RadioGroup` does not call `defineExpose`.

## Accessibility

- reka-ui renders `role="radiogroup"` with a `role="radio"` per option, an `aria-checked`
  state, and <kbd>Arrow</kbd> key navigation (moving the selection). It is keyboard reachable
  by default.
- Each option's `<label for>` points at its radio's generated id, so every radio has an
  accessible name without extra wiring.
- Inside a [`FormField`](/components/form-field) the group picks up `id`, `aria-describedby`,
  `aria-invalid`, and `aria-required` through the shared `useFieldControl` composable, so an
  explicit prop always wins and the context fills the rest.

## Dark mode & RTL

- The item border and dot style from semantic tokens (`border-border`, `bg-primary-500`), so
  they adapt to dark mode automatically. The focus ring uses
  `dark:focus-visible:ring-offset-background` so it stays visible on dark surfaces.
- The layout is direction-safe: a flex row/column with logical `gap`, no physical padding or
  offsets, so options and their labels mirror correctly under `dir="rtl"`.
