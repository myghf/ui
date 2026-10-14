---
"@myghf/ui": patch
---

fix(a11y): make the primary action meet WCAG AA. White text on `primary-500` (MYGHF Blue) is ≈2.9:1 — below AA and even the 3:1 large-text threshold — and was used on the primary button, the DatePicker/TimePicker apply buttons, the selected date-range endpoints, the completed Stepper step, the TreeSelect checkbox, and the SelectButton highlight. Those surfaces now use `primary-700` (≈6.6:1) with `primary-800` on hover. The contrast guard asserts the pair meets AA and fails the suite if any component pairs `bg-primary-500` with white text. Also documents and pins the DataTable selection contract: it is controlled (the parent accumulates the map across pages) and `manual`-mode select-all is page-scoped.
