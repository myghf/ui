<script setup lang="ts">
import FormFieldBasic from '../.vitepress/theme/demos/form-field/basic.vue'
import FormFieldSlots from '../.vitepress/theme/demos/form-field/slots.vue'
</script>

# Form field

`FormField` groups a label, a control, and its description and error text, and shares
that wiring with its children through a Vue injection context. `Label` reads the
context automatically, so it gets the right `for` without you repeating an id. The
`Input`, `Textarea`, and `Select` components consume the same context to pick up
`id`, `aria-describedby`, `aria-invalid`, and `required`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormField, Input } from '@myghf/ui'

const email = ref('')
</script>

<template>
  <FormField label="Email" description="We never share your address." required>
    <Input v-model="email" type="email" placeholder="you@example.com" />
  </FormField>
</template>
```

Every piece is optional: render a label, a control, a description, an error, or any
combination. A field with no label renders no `<label>`; a field with no description or
error renders no helper text.

## Examples

### Label, description, and error

Pass `label`, `description`, and `error` as props. `Label` receives the generated id
for `for`; the description and error render below the control with ids matching
`aria-describedby`. Setting `error` also marks the context invalid unless you override
it with `invalid`.

<Demo>
  <FormFieldBasic />
</Demo>

<<< ../.vitepress/theme/demos/form-field/basic.vue

### Slots and standalone use

Each piece also has a slot (`label`, `description`, `error`), so you can render rich
content instead of plain text. `Label` works on its own too — pass `for` directly or
let a surrounding `FormField` supply it.

<Demo>
  <FormFieldSlots />
</Demo>

<<< ../.vitepress/theme/demos/form-field/slots.vue

## FormField props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label text. Can also be supplied through the `label` slot. |
| `description` | `string` | — | Helper text rendered below the control. Can also be supplied through the `description` slot. |
| `error` | `string` | — | Error text rendered as an alert below the control. Can also be supplied through the `error` slot. |
| `required` | `boolean` | `false` | Marks the field required; adds the label's `aria-hidden` marker and sets the context flag. |
| `invalid` | `boolean` | `Boolean(error)` | Overrides the invalid state provided to controls. |
| `id` | `string` | generated | Base control id. When omitted, a stable id is generated with Vue's `useId()`. |

## FormField slots

| Slot | Description |
| --- | --- |
| `default` | The control (and any other content) for the field. |
| `label` | Replaces the `label` text with custom content. |
| `description` | Replaces the `description` text with custom content. |
| `error` | Replaces the `error` text with custom content. The field is invalid whenever this slot has content. |

## Label props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `for` | `string` | field context id | The id of the control the label belongs to. An explicit `for` wins over the context. |
| `required` | `boolean` | `false` | Renders an `aria-hidden` `*` marker after the label text. |

The default slot holds the label text (or markup).

## FormDescription

`FormDescription` renders `<p class="text-sm text-muted">`. It renders nothing when its
default slot has no content, and accepts an `id` (a `FormField` passes
`` `${id}-description` ``). Use it standalone if you are not using `FormField`.

## FormMessage

`FormMessage` renders `<p role="alert" class="text-sm text-error-600">`. It renders
nothing when its default slot has no content, and accepts an `id` (a `FormField` passes
`` `${id}-error` ``). The `role="alert"` makes the message announce when it appears.

## useFormField

`useFormField()` returns the nearest `FormField` context, or `null` when there is no
provider — it never throws. This is what lets `Label` (and the form controls) fall back
to today's behaviour outside a `FormField`.

```ts
import { useFormField } from '@myghf/ui'

const field = useFormField()
if (field) {
  field.id.value            // the control id
  field.describedBy.value   // "id-description id-error", or undefined
  field.invalid.value       // boolean
  field.required.value      // boolean
}
```

`FormFieldContext` is exported as a type:

```ts
interface FormFieldContext {
  id: ComputedRef<string>
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
}
```

Because the context is built from computed refs, it stays reactive when the
`FormField` props change after mount.

## Accessibility

- `Label` is a real `<label>`; its `for` points at the control id from the field
  context (or the explicit `for` prop), so clicking the label focuses the control.
- `FormField` computes `describedBy` as the space-joined ids of the description and
  error only when that content exists, so controls never point `aria-describedby` at
  a missing element.
- `FormMessage` uses `role="alert"`, so an error that appears after submission is
  announced without moving focus.
- The required marker is `aria-hidden="true"` — assistive technology hears the
  control's own `required` state, not a stray asterisk.

## Dark mode & RTL

- The label, description, and error use semantic tokens (`text-foreground`,
  `text-muted`, `text-error-600`), which adapt to dark mode automatically.
- The layout is direction-safe: the wrapper is a `grid` column, the label uses
  `text-start`, and no fixed left/right offsets are used.
