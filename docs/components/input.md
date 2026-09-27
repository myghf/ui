<script setup lang="ts">
import InputBasic from '../.vitepress/theme/demos/input/basic.vue'
import InputSizes from '../.vitepress/theme/demos/input/sizes.vue'
</script>

# Input

`Input` is a single-line text field. It renders a native `<input>` styled from the design
tokens, with optional leading/trailing icons, three sizes, and a visual invalid state.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@myghf/ui'

const email = ref('')
</script>

<template>
  <Input v-model="email" type="email" placeholder="you@example.com" />
</template>
```

## Examples

### Basics

Any extra attribute — `type`, `id`, `name`, `autocomplete`, `aria-*` — falls through to the
native `<input>`, so `Input` works with an external `<label for>`.

<Demo>
  <InputBasic />
</Demo>

<<< ../.vitepress/theme/demos/input/basic.vue

### Sizes

`sm`, `default`, and `lg` set the control height. `invalid` switches the border and focus
ring to `error-500`; it is a **visual** flag only (see [Accessibility](#accessibility)).

<Demo>
  <InputSizes />
</Demo>

<<< ../.vitepress/theme/demos/input/sizes.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Bound value, used as the input's `value`. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the input and blocks interaction. |
| `invalid` | `boolean` | `false` | Applies the error border and focus ring. Visual only; it does not set `aria-invalid`. |
| `leadingIcon` | `string` | — | Lucide icon name rendered before the text (decorative). |
| `trailingIcon` | `string` | — | Lucide icon name rendered after the text (decorative). |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Control height (`h-8` / `h-9` / `h-10`). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted on every `input` event with the current string value. |

## Slots

`Input` renders no slots. Use `leadingIcon` / `trailingIcon` for adornments.

## Exposed methods

| Method | Description |
| --- | --- |
| `focus()` | Focuses the underlying `<input>`. |

## Accessibility

- The control is a real `<input>`, so it participates in native form submission and label
  association. Pair it with a visible `<label for="…">` and give the input a matching `id`.
- Every extra attribute falls through, so `aria-label`, `aria-describedby`, and
  `aria-invalid` can be set directly:
  ```vue
  <Input v-model="email" :invalid="!!error" :aria-invalid="!!error" aria-describedby="email-error" />
  ```
- `invalid` only changes colour. It does **not** set `aria-invalid` or announce the error —
  set `aria-invalid` yourself and describe the failure with `aria-describedby`.
- The leading and trailing icons are rendered by `Icon`, which is always `aria-hidden`, so
  they never contribute to the accessible name.

## Dark mode & RTL

- The field styles from semantic tokens (`bg-surface`, `text-foreground`, `border-border`,
  `placeholder:text-muted`), so it adapts to dark mode automatically. The focus ring uses
  `primary-500`; the invalid state uses `error-500` in both themes.
- Icons are positioned with logical utilities (`start-3` / `end-3`) and text padding uses
  `ps-*` / `pe-*`, so the adornments flip to the correct edge under RTL. In an RTL form set
  `dir="rtl"` on an ancestor and the input text aligns to the start automatically.
