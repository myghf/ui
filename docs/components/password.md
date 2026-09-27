<script setup lang="ts">
import PasswordBasic from '../.vitepress/theme/demos/password/basic.vue'
</script>

# Password

`Password` is a password field with a show/hide toggle. With `feedback` enabled it also
renders a four-segment strength meter derived from the current value.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Password } from '@myghf/ui'

const password = ref('')
</script>

<template>
  <Password v-model="password" feedback placeholder="Enter a password" />
</template>
```

## Examples

### Visibility toggle and strength feedback

The toggle button flips the input between `password` and `text`. The strength meter scores
length and character variety into four segments; it is purely visual (`aria-hidden`).

<Demo>
  <PasswordBasic />
</Demo>

<<< ../.vitepress/theme/demos/password/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | — | Bound password value. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the input and the visibility toggle. |
| `invalid` | `boolean` | `false` | Applies the error border and focus ring. Visual only; it does not set `aria-invalid`. |
| `feedback` | `boolean` | `false` | Shows the four-segment strength meter when a value is present. |
| `id` | `string` | — | Applied to the inner `<input>` so an external `<label for>` still matches. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted on every `input` event with the current string value. |

## Slots

`Password` renders no slots.

## Exposed methods

None. `Password` does not call `defineExpose`.

## Accessibility

- The input is a native `<input>`; associate a visible `<label for="…">` using the `id` prop.
- The visibility toggle is a `<button type="button">` with a fixed `aria-label` of
  `"Toggle password visibility"`. Its state is not exposed (there is no `aria-pressed`), so
  screen-reader users hear the same name before and after toggling. This is a known gap;
  provide surrounding instructions if the state must be announced.
- The strength meter is decorative: the wrapper is `aria-hidden="true"` and the segments
  carry no text. It conveys meaning by colour and length only, so it is not available to
  screen readers. Announce strength through a live region of your own if it matters.
- `invalid` only changes colour. It does **not** set `aria-invalid`.

## Dark mode & RTL

- The field uses semantic tokens (`bg-surface`, `text-foreground`, `border-border`); the
  meter's filled segments use `success-500` and its track uses `bg-surface-muted`. Both read
  correctly on light and dark surfaces.
- The toggle is positioned with `end-2` and the input reserves space with `pe-10`, so the
  button sits at the correct logical edge under RTL. The eye icons are direction-neutral.
