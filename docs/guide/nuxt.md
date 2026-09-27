# Nuxt

`@myghf/ui` ships an optional [Nuxt](https://nuxt.com) module at the
`@myghf/ui/nuxt` subpath. It wires the library into a Nuxt app in one line:
transpilation, the design-token stylesheet, the Tailwind content glob and preset, and — if
you want it — component auto-imports.

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

## Register the module

Add the subpath to `modules` in `nuxt.config.ts`. The module is auto-configured with
sensible defaults, so this is all that is required:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@myghf/ui/nuxt'],
})
```

If you use the [Tailwind module](https://tailwindcss.nuxtjs.org) (`@nuxtjs/tailwindcss`),
register `@myghf/ui/nuxt` **after** it — the module appends the content glob and preset to
the Tailwind config at setup, so the Tailwind module must already be present:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt'],
})
```

## Configure it

The module reads its options from the `myghfUi` key. Both options have defaults; only set
the ones you need.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@myghf/ui/nuxt'],
  myghfUi: {
    autoImports: true,
    prefix: '',
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `autoImports` | `boolean` | `true` | Register the component exports for Nuxt auto-imports. Set to `false` to import them explicitly from `@myghf/ui` instead. |
| `prefix` | `string` | `''` | Optional prefix added to every auto-imported component name. With `prefix: 'My'`, the button is registered as `<MyButton>` — the unprefixed `<Button>` is no longer auto-registered (import it explicitly if you still need it). |

## What the module wires

At setup the module adds:

- **Transpile** — `@myghf/ui` is pushed onto `build.transpile`, so Nuxt compiles the
  library's bundled ESM output for the client and server builds.
- **Tokens** — `@myghf/ui/tokens.css` is unshifted onto `css`, which loads the
  `--myghf-*` custom properties before your own stylesheets so your overrides still win by
  source order.
- **Tailwind content** — when the `@nuxtjs/tailwindcss` module is present, it appends
  `./node_modules/@myghf/ui/dist/**/*.js` to `tailwindcss.config.content` so Tailwind can
  see the classes the library ships.
- **Tailwind preset** — it also pushes the `@myghf/ui/tailwind-preset` object onto
  `tailwindcss.config.presets`, giving you the brand scales, semantic colours, fonts,
  shadows, and `darkMode: ['class', '.dark']`.
- **Auto-imports** — when `autoImports` is `true`, every component export is registered
  with Nuxt's `addComponent`, so `<Button>`, `<FormField>`, `<DropdownMenu>`, and the rest
  work in any template without an import.

The Tailwind steps are **defensive**: if `@nuxtjs/tailwindcss` is not installed the module
skips them (it never hard-depends on it). In that case set up Tailwind yourself as
described in [Setup](/guide/setup) — the preset and content globs are the same.

## Auto-imports and explicit imports

Auto-imports are a convenience, not a requirement. With `autoImports: false` — or for
anything not registered, such as composables — import explicitly:

```vue
<script setup lang="ts">
import { Button, FormField, Input } from '@myghf/ui'
</script>
```

Mixing the two is fine. `prefix` only affects the auto-registered names; the exports
themselves keep their original names.

## Non-Nuxt consumers

The module lives behind the separate `@myghf/ui/nuxt` entry point and is the only file that
imports `@nuxt/kit`. Importing `@myghf/ui` — in a Vue SPA, a Vite library, or a test — never
loads it, and `@nuxt/kit` / `@nuxt/schema` stay uninstalled without error because they are
optional peers. There is nothing to disable.

## Next step

See [Theming](/guide/theming) for the token model and dark mode, and
[Form field](/components/form-field) for wiring labels and errors that work in any app,
Nuxt included.
