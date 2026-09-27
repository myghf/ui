<script setup lang="ts">
import InputBasic from '../.vitepress/theme/demos/input/basic.vue'
import InputSizes from '../.vitepress/theme/demos/input/sizes.vue'
import InputFormField from '../.vitepress/theme/demos/input/form-field.vue'
</script>

# Input

`Input` is a single-line text field. It renders a native `<input>` styled from the design
tokens, with optional leading/trailing icons, three sizes, a visual invalid state, and
native form attributes (`type`, `id`, `name`, `autocomplete`, `required`).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@myghf/ui'

const email = ref('')
</script>

<template>
  <Input
    v-model="email"
    type="email"
    name="email"
    autocomplete="email"
    required
    placeholder="you@example.com"
  />
</template>
```

## Examples

### Basics

`type`, `id`, `name`, `autocomplete`, and `required` are first-class props. Any other
attribute — `aria-*`, `form`, `minlength` — falls through to the native `<input>`, so
`Input` also works with an external `<label for>`.

<Demo>
  <InputBasic />
</Demo>

<<< ../.vitepress/theme/demos/input/basic.vue

### Sizes

`sm`, `default`, and `lg` set the control height. `invalid` switches the border and focus
ring to `error-500` and sets `aria-invalid`; it is a **visual + ARIA** flag (see
[Accessibility](#accessibility)).

<Demo>
  <InputSizes />
</Demo>

<<< ../.vitepress/theme/demos/input/sizes.vue

### Inside a FormField

Wrap the input in `FormField` and it inherits the field `id`, the `aria-describedby` ids
for the description and error, `aria-invalid`, and `required` — no manual wiring. Explicit
props (and a consumer `aria-describedby` attribute) still win over the context, so you can
opt out per field.

<Demo>
  <InputFormField />
</Demo>

<<< ../.vitepress/theme/demos/input/form-field.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Bound value, used as the input's `value`. |
| `placeholder` | `string` | — | Placeholder text shown while empty. |
| `disabled` | `boolean` | `false` | Disables the input and blocks interaction. |
| `invalid` | `boolean` | `false` \| FormField | Applies the error border and focus ring and sets `aria-invalid`. Falls back to the enclosing `FormField`. |
| `leadingIcon` | `string` | — | Lucide icon name rendered before the text (decorative). |
| `trailingIcon` | `string` | — | Lucide icon name rendered after the text (decorative). |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Control height (`h-8` / `h-9` / `h-10`). |
| `type` | `string` | `'text'` | Native input type (`email`, `password`, `search`, …). |
| `id` | `string` | FormField id | Control id. Falls back to the enclosing `FormField` id; an explicit value wins. |
| `name` | `string` | — | Native `name`, submitted with the form. |
| `autocomplete` | `string` | — | Native `autocomplete` hint (for example `email`, `current-password`). |
| `required` | `boolean` | `false` \| FormField | Marks the field required. Falls back to the enclosing `FormField`; an explicit value wins. |

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
  association. Pair it with a visible `<label for="…">` and give the input a matching `id`
  (or wrap it in a [`FormField`](/components/form-field), which supplies the id).
- Every extra attribute falls through, so `aria-label`, `aria-describedby`, and
  `aria-invalid` can be set directly:
  ```vue
  <Input v-model="email" :invalid="!!error" aria-describedby="email-error" />
  ```
- `invalid` both changes colour and sets `aria-invalid`, so the field is announced as
  invalid. When the field is inside a `FormField`, `invalid` defaults to the field's state;
  pass `:invalid="false"` to override it.
- `required` reflects to the native `required` attribute. Inside a `FormField` it defaults
  to the field's `required` flag; an explicit prop wins.
- Form-field wiring: inside a `FormField`, the input picks up the context `id`,
  `aria-describedby` (the description and error ids), `aria-invalid`, and `required`.
  Explicit props, and a consumer `aria-describedby` attribute, take precedence — so a
  custom `aria-describedby` is not overwritten.
- The leading and trailing icons are rendered by `Icon`, which is always `aria-hidden`, so
  they never contribute to the accessible name.

## Dark mode & RTL

- The field styles from semantic tokens (`bg-surface`, `text-foreground`, `border-border`,
  `placeholder:text-muted`), so it adapts to dark mode automatically. The focus ring uses
  `primary-500`; the invalid state uses `error-500` in both themes.
- Icons are positioned with logical utilities (`start-3` / `end-3`) and text padding uses
  `ps-*` / `pe-*`, so the adornments flip to the correct edge under RTL. In an RTL form set
  `dir="rtl"` on an ancestor and the input text aligns to the start automatically.
