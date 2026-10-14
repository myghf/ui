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
| `Password` | The visibility toggle is `aria-label="Toggle password visibility"`. Strength bars are decorative (`aria-hidden`). Inside a `FormField` it wires `id`/`aria-invalid`/`aria-describedby`/`required` like the other text controls. |
| `InputNumber` | Reka's number field renders `role="spinbutton"` with `aria-roledescription`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`; the component adds a locale-formatted `aria-valuetext` and `aria-invalid` when `invalid`. |
| `Switch` | Reka renders a `<button role="switch">` with `aria-checked`; the component adds `aria-invalid` and `aria-required` when set. |
| `RadioGroup` | Reka renders `role="radiogroup"` with a `role="radio"` item per option; each option is named by its own `<label for>`, and the group adds `aria-invalid`/`aria-required` when set. |
| `Combobox` | The search input is `role="combobox"` with `aria-expanded`/`aria-controls`/`aria-autocomplete`; the popup is a `listbox` of `option`s, and the input adds `aria-invalid`/`aria-required` when set. |
| `Progress` | Reka renders `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (the value is omitted when indeterminate); pass `label` for its accessible name. |
| `FormErrors` | A `role="alert"` validation summary; each entry is a button that focuses the field it names. |
| `FileUpload` | The `<input type="file">` is the control (name it with a `FormField` label or `aria-label`); each file's remove button has an `aria-label`, and the file progress is a labelled `Progress`. |
| `TableHead` | Sets `scope="col"` and `aria-sort` when `sortDirection` is `ascending`/`descending`. |
| `TablePagination` | The current page button gets `aria-current="page"`; previous/next buttons have labels. |
| `Toaster` | Reka's `ToastProvider`/`ToastViewport` announce toasts; the viewport is labelled (`label`, default `'Notifications'`). |
| `TransferList` | Move buttons carry `aria-label`s; the columns are `ul`/`li`. |
| `Dialog`, `Drawer` | Reka wires a labelled/described dialog and provides a labelled close button. |
| `Select`, `Checkbox`, `SelectButton`, `Tabs`, `DropdownMenu`, `DatePicker` | Reka primitives supply the underlying roles, state, and relationships. |

Provide an accessible name for every control: a `<label for>` for text inputs, or an
`aria-label` on icon-only buttons. `Icon` renders decorative SVGs, so a nearby accessible
name is always required.

Form controls share one error-wiring contract. Inside a `FormField`, every control resolves
`id`, `aria-describedby`, and — where its element supports them — `aria-invalid` and
`required` through the shared `useFieldControl` composable, so an explicit prop always wins
and the context fills the rest. Controls whose trigger is a `<button>` (`DatePicker`,
`TreeSelect`) associate the description but omit `aria-invalid`/`aria-required`, which are not
valid on a button; `TransferList` exposes the pair on a `role="group"` wrapper. Custom
controls can opt in with the same composable — see
[Form field](/components/form-field#usefieldcontrol).

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

- **Rendered contrast: body text is asserted; the brand exception is documented.** The palette
  guard (`src/lib/contrast.spec.ts`) checks the tokens, and the browser tests (`tests/browser/`)
  assert that body text meets AA against the real computed CSS in light **and** dark. The
  brand-limited pair — `muted` text (≈3.95:1) — is excluded there and pinned as an
  exception; see `DESIGN.md` §6. The primary solid button now meets AA: it uses
  `primary-700` (≈6.6:1) with white text, and the guard fails if any component pairs
  `bg-primary-500` with white text.
- **No pixel/visual regression test.** Direction and theme are covered functionally (the source
  guard `src/lib/rtlCoverage.spec.ts`, plus axe in RTL and dark in `tests/browser/`), but nothing
  compares screenshots, so pixel-correct mirroring is still reviewed by inspection against the
  logical-utility rule — see [RTL & bilingual](/guide/rtl).
- **Password strength feedback is visual.** The strength bars are `aria-hidden="true"`, so
  they are not announced; surface strength in text if it matters.
- **Fonts are not bundled.** Helvetica Neue, Trajan Pro, GE SS Two, and Adobe Arabic fall
  back to system fonts unless you provide them; verify text rendering and line lengths with
  the real fonts.

## Related automated safeguards

- **`src/a11y.spec.ts`** mounts every public component and asserts there are no
  [`axe-core`](https://github.com/dequelabs/axe-core) violations — missing accessible names,
  unlabelled controls, nested interactive elements, and broken ARIA structure. The helper
  lives in `src/test-utils/a11y.ts`; `color-contrast` is disabled there because jsdom has no
  layout engine.
- **`src/lib/contrast.spec.ts`** parses the `--myghf-*` tokens and asserts WCAG AA for body
  text on both surfaces and for brand-tint text, and pins the documented brand exceptions so
  they cannot regress.
- **`src/lib/tokens.spec.ts`** checks that the token set matches the preset and that the dark
  block only overrides semantic tokens, and **`src/lib/darkCoverage.spec.ts`** asserts every
  light brand tint in a component has a `dark:` variant in the same file.
- **`tests/browser/`** (`npm run test:browser`) is the browser level: Playwright renders a
  component harness with real CSS and runs [`axe-core`](https://github.com/dequelabs/axe-core)
  across light/dark × LTR/RTL, asserts body text meets AA against the computed colours, and
  checks the tokens actually resolve — with `color-contrast` allowed to fail only for the
  documented brand exceptions above.
- **`src/lib/rtlCoverage.spec.ts`** fails when a component uses a physical left/right utility
  instead of its logical equivalent.
