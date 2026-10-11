---
'@myghf/ui': minor
---

Add the `RadioGroup` component

A single-choice control for a small, always-visible set of options, built on reka-ui's
radio group. Options render a labelled `role="radio"` each (named via `<label for>`), with
`vertical`/`horizontal` orientations, per-option `disabled`, and an optional `option` slot for
custom label content. It wires `id`, `aria-describedby`, `aria-invalid`, and `aria-required`
through the shared `useFieldControl` contract, and is exported from `@myghf/ui` (and
auto-imported by the Nuxt module).
