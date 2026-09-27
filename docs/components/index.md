# Components

`@myghf/ui` ships accessible, brand-aligned Vue 3 components. Every component page
follows the same structure — a short overview, live examples, then props, events, slots,
exposed methods, accessibility, and dark-mode/RTL notes.

::: tip Theming comes for free
Components style from the `--myghf-*` design tokens, so they follow your brand overrides
and the dark theme automatically. See the [theming guide](/guide/theming) for the token
model, and the [RTL guide](/guide/rtl) for bidi behaviour.
:::

## Actions & display

Components that trigger actions or present short, non-interactive information.

| Component | Exports | Summary |
| --- | --- | --- |
| [Button](/components/button) | `Button` | Primary action control with five variants, five sizes, and loading/disabled states. |
| [Tag](/components/tag) | `Tag` | Compact label or chip with tones, an optional icon, and an optional remove button. |
| [Alert / Message](/components/alert) | `Alert`, `Message` | Inline feedback message; the same component is exported under two names. |
| [ThemeToggle](/components/theme-toggle) | `ThemeToggle` | Button that flips the shared light/dark theme. |
| [Icon](/components/icon) | `Icon` | Renders a Lucide icon by name. |

## Form

Inputs and controls for collecting and validating user data.

| Component | Exports | Summary |
| --- | --- | --- |
| [Input](/components/input) | `Input` | Single-line text field with optional leading/trailing icons and three sizes. |
| [InputNumber](/components/input-number) | `InputNumber` | Numeric field with `min`/`max`/`step`, `Intl` formatting, and optional stepper buttons. |
| [Textarea](/components/textarea) | `Textarea` | Multi-line text field with a configurable row count. |
| [Password](/components/password) | `Password` | Password field with a show/hide toggle and optional strength feedback. |
| [Checkbox](/components/checkbox) | `Checkbox` | Boolean control with an `aria-checked` state. |
| [Select](/components/select) | `Select` | Dropdown listbox for single or multiple selection, with optional clear. |
| [SelectButton](/components/select-button) | `SelectButton` | Segmented control for a mutually exclusive set of options. |
| [DatePicker](/components/date-picker) | `DatePicker` | Calendar field for a single date, a range, or a date and time. |
| [TreeSelect](/components/tree-select) | `TreeSelect` | Tree dropdown that emits the selected leaf keys. |
| [TransferList](/components/transfer-list) | `TransferList` | Moves items between available and selected lists. |

More component groups are documented as their pages ship.
