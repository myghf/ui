---
'@myghf/ui': minor
---

Add dashboard primitives: StatCard, StatusBadge, Timeline, Stepper

- `StatCard`: a metric card with a label, headline value, optional hint, and a signed `trend`
  (announced to screen readers as "up/down N percent").
- `StatusBadge`: a toned pill with a decorative dot and an optional `pulse`.
- `Timeline` + `TimelineItem`: a labelled activity list with `<time>` stamps.
- `Stepper`: a step indicator that marks the current step with `aria-current="step"` and shows a
  check for completed steps, plus a `Step` type.

All are exported from `@myghf/ui` and auto-imported by the Nuxt module.
