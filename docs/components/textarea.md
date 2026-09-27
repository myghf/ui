<script setup lang="ts">
import TextareaBasic from '../.vitepress/theme/demos/textarea/basic.vue'
import TextareaAutoResize from '../.vitepress/theme/demos/textarea/auto-resize.vue'
</script>

# Textarea

`Textarea` is a multi-line text field. It renders a native `<textarea>` styled from the
design tokens, with a configurable row count, optional auto-growing (`autoResize` /
`maxRows`), a visual invalid state, and `FormField` wiring.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@myghf/ui'

const notes = ref('')
</script>

<template>
  <Textarea v-model="notes" :rows="4" auto-resize placeholder="Clinical notes" />
</template>
```

## Examples

### Basics

`rows` sets the initial visible height; the field grows with the browser's native resize
handle when `autoResize` is off (resize is not disabled). Any extra attribute that is not
an explicit prop falls through to the `<textarea>`.

<Demo>
  <TextareaBasic />
</Demo>

<<< ../.vitepress/theme/demos/textarea/basic.vue

### Auto-grow

Set `autoResize` to grow the field to fit its content as the user types (and when
`modelValue` changes). `rows` then acts as the starting/minimum height, and `maxRows` caps
the grown height — once the content exceeds it, the field stops growing and scrolls
internally.

<Demo>
  <TextareaAutoResize />
</Demo>

<<< ../.vitepress/theme/demos/textarea/auto-resize.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Bound value, used as the textarea's `value`. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the textarea and blocks interaction. |
| `rows` | `number` | `3` | Initial visible row count. With `autoResize`, it acts as the starting/minimum height. |
| `invalid` | `boolean` | `false` \| FormField | Applies the error border and focus ring and sets `aria-invalid`. Falls back to the enclosing `FormField`. |
| `autoResize` | `boolean` | `false` | Grows the field to fit its content on input and on `modelValue` changes; disables the native resize handle. |
| `maxRows` | `number` | — | Caps the auto-grown height at this many rows and switches to internal scrolling. Only applies with `autoResize`. |
| `id` | `string` | FormField id | Control id. Falls back to the enclosing `FormField` id; an explicit value wins. |
| `required` | `boolean` | `false` \| FormField | Marks the field required. Falls back to the enclosing `FormField`; an explicit value wins. |

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
  submission. Pair it with a visible `<label for="…">` and give the textarea a matching
  `id` (or wrap it in a [`FormField`](/components/form-field), which supplies the id).
- Form-field wiring: inside a `FormField`, the textarea picks up the context `id`,
  `aria-describedby` (the description and error ids), `aria-invalid`, and `required`.
  Explicit props, and a consumer `aria-describedby` attribute, take precedence.
- Extra attributes fall through, so `aria-label`, `aria-describedby`, and `form` can be
  set directly.
- `invalid` changes colour and sets `aria-invalid`; it does not itself render an error
  message — describe the failure with `aria-describedby` (a `FormField` error does this for
  you).
- `required` reflects to the native `required` attribute.
- `rows` (and `maxRows` with `autoResize`) only controls height; neither limits the number
  of characters.

## Dark mode & RTL

- The field styles from semantic tokens (`bg-surface`, `text-foreground`, `border-border`,
  `placeholder:text-muted`), so it adapts to dark mode automatically. The invalid state uses
  `error-500` in both themes.
- Padding is symmetric (`px-3 py-2`) and the textarea inherits the document direction, so no
  logical-property overrides are needed. Under RTL the text aligns to the start edge and the
  resize handle moves to the opposite corner per the browser.
- `autoResize` only writes an inline `height` and toggles `resize-none` / `overflow-y-auto`,
  none of which is directional, so it behaves identically in LTR and RTL.
