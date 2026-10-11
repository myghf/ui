---
'@myghf/ui': minor
---

Add chart components: `Sparkline` and `BarChart`

- `Sparkline` draws a compact line or area trend; `BarChart` draws categorical bars and exposes
  the same values through a visually-hidden table. Both are accessible by default (`Sparkline` is
  `role="img"` with a `label`, or decorative without one).
- Built on the new external dependencies `d3-scale` and `d3-shape` (externalised in the build, so
  a bundler only includes them for the pages that import a chart). Exported from `@myghf/ui` and
  auto-imported by the Nuxt module.
