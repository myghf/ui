---
'@myghf/ui': minor
---

Add the `Switch` component

A boolean on/off toggle built on reka-ui with `sm`/`default` sizes, `disabled`, and
`invalid`/`required` props. It wires `id`, `aria-describedby`, `aria-invalid`, and
`aria-required` through the shared `useFieldControl` contract, animates its thumb with logical
translation for RTL, and is exported from `@myghf/ui` (and auto-imported by the Nuxt module).
Also corrects the stale `Checkbox` docs now that it consumes the form-field context.
