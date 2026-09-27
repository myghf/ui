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

More component groups are documented as their pages ship.
