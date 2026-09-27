# Accessibility

The library builds on [Reka UI](https://reka-ui.com) primitives for the behavior that is
hardest to get right — focus management, keyboard interaction, and ARIA wiring — and layers
MYGHF styling on top. This page summarizes what is handled, what you must supply, and the
known gaps.

## Focus

- Interactive components show a **focus-visible ring** (`focus-visible:ring-2
  focus-visible:ring-primary-500`). `Button` and `ThemeToggle` add `ring-offset-2`, and use
  `dark:focus-visible:ring-offset-background` so the offset stays visible on dark surfaces.
- `Input`, `Textarea`, `Password`, and `Select` ring the control itself.
  `InputNumber` rings the wrapper with `focus-within` so the whole group lights up.
- Overlays manage focus through Reka's roots: `Dialog` and `Drawer` trap focus while open
  and restore it on close, and `DropdownMenu` moves focus within the open menu.
- **Never remove the focus ring.** If you restyle a control, keep a visible
  `focus-visible` indicator that meets the 3:1 non-text contrast rule.

## Roles and ARIA

| Component | What it exposes |
| --- | --- |
| `Icon` | `aria-hidden="true"` (decorative) and a `data-icon` hook. See [Icons](/guide/icons). |
| `ThemeToggle` | `aria-label` (default `'Toggle theme'`) and `aria-pressed` reflecting dark mode. |
| `Alert` / `Message` | `role` from the tone: `status` for `info`/`success`/`secondary`, `alert` for `warning`/`danger`. The close button has an `aria-label`. |
| `Tag` | Removable tags give the remove button an `aria-label` (`removeLabel`, default `'Remove'`). |
| `Password` | The visibility toggle is `aria-label="Toggle password visibility"`. Strength bars are decorative (`aria-hidden`). |
| `InputNumber` | Reka's number field renders `role="spinbutton"` with `aria-roledescription`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`; the component adds a locale-formatted `aria-valuetext` and `aria-invalid` when `invalid`. |
| `TableHead` | Sets `scope="col"` and `aria-sort` when `sortDirection` is `ascending`/`descending`. |
| `TablePagination` | The current page button gets `aria-current="page"`; previous/next buttons have labels. |
| `Toaster` | Reka's `ToastProvider`/`ToastViewport` announce toasts; the viewport is labelled (`label`, default `'Notifications'`). |
| `TransferList` | Move buttons carry `aria-label`s; the columns are `ul`/`li`. |
| `Dialog`, `Drawer` | Reka wires a labelled/described dialog and provides a labelled close button. |
| `Select`, `Checkbox`, `SelectButton`, `Tabs`, `DropdownMenu`, `DatePicker` | Reka primitives supply the underlying roles, state, and relationships. |

Provide an accessible name for every control: a `<label for>` for text inputs, or an
`aria-label` on icon-only buttons. `Icon` renders decorative SVGs, so a nearby accessible
name is always required.

## Keyboard support

The Reka-backed components are keyboard operable out of the box:

- **Tab / Shift+Tab** move through controls in DOM order.
- **Enter / Space** activate buttons and checkboxes.
- **Arrow keys** move within `Tabs`, `Select`, `DropdownMenu`, `SelectButton`, and the
  `DatePicker` calendar grid.
- **Escape** closes `Dialog`, `Drawer`, and `DropdownMenu` (where enabled), returning focus
  to the trigger.
- `TablePagination` uses native `<select>` and `<button>` controls, so it follows the same
  rules without custom key handling.

Disable a control with its `disabled` prop rather than `pointer-events`, so it is removed
from the tab order and announced as disabled.

## Contrast

Follow the palette rules in [`DESIGN.md`](https://github.com/myghf/ui/blob/main/DESIGN.md):

- Meet **WCAG AA** — 4.5:1 for body text, 3:1 for large text and UI boundaries.
- Text is black on light surfaces and white on blue/black. Never red text on blue, and never
  gold text on white at small sizes.
- If contrast fails, **switch to black or white text** rather than inventing a colour.
- Brand tints use light-on-light in light mode and the `*-900/40` background with `*-200`
  text in dark mode (see [Theming](/guide/theming)).

> **Destructive button caveat:** white text on `error-500` (MYGHF Red) is ≈4.2:1 — just
> under AA for small text. For small destructive labels prefer `error-600` (≈5.3:1) or use
> a larger text size.

## Known gaps

- **No automated contrast check.** Contrast is verified by inspection against `DESIGN.md`;
  there is no luminance/axe test in CI.
- **No automated RTL visual test.** Direction is reviewed by inspection — see
  [RTL & bilingual](/guide/rtl) for the `TransferList` exception.
- **`invalid` is styling-only on some fields.** `Input`, `Textarea`, `Password`, and
  `Select` accept an `invalid` prop that changes the border colour but does **not** set
  `aria-invalid` or `aria-describedby`. Add those attributes yourself when wiring validation
  messages. (`InputNumber` does set them.)
- **Password strength feedback is visual.** The strength bars are `aria-hidden="true"`, so
  they are not announced; surface strength in text if it matters.
- **Fonts are not bundled.** Helvetica Neue, Trajan Pro, GE SS Two, and Adobe Arabic fall
  back to system fonts unless you provide them; verify text rendering and line lengths with
  the real fonts.

## Related automated safeguards

Some correctness is enforced by tests even though contrast and RTL are not: `tokens.spec.ts`
checks that the token set matches the preset and that the dark block only overrides semantic
tokens, and `darkCoverage.spec.ts` asserts every light brand tint in a component has a
`dark:` variant in the same file.
