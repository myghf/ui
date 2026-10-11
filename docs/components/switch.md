<script setup lang="ts">
import SwitchBasic from '../.vitepress/theme/demos/switch/basic.vue'
</script>

# Switch

`Switch` is a boolean control for an immediate on/off setting, built on reka-ui. It renders
a real `<button role="switch">` with an `aria-checked` state and a token-based track and
thumb. Use it for settings that apply instantly; use a [Checkbox](/components/checkbox) for
a choice that is submitted with a form.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@myghf/ui'

const alerts = ref(true)
</script>

<template>
  <label class="flex items-center gap-2">
    Enable alerts
    <Switch v-model="alerts" />
  </label>
</template>
```

## Examples

### Sizes, labels, and disabled state

Wrap the control in a `<label>` (a `<button>` is a labelable element) for a click target and
an accessible name, or point a label at its `id`. `size="sm"` renders a smaller track, and
`disabled` removes it from interaction and dims it.

<Demo>
  <SwitchBasic />
</Demo>

<<< ../.vitepress/theme/demos/switch/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | On/off state. |
| `disabled` | `boolean` | `false` | Disables the control and blocks interaction. |
| `invalid` | `boolean` | `false` | Marks the control invalid. Falls through to the `FormField` context when omitted. |
| `required` | `boolean` | `false` | Marks the control required. Falls through to the `FormField` context when omitted. |
| `size` | `'sm' \| 'default'` | `'default'` | Track size. |
| `id` | `string` | — | Applied to the switch button so an external `<label for>` matches. |
| `name` | `string` | — | Submitted with the owning form as a name/value pair. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the on/off state changes. |

## Slots

`Switch` renders no slots. The track and thumb are built in.

## Exposed methods

None. `Switch` does not call `defineExpose`.

## Accessibility

- reka-ui renders a `<button role="switch">` with `aria-checked` reflecting the model, and
  wires <kbd>Space</kbd>/<kbd>Enter</kbd> to toggle. It is keyboard reachable by default.
- Provide an accessible name by wrapping the control in a `<label>`, by pointing a
  `<label for>` at its `id`, or with `aria-label`; extra attributes fall through to the root
  button.
- Inside a [`FormField`](/components/form-field) it picks up `id`, `aria-describedby`,
  `aria-invalid`, and `aria-required` through the shared `useFieldControl` composable, so an
  explicit prop always wins and the context fills the rest.

## Dark mode & RTL

- The track styles from semantic tokens (`bg-surface-muted` off, `bg-primary-500` on) and the
  thumb is `bg-surface`, so it adapts to dark mode automatically. The focus ring uses
  `dark:focus-visible:ring-offset-background` so it stays visible on dark surfaces.
- The thumb animates with logical translation: `data-[state=checked]:translate-x-*` in LTR
  and `rtl:data-[state=checked]:-translate-x-*` in RTL, so the knob moves toward the trailing
  edge in both directions.
