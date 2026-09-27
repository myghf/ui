<script setup lang="ts">
import ThemeToggleDemo from '../.vitepress/theme/demos/theming/theme-toggle.vue'
import SemanticSurfaces from '../.vitepress/theme/demos/theming/semantic-surfaces.vue'
</script>

# Theming

The library is themed entirely through CSS custom properties named `--myghf-*`. The
Tailwind preset maps each one to a utility class, so changing a token restyles every
component that consumes it.

## The token model

Tokens store **space-separated RGB channels** — not hex and not a full `rgb()` value:

```css
:root {
  --myghf-primary-500: 0 162 221;   /* MYGHF Blue */
  --myghf-background: 248 249 250;  /* app background */
}
```

The preset wraps each token with Tailwind's `<alpha-value>` placeholder:

```js
colors: {
  primary: {
    500: 'rgb(var(--myghf-primary-500) / <alpha-value>)',
  },
  background: 'rgb(var(--myghf-background) / <alpha-value>)',
}
```

Two consequences follow:

- Ordinary utilities work directly: `bg-primary-500`, `text-foreground`,
  `border-border`, `bg-surface`.
- **Opacity modifiers work**, because Tailwind substitutes `<alpha-value>`:
  `bg-primary-500/50`, `text-foreground/70`, `border-border/60`.

### Brand scales and semantic tokens

- **Brand scales** — `primary`, `secondary`, `success`, `warning`, `error`, `info` — each
  run `50` through `900`, with `500` as the brand value.
- **Semantic tokens** — `background`, `foreground`, `surface`, `surface-muted`, `border`,
  `muted` — describe roles rather than hues, so semantic utilities adapt to dark mode with
  no extra classes.

## Overriding tokens

Override any `--myghf-*` variable **after** importing `tokens.css`:

```css
:root {
  --myghf-primary-500: 0 130 177;   /* custom brand blue */
  --myghf-background: 255 255 255;  /* strict brand white */
}
```

Because the dark block does not re-declare the brand scales (see below), a `:root`
override keeps applying in dark mode. Prefer overriding tokens to patching component class
names.

## Dark mode

`tokens.css` ships the dark semantic layer under both selectors:

```css
[data-theme='dark'],
.dark {
  color-scheme: dark;
  --myghf-background: 15 18 23;
  --myghf-foreground: 243 244 246;
  --myghf-surface: 26 30 37;
  --myghf-surface-muted: 39 44 53;
  --myghf-border: 55 61 71;
  --myghf-muted: 156 163 175;
}
```

| Token | Light (`:root`) | Dark |
| --- | --- | --- |
| `--myghf-background` | `248 249 250` | `15 18 23` |
| `--myghf-foreground` | `0 0 0` | `243 244 246` |
| `--myghf-surface` | `255 255 255` | `26 30 37` |
| `--myghf-surface-muted` | `243 244 246` | `39 44 53` |
| `--myghf-border` | `230 230 230` | `55 61 71` |
| `--myghf-muted` | `128 128 128` | `156 163 175` |

Three rules matter:

1. **The dark block changes only the six semantic tokens.** Brand scales are not
   re-declared, so a consumer's `:root` overrides still apply whenever dark mode is active.
2. **Brand tints follow the `*-900/40` + `*-200` rule.** On dark, a light tint such as
   `bg-primary-100` pairs with `dark:bg-primary-900/40 dark:text-primary-200` (and
   `dark:border-primary-700` for outlines). This is codified in `toneClasses` and used by
   `Tag`, `Alert`/`Message`, and `Toast`.
3. **`dark:` utilities require the `.dark` class.** Setting `data-theme="dark"` by hand
   drives the token block but leaves every `dark:` variant inactive. `useTheme` writes both
   so the two always agree — if you apply a theme yourself, add `class="dark"` as well.

Components that style with semantic utilities (`bg-surface`, `text-foreground`,
`border-border`) adapt automatically. Only tinted or edge-case components need explicit
`dark:` variants. Toggle this site's appearance and watch the tokens respond:

<Demo background="muted">
  <SemanticSurfaces />
</Demo>

<<< ../.vitepress/theme/demos/theming/semantic-surfaces.vue

## `useTheme` and `createTheme`

`useTheme(options?)` returns a shared singleton controller; `createTheme(options?)` returns
an independent one. Both are safe to call during SSR. Without a DOM the initial mode is
`defaultMode` and `apply()`/`persist()` are no-ops; `resolved` is `'light'` only when that
mode resolves light (`'light'` or `'system'`), so `createTheme({ defaultMode: 'dark' })`
resolves to `'dark'`.

```ts
import { useTheme } from '@myghf/ui'

const { mode, resolved, isDark, setMode, toggle, enable, disable, reset } = useTheme()
```

| Option | Default | Meaning |
| --- | --- | --- |
| `storageKey` | `'myghf-theme'` | `localStorage` key used to persist an explicit mode |
| `attribute` | `'both'` | Which attribute(s) to write on `<html>`: `'both'`, `'class'`, or `'data-theme'` |
| `defaultMode` | `'system'` | Mode used when nothing is stored |

`mode` is `'light' | 'dark' | 'system'`. `resolved` collapses `'system'` against the
`prefers-color-scheme` media query, and `isDark` is `resolved === 'dark'`. `setMode` records
an explicit choice (and persists it), while `toggle`, `enable`, and `disable` are
shorthands. `reset()` returns to `'system'` and clears the stored value.

```ts
import { createTheme } from '@myghf/ui'

const theme = createTheme({ storageKey: 'acme-theme', attribute: 'class' })
```

> In development, calling `useTheme()` a second time with different options logs a warning
> and reuses the first instance. Reach for `createTheme()` when you need different options.

## `ThemeToggle`

`ThemeToggle` is a ghost-styled button that flips the shared theme and reflects state with
`aria-pressed`:

```vue
<ThemeToggle />
```

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `label` | `string` | `'Toggle theme'` (also the accessible name) |

<Demo>
  <ThemeToggleDemo />
</Demo>

<<< ../.vitepress/theme/demos/theming/theme-toggle.vue
