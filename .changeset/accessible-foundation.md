---
'@myghf/ui': patch
---

Add automated accessibility and contrast guards, and fix form-field wiring

- New axe-core accessibility catalog (`src/a11y.spec.ts`) that mounts every public component and
  fails on missing names, unlabelled controls, nested interactive elements, and broken ARIA.
- New token contrast guard (`src/lib/contrast.spec.ts`) asserting WCAG AA for body text and brand
  tints, and pinning the documented brand exceptions so they cannot regress.
- `Password` now consumes the `FormField` context, wiring `id`, `required`, `aria-invalid`, and
  `aria-describedby` (the input previously had no associated label inside a `FormField`).
- `TablePagination`'s page-size `<select>` now has an accessible name.
- `TransferList` rows no longer nest interactive controls; the option checkbox has an accessible
  name and row labels use logical `text-start` so they follow the writing direction.
- New PR-triggered CI workflow (`.github/workflows/ci.yml`) running typecheck, tests, and the docs
  build.
