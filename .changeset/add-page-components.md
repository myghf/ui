---
'@myghf/ui': minor
---

Add page chrome: `Breadcrumbs`, `PageHeader`, `PageContent`

- `Breadcrumbs`: a labelled `nav` trail with `aria-current` on the last item, an `aria-hidden`
  RTL-aware separator, and an `item` slot for router links. Exports the `BreadcrumbItem` type.
- `PageHeader`: an `<h1>` title with optional description, plus `breadcrumbs` and `actions`
  slots.
- `PageContent`: the padded, width-capped page body (wraps `Container`).

Exported from `@myghf/ui` and auto-imported by the Nuxt module.
