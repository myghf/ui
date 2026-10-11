---
'@myghf/ui': minor
---

Unify the form-field error wiring across every control

- Add `useFieldControl`, a shared composable that resolves a control's `id`,
  `aria-describedby`, `aria-invalid`, and `required` with one consistent precedence
  (explicit prop → `FormField` context → default). It is exported so custom controls can opt
  into the same contract.
- `Input`, `Textarea`, `Select`, and `Password` now use it (no behavior change).
- Wire the remaining controls into the `FormField` context: `Checkbox`, `InputNumber`,
  `SelectButton`, `DatePicker`, `TreeSelect`, and `TransferList` accept `invalid`/`required`
  (and `id` where missing) and associate their error text with `aria-describedby`.
- Add specs for `TreeSelect` and `TransferList` (previously untested) and extend the a11y
  catalog to mount the field-wired controls.
