---
'@myghf/ui': minor
---

Add locale number formatting helpers and an RTL source guard

- New `formatNumber`, `formatCurrency`, and `formatPercent` helpers: locale-aware `Intl` formatting
  that falls back to `String(value)` on an invalid locale. Exported from `@myghf/ui` and
  auto-imported by the Nuxt module.
- Add `src/lib/rtlCoverage.spec.ts`, a guard that fails when a component uses a physical
  left/right utility (`pl-`, `pr-`, `ml-`, `mr-`, `text-left`, `text-right`, `border-l-`,
  `border-r-`, `rounded-l-`, `rounded-r-`) instead of its logical equivalent.
