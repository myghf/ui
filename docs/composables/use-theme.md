<script setup lang="ts">
import ThemeController from '../.vitepress/theme/demos/composables/theme-controller.vue'
</script>

# useTheme

`useTheme()` returns a **theme controller**: reactive state plus methods to set, toggle, and
reset the light/dark theme. It writes the choice onto `<html>` so the library's dark token
block activates, and persists an explicit `light`/`dark` choice to `localStorage`.

Two entry points share one return type:

- **`useTheme(options?)`** — a lazily-created **singleton**. Every caller gets the same
  controller, so a `ThemeToggle` and your own code stay in sync.
- **`createTheme(options?)`** — a **factory** that returns an independent controller, for a
  second theme scope or an isolated preview.

```ts
import { useTheme } from '@myghf/ui'

const { mode, resolved, isDark, setMode, toggle, enable, disable, reset } = useTheme()
```

## Example

The controller below is the shared singleton. Clicking a button writes `.dark` and/or
`data-theme="dark"` on `<html>`, so this site's appearance and the values update together.

<Demo background="muted">
  <ThemeController />
</Demo>

<<< ../.vitepress/theme/demos/composables/theme-controller.vue

## Options

Both `useTheme()` and `createTheme()` accept the same optional object. Every field is
optional, and the defaults are applied per field.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `storageKey` | `string` | `'myghf-theme'` | `localStorage` key used to persist an explicit mode. |
| `attribute` | `'both' \| 'class' \| 'data-theme'` | `'both'` | Which attribute(s) to write on `<html>`. |
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'system'` | Mode used when nothing is stored. |

The `attribute` option controls the markup written on `<html>`:

| Value | Writes | Use when |
| --- | --- | --- |
| `'both'` | `.dark` **and** `data-theme="dark"` | Default. Keeps Tailwind `dark:` utilities and the token block in agreement. |
| `'class'` | `.dark` only | Your CSS keys off the class but you do not want a `data-theme` attribute. |
| `'data-theme'` | `data-theme="dark"` only | Tokens should switch, but Tailwind `dark:` utilities should not. |

::: warning `dark:` utilities require `.dark`
Setting only `data-theme="dark"` activates the dark token block but leaves every Tailwind
`dark:` variant inactive, because the preset is configured as `darkMode: ['class', '.dark']`.
Unless you have a reason not to, keep the default `attribute: 'both'`.
:::

## Return value

`useTheme()` and `createTheme()` both return a `UseThemeReturn`:

| Member | Type | Description |
| --- | --- | --- |
| `mode` | `Ref<'light' \| 'dark' \| 'system'>` | The user's chosen mode. `'system'` follows the OS. |
| `resolved` | `ComputedRef<'light' \| 'dark'>` | The effective mode after resolving `'system'` against `prefers-color-scheme`. |
| `isDark` | `ComputedRef<boolean>` | Convenience flag: `resolved === 'dark'`. |
| `setMode` | `(mode: ThemeMode) => void` | Sets the mode, persists it, and applies the theme. |
| `toggle` | `() => void` | Flips between `'light'` and `'dark'` (based on `resolved`). |
| `enable` | `() => void` | Shorthand for `setMode('dark')`. |
| `disable` | `() => void` | Shorthand for `setMode('light')`. |
| `reset` | `() => void` | Returns to `'system'` and removes the stored value. |

`reset()` always returns to `'system'`; `defaultMode` only seeds the initial mode when nothing
is stored. `toggle()` records an explicit choice (`'light'` or `'dark'`), never `'system'`.

## Singleton vs factory

```ts
import { useTheme, createTheme } from '@myghf/ui'

// Shared: every call returns the same controller.
const theme = useTheme()
const sameTheme = useTheme() // === theme

// Independent: its own refs and its own storage key.
const preview = createTheme({ storageKey: 'preview-theme', attribute: 'class' })
```

`useTheme()` creates the singleton on first call and reuses it afterwards. In development,
calling it again with a **different** options object logs a warning and keeps the first
instance — use `createTheme()` when you need different options rather than calling
`useTheme()` twice. `createTheme()` never touches the singleton, so a factory controller can
carry its own `storageKey` and `attribute` without affecting the shared one.

Because the docs site uses the shared controller, `ThemeToggle` and the demo above operate on
the same state. See the [ThemeToggle component](/components/theme-toggle) and the
[theming guide](/guide/theming) for the token side of dark mode.

## Persistence

`setMode()` persists explicit modes to `localStorage` under `storageKey`:

- `'light'` / `'dark'` → stored under the key.
- `'system'` → the key is **removed**, so the OS preference is followed again.
- `reset()` → removes the key and returns to `'system'`.

Reads and writes are wrapped in `try`/`catch`: if storage is unavailable (private mode,
blocked cookies) the applied theme still works for the session, it just is not remembered.

## SSR behavior

`useTheme()` and `createTheme()` are safe to call during server rendering. Every DOM access
(`document`, `window.localStorage`, `window.matchMedia`) is behind a guard, and:

- Without a DOM, `resolved` is `'light'` and storage is not read.
- `apply()` and `persist()` become no-ops, so nothing throws and no attributes are written.
- Writing attributes happens in the browser, so pair the controller with `<ClientOnly>` (or
  render theme-dependent UI only on the client) to avoid a hydration mismatch.
  `ThemeToggle` reads the same APIs, so wrap it too.

```vue
<template>
  <ClientOnly>
    <ThemeToggle />
  </ClientOnly>
</template>
```

## Related

- [Theming guide](/guide/theming) — the `--myghf-*` token model and dark-mode contract.
- [ThemeToggle](/components/theme-toggle) — a button wired to this controller.
- [useToast](/composables/use-toast) — the other composable in the library.
