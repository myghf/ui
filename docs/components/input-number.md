<script setup lang="ts">
import InputNumberBasic from '../.vitepress/theme/demos/input-number/basic.vue'
import InputNumberFormatted from '../.vitepress/theme/demos/input-number/formatted.vue'
</script>

# InputNumber

`InputNumber` is a numeric field built on reka-ui's number field. It emits a `number | null`
model, supports `min` / `max` / `step` / `integer`, and formats its value with `Intl.NumberFormat`
(including currency and percent styles). Optional stepper buttons provide pointer-driven
increments.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from '@myghf/ui'

const quantity = ref<number | null>(1)
</script>

<template>
  <InputNumber v-model="quantity" :min="0" :max="10" show-buttons />
</template>
```

## Examples

### Bounds and stepper buttons

`modelValue` is `number | null`. Clearing the field (or entering a non-numeric value)
emits `null` rather than `NaN`. `showButtons` adds keyboard-accessible increment and
decrement controls.

<Demo>
  <InputNumberBasic />
</Demo>

<<< ../.vitepress/theme/demos/input-number/basic.vue

### Formatting

`currency` is shorthand for a currency `Intl.NumberFormatOptions`; `formatOptions` supplies
the full options object (here a percent style); `locale` selects the format locale.
`stepSnapping` rounds typed values to the nearest `step`.

<Demo>
  <InputNumberFormatted />
</Demo>

<<< ../.vitepress/theme/demos/input-number/formatted.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | — | Bound numeric value; `null` when empty. |
| `min` | `number` | — | Minimum allowed value. |
| `max` | `number` | — | Maximum allowed value. |
| `step` | `number` | `1` | Increment/decrement size. A non-positive or non-finite value is normalised to `1` before it reaches the field. |
| `stepSnapping` | `boolean` | `false` | Rounds typed values to the nearest multiple of `step`. |
| `integer` | `boolean` | `false` | Forces zero fraction digits (`maximumFractionDigits: 0`). |
| `locale` | `string` | — | BCP-47 locale for `Intl.NumberFormat`, and for the `aria-valuetext` readout. |
| `formatOptions` | `Intl.NumberFormatOptions` | — | Full formatting options; later sources win over `currency` and `integer`. |
| `currency` | `string` | — | Currency code (for example `'USD'`); applies `{ style: 'currency' }`. |
| `prefix` | `string` | — | Decorative text rendered before the number (for example `'$'`). |
| `suffix` | `string` | — | Decorative text rendered after the number (for example `'kg'`). |
| `showButtons` | `boolean` | `false` | Renders increment/decrement stepper buttons. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the control. |
| `readonly` | `boolean` | `false` | Makes the value read-only while still focusable. |
| `invalid` | `boolean` | `false` | Applies the error styling and sets `aria-invalid="true"` on the input. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Control height. |
| `id` | `string` | — | Applied to the underlying input, so an external `<label for>` matches. |
| `name` | `string` | — | Form field name for the underlying input. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | Emitted when the value changes. Empty or non-finite input collapses to `null`. |

## Slots

`InputNumber` renders no slots. Use `prefix` / `suffix` for fixed adornments.

## Exposed methods

None. `InputNumber` does not call `defineExpose`.

## Accessibility

- The underlying field is a native input with `role="spinbutton"`, so screen readers
  announce it as a numeric control with arrow-key support from reka-ui.
- `invalid` sets `aria-invalid="true"` on the input automatically.
- When a value is present, the input exposes a locale-formatted `aria-valuetext` (for
  example `1,234.5`), so `Intl` formatting is announced rather than the raw string. It is
  omitted when the field is empty.
- `prefix` and `suffix` are plain sibling text, not part of the input. A screen reader may
  read them as loose text without associating them with the value. For a real unit, prefer
  `currency` / `formatOptions` (which feed `aria-valuetext`) or include the unit in the
  field's `<label>`.
- The stepper buttons rendered by `showButtons` come from reka-ui and are keyboard
  reachable; they are disabled automatically at `min` / `max`.

## Dark mode & RTL

- The wrapper uses semantic tokens (`bg-surface`, `text-foreground`, `border-border`) and the
  invalid state uses `error-500`, so both themes are covered without `dark:` overrides.
- `prefix` and `suffix` sit in a flex row and the stepper column uses logical margin (`ms-1`),
  so the layout mirrors under RTL. The prefix/suffix text is direction-neutral; numbers
  themselves are rendered left-to-right by `Intl` regardless of direction.
