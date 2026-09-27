<script setup lang="ts">
import ThemeToggleSizes from '../.vitepress/theme/demos/theme-toggle/sizes.vue'
</script>

# ThemeToggle

`ThemeToggle` is a ghost-styled button that flips the shared theme between light and
dark. It uses the singleton `useTheme()` controller, so every `ThemeToggle` on the page
reflects and controls the same state.

```vue
<script setup lang="ts">
import { ThemeToggle } from '@myghf/ui'
</script>

<template>
  <ThemeToggle />
</template>
```

## Examples

### Sizes

The three sizes mirror `Button`'s ghost treatment. All toggles in the example below share
one controller, so clicking any of them updates the others.

<Demo>
  <ThemeToggleSizes />
</Demo>

<<< ../.vitepress/theme/demos/theme-toggle/sizes.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Control height and padding. |
| `label` | `string` | `'Toggle theme'` | Accessible name, applied as `aria-label`. |

## Events

`ThemeToggle` declares no custom events. Clicking the button toggles the shared theme
internally. Native listeners such as `@click` still fall through to the rendered
`<button>`, so an additional handler runs alongside the toggle.

## Slots

`ThemeToggle` renders no slots. The sun/moon icon is chosen automatically from the
current theme.

## Exposed methods

None. `ThemeToggle` does not call `defineExpose`. To control the theme programmatically,
use `useTheme` (or `createTheme` for an independent controller); both are documented in the
[theming guide](/guide/theming).

## Accessibility

- The button is a real `<button type="button">` with `aria-label` taken from `label`.
- `aria-pressed` reflects the current dark state (`true` when dark), so assistive
  technology reports it as a toggle.
- The icon is decorative; the accessible name comes from `label`. Set a specific
  `label` when more than one toggle is present.
- **SSR note:** `ThemeToggle` reads `localStorage` and `matchMedia` through `useTheme`,
  so on a server-rendered site wrap it in `<ClientOnly>` (or render it only on the
  client) to avoid a hydration mismatch. The demo above does this.

## Dark mode & RTL

- It uses semantic tokens only (`text-foreground`, `hover:bg-surface-muted`) plus the
  shared focus-ring treatment with `dark:focus-visible:ring-offset-background`, so it
  themes correctly with the rest of the library.
- The control is direction-neutral: it uses `gap-2` and symmetric padding, with no
  physical directional utilities.
