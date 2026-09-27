<script setup lang="ts">
import TextareaBasic from '../.vitepress/theme/demos/textarea/basic.vue'
</script>

# Textarea

`Textarea` is a multi-line text field. It renders a native `<textarea>` styled from the
design tokens, with a configurable row count and a visual invalid state.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@myghf/ui'

const notes = ref('')
</script>

<template>
  <Textarea v-model="notes" :rows="4" placeholder="Clinical notes" />
</template>
```

## Examples

### Basics

`rows` sets the initial visible height; the field grows with the browser's native resize
handle (resize is not disabled). Any extra attribute falls through to the `<textarea>`.

<Demo>
  <TextareaBasic />
</Demo>

<<< ../.vitepress/theme/demos/textarea/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Bound value, used as the textarea's `value`. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the textarea and blocks interaction. |
| `rows` | `number` | `3` | Initial visible row count. |
| `invalid` | `boolean` | `false` | Applies the error border and focus ring. Visual only; it does not set `aria-invalid`. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted on every `input` event with the current string value. |

## Slots

`Textarea` renders no slots.

## Exposed methods

None. `Textarea` does not call `defineExpose`. To focus it, use a template ref on the
component and query the underlying `<textarea>`, or set `autofocus`.

## Accessibility

- The control is a real `<textarea>`, so it supports native label association and form
  submission. Pair it with a visible `<label for="…">` and give the textarea a matching `id`.
- Extra attributes fall through, so `aria-label`, `aria-describedby`, `aria-invalid`, and
  `required` can be set directly.
- `invalid` only changes colour. It does **not** set `aria-invalid` or announce the error —
  set `aria-invalid` yourself and describe the failure with `aria-describedby`.
- `rows` only sets the initial height; it does not limit the number of characters.

## Dark mode & RTL

- The field styles from semantic tokens (`bg-surface`, `text-foreground`, `border-border`,
  `placeholder:text-muted`), so it adapts to dark mode automatically. The invalid state uses
  `error-500` in both themes.
- Padding is symmetric (`px-3 py-2`) and the textarea inherits the document direction, so no
  logical-property overrides are needed. Under RTL the text aligns to the start edge and the
  resize handle moves to the opposite corner per the browser.
