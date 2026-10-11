---
'@myghf/ui': minor
---

Add the `Combobox` component

A searchable select built on reka-ui's combobox: type to filter, pick one or several. Supports
`multiple` (selections render as removable `Tag`s), `clearable`, size variants, and an
`emptyLabel` for no-match states. The input is `role="combobox"` and wires `id`,
`aria-describedby`, `aria-invalid`, and `aria-required` through the shared `useFieldControl`
contract. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
