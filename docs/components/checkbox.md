<script setup lang="ts">
import CheckboxBasic from '../.vitepress/theme/demos/checkbox/basic.vue'
</script>

# Checkbox

`Checkbox` is a boolean control built on reka-ui. It renders a real `<button role="checkbox">`
with an `aria-checked` state and a token-based check indicator.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@myghf/ui'

const accepted = ref(false)
</script>

<template>
  <label class="flex items-center gap-2">
    <Checkbox v-model="accepted" />
    Accept the terms
  </label>
</template>
```

## Examples

### With labels and disabled state

Wrap the control in a `<label>` (or point a label at its `id`) for a click target and an
accessible name. `disabled` removes it from interaction and dims it.

<Demo>
  <CheckboxBasic />
</Demo>

<<< ../.vitepress/theme/demos/checkbox/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Checked state. |
| `disabled` | `boolean` | `false` | Disables the control and blocks interaction. |
| `invalid` | `boolean` | `false` | Marks the control invalid. Falls through to the `FormField` context when omitted. |
| `required` | `boolean` | `false` | Marks the control required. Falls through to the `FormField` context when omitted. |
| `id` | `string` | — | Applied to the checkbox button so an external `<label for>` matches. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the checked state changes. |

## Slots

`Checkbox` renders no slots. The check indicator is built in.

## Exposed methods

None. `Checkbox` does not call `defineExpose`.

## Accessibility

- reka-ui renders a `<button role="checkbox">` with `aria-checked` reflecting the model, and
  wires <kbd>Space</kbd> to toggle. It is keyboard reachable by default.
- There is no built-in label. Provide an accessible name either by wrapping the control in a
  `<label>` (a `<button>` is a labelable element) or by setting `aria-label` directly; extra
  attributes fall through to the root button.
  ```vue
  <Checkbox v-model="ok" aria-label="Email notifications" />
  ```
- Inside a [`FormField`](/components/form-field) it picks up `id`, `aria-describedby`,
  `aria-invalid`, and `aria-required` through the shared `useFieldControl` composable, so an
  explicit `invalid`/`required` prop always wins and the context fills the rest.
- Only the two-state model is supported; there is no indeterminate/`mixed` state. If a
  "select all" parent needs a partial state, render that explicitly.

## Dark mode & RTL

- The box styles from semantic tokens (`bg-surface`, `border-border`) and turns `primary-500`
  when checked, so it adapts to dark mode automatically. The focus ring uses
  `dark:focus-visible:ring-offset-background` so it stays visible on dark surfaces.
- The control has no directional layout: the check glyph is centred and there is no physical
  padding, so it needs no RTL override. Place it with logical flex/gap utilities in your own
  layout.
