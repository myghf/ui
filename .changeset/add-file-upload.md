---
'@myghf/ui': minor
---

Add the `FileUpload` component

A drop zone over a native `<input type="file">`: the input stays focusable and is the actual
control, so click, drag-and-drop, and keyboard all work without scripting. Selected files are
listed with name, size, a remove button, and an optional per-file `Progress` bar via a
`progressFor` callback. Supports `multiple`, `accept`, `disabled`, and the field contract
(`id`, `aria-describedby`, `aria-invalid`, `required`) through the shared `useFieldControl`
composable. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
