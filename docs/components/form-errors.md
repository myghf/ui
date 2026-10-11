<script setup lang="ts">
import FormErrorsBasic from '../.vitepress/theme/demos/form-errors/basic.vue'
</script>

# FormErrors

`FormErrors` renders a form-level validation summary: a `role="alert"` box listing each error,
where every entry is a button that focuses the field it refers to. It is the complement to the
per-field messages from [`FormField`](/components/form-field) — use it on submit so a user
sees everything that is wrong in one place, and can jump straight to each field.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { FormErrors, FormField, Input } from '@myghf/ui'

const email = ref('')

const errors = computed(() =>
  email.value ? [] : [{ id: 'email', label: 'Email', message: 'Enter an email address' }],
)
</script>

<template>
  <FormErrors :errors="errors" />

  <FormField id="email" label="Email" :error="email ? undefined : 'Enter an email address'">
    <Input v-model="email" type="email" />
  </FormField>
</template>
```

The `id` of each entry must match the control's `id` — pass the same value to `FormField` and
to the entry, as above.

<Demo>
  <FormErrorsBasic />
</Demo>

<<< ../.vitepress/theme/demos/form-errors/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` | `FormError[]` | `[]` | The errors to summarize. Nothing renders while the list is empty. |
| `title` | `string` | `'Please fix the following:'` | Heading shown above the list. |
| `focusFirst` | `boolean` | `false` | Focus and scroll to the first linked control when the summary mounts. |

### FormError

```ts
interface FormError {
  id: string      // id of the control to focus
  message: string // the error message
  label?: string  // optional field label, rendered as a prefix
}
```

## Slots

`FormErrors` renders no slots.

## Exposed methods

None. `FormErrors` does not call `defineExpose`.

## Accessibility

- The summary is `role="alert"`, so it is announced as soon as it appears (typically on
  submit) without moving focus on its own.
- Each entry is a real `<button>` naming its field and message; activating it moves focus to
  the linked control, so keyboard and screen-reader users can step through the errors.
- Pair it with `focusFirst` to move focus to the first invalid field on submit; the summary
  itself is then reachable by normal navigation.

## Dark mode & RTL

- The box uses the `danger` tone (`bg-error-100`/`text-error-800` in light mode, the
  `error-900/40` tint with `error-200` text in dark mode), so it adapts automatically.
- The list is indented with logical `ps-6` and entries use `text-start`, so it mirrors under
  `dir="rtl"`.
