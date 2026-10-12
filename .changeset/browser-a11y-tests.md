---
'@myghf/ui': minor
---

Add browser-level accessibility tests and make the Accordion heading level configurable

- New Playwright suite (`tests/browser/`, `npm run test:browser`) renders a component harness with
  real CSS and runs axe across the light/dark × LTR/RTL matrix, asserts body text meets WCAG AA
  against the computed colours, and checks the design tokens resolve. It runs in CI.
- `AccordionItem` accepts `headingLevel` (2–6, default 3) so the trigger heading fits the page
  outline — the browser run caught that reka's default `h3` trips `heading-order` under an `h1`.
- Documentation: the accessibility guide now reflects the shipped guards and documents the muted
  text contrast limitation (added to `DESIGN.md` §6).
