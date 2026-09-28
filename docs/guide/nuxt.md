# Nuxt

`@myghf/ui` ships an optional [Nuxt](https://nuxt.com) module at the
`@myghf/ui/nuxt` subpath. It wires the library into a Nuxt app in one line:
transpilation, the design-token stylesheet, the Tailwind content glob and preset, and
auto-imports for components, composables, and utilities.

The module is **optional**. Plain Vue or Vite apps keep importing from `@myghf/ui` and
following the [Setup guide](/guide/setup); nothing Nuxt-specific is loaded.

## Install

```bash
npm install @myghf/ui
```

`@nuxt/kit` is the runtime API the module uses, and `@nuxt/schema` is a declared peer for
its types. Both are marked **optional** peer dependencies, and a Nuxt app already includes
`@nuxt/kit` (and normally `@nuxt/schema`), so you do not need to install them yourself —
add them explicitly only if your package manager does not hoist Nuxt's copies:

```bash
npm install -D @nuxt/kit @nuxt/schema
```

[`@nuxtjs/tailwindcss`](https://tailwindcss.nuxtjs.org) is also an **optional** peer. The
automatic Tailwind wiring below only happens when that module is installed. If it is
missing, `@myghf/ui/nuxt` logs a warning and leaves your Tailwind config untouched — follow
the [manual setup](#manual-tailwind-setup) instead. Install it explicitly with:

```bash
npm install -D @nuxtjs/tailwindcss
```

## Register the module

Add the subpath to `modules` in `nuxt.config.ts`. The module is auto-configured with
sensible defaults, so this is all that is required:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@myghf/ui/nuxt'],
})
```

Tailwind wiring requires the [Tailwind module](https://tailwindcss.nuxtjs.org)
(`@nuxtjs/tailwindcss`). Register `@myghf/ui/nuxt` **after** it — the module appends the
content glob and preset to the Tailwind config at setup, so the Tailwind module must already
be present:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt'],
})
```

## Configure it

The module reads its options from the `myghfUi` key. Every option has a default; only set
the ones you need.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt'],
  myghfUi: {
    autoImports: { components: true, composables: true },
    prefix: '',
    tailwind: true,
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `autoImports` | `boolean \| { components?: boolean; composables?: boolean }` | `true` | Registers the library's components and its composables/utilities for Nuxt auto-imports. `true` enables everything, `false` disables everything, and the object form toggles each group independently — an unspecified key defaults to `true`. |
| `prefix` | `string` | `''` | Optional prefix added to every auto-imported **component** name. With `prefix: 'My'` the button is registered as `<MyButton>`; the unprefixed `<Button>` is no longer auto-registered (import it explicitly if you still need it). Composables and utilities are never prefixed. |
| `tailwind` | `boolean` | `true` | Wire the Tailwind preset and content glob into `@nuxtjs/tailwindcss`. Set to `false` to opt out and silence the "not detected" warning. |

## What the module wires

At setup the module adds:

- **Transpile** — `@myghf/ui` is pushed onto `build.transpile`, so Nuxt compiles the
  library's bundled ESM output for the client and server builds.
- **Tokens** — `@myghf/ui/tokens.css` is unshifted onto `css`, which loads the
  `--myghf-*` custom properties before your own stylesheets so your overrides still win by
  source order.
- **Tailwind content** — when `@nuxtjs/tailwindcss` is present, it appends
  `./node_modules/@myghf/ui/dist/**/*.js` to `tailwindcss.config.content` so Tailwind can
  see the classes the library ships.
- **Tailwind preset** — it also pushes the `@myghf/ui/tailwind-preset` object onto
  `tailwindcss.config.presets`, giving you the brand scales, semantic colours, fonts,
  shadows, and `darkMode: ['class', '.dark']`.
- **Components** — when component auto-imports are enabled, every component export is
  registered with Nuxt's `addComponent`, so `<Button>`, `<FormField>`, `<DropdownMenu>`,
  and the rest work in any template without an import.
- **Composables and utilities** — when composable auto-imports are enabled, the stateful
  `use*`/`create*` helpers and the pure runtime helpers/formatters are registered with
  `addImports`, **unprefixed**. `useTheme()`, `useToast()`, `cn()`, and the date, locale,
  number, and icon helpers are then available in `<script setup>` without an import.

### Manual Tailwind setup

The two Tailwind steps above need `@nuxtjs/tailwindcss`. Without it, the module logs a
warning and does **not** add the preset or content glob. Wire the same two things yourself:

1. Add `'./node_modules/@myghf/ui/dist/**/*.js'` to your Tailwind `content` globs.
2. Add `'@myghf/ui/tailwind-preset'` to your Tailwind `presets`.

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'

export default {
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
  presets: [myghfPreset],
}
```

Setting `myghfUi: { tailwind: false }` skips the wiring entirely and silences the warning —
use it when you manage Tailwind yourself and do not want the module to help. These are the
same preset and content glob described in [Setup](/guide/setup).

## Auto-imports and explicit imports

Auto-imports are a convenience, not a requirement. With `autoImports: false` — or for
anything not registered — import explicitly:

```vue
<script setup lang="ts">
import { Button, FormField, Input } from '@myghf/ui'
import { useTheme } from '@myghf/ui'
</script>
```

Mixing the two is fine. `prefix` only affects the auto-registered **component** names;
composables and utilities are never prefixed, and the exports themselves keep their original
names either way.

With `autoImports` enabled, the registered composables are `useTheme`, `createTheme`,
`useToast`, `createToastStore`, `toastKey`, and the form-field helper `useFormField`. The
registered utilities include `cn`, `toneClasses`, and the date, locale, number, and icon
helpers (`dateToValue`, `toISODate`, `formatLocalizedDate`, `toNumberOrNull`,
`resolveIconName`, and the rest of the public runtime API).

## Non-Nuxt consumers

The module lives behind the separate `@myghf/ui/nuxt` entry point and is the only file that
imports `@nuxt/kit`. Importing `@myghf/ui` — in a Vue SPA, a Vite library, or a test — never
loads it, and `@nuxt/kit` / `@nuxt/schema` / `@nuxtjs/tailwindcss` stay uninstalled without
error because they are optional peers. There is nothing to disable.

## Next step

See [Theming](/guide/theming) for the token model and dark mode, and
[Form field](/components/form-field) for wiring labels and errors that work in any app,
Nuxt included.
