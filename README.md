<div align="center">
  <img src="https://raw.githubusercontent.com/myghf/ui/main/docs/public/logo.png" alt="MYGHF heart logo" width="140" />
  <h1>@myghf/ui</h1>
  <p>The shared Vue 3 + Tailwind design system for the <strong>Magdi Yacoub Global Heart Foundation (MYGHF)</strong> and Aswan Heart Centre.</p>
  <p>
    <a href="https://www.npmjs.com/package/@myghf/ui"><img src="https://img.shields.io/npm/v/@myghf/ui.svg" alt="npm version" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@myghf/ui.svg" alt="license" /></a>
  </p>
  <p><a href="https://ui.myfegypt.org"><strong>📖 Full documentation →</strong></a></p>
</div>

## Requirements

| Dependency | Version |
| --- | --- |
| [`vue`](https://vuejs.org) | `^3.5.0` (peer) |
| [`tailwindcss`](https://tailwindcss.com) | `^3.4.0` (peer) |
| [`@nuxtjs/tailwindcss`](https://tailwindcss.nuxtjs.org) | `^6.0.0` (optional peer, Nuxt only) |

## Installation

```bash
npm install @myghf/ui
```

Import the design tokens once in your app entry stylesheet:

```css
/* app.css */
@import '@myghf/ui/tokens.css';
```

Then load the Tailwind preset and include the library's output in your `content` globs:

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'

export default {
  presets: [myghfPreset],
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
}
```

## Usage

```vue
<script setup>
import { Button, Input } from '@myghf/ui'
</script>

<template>
  <form @submit.prevent="submit">
    <Input v-model="email" type="email" placeholder="you@example.com" />
    <Button type="submit">Continue</Button>
  </form>
</template>
```

## Nuxt

An optional module ships at `@myghf/ui/nuxt`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt'],
})
```

It transpiles the library, loads the design tokens, and auto-imports the components,
composables, and utilities. When
[`@nuxtjs/tailwindcss`](https://tailwindcss.nuxtjs.org) is installed (an optional peer) it
also appends the `@myghf/ui/tailwind-preset` and the library content glob to your Tailwind
config; without it the module logs a warning and you add those two entries yourself, or set
`myghfUi: { tailwind: false }` to opt out.

| Option | Type | Default |
| --- | --- | --- |
| `autoImports` | `boolean \| { components?: boolean; composables?: boolean }` | `true` |
| `prefix` | `string` (components only) | `''` |
| `tailwind` | `boolean` | `true` |

See the [Nuxt guide](https://ui.myfegypt.org/guide/nuxt) for details.

## Documentation

Full guides, live component examples, API reference, theming, and RTL notes live at
**[ui.myfegypt.org](https://ui.myfegypt.org)**.

- [Getting started](https://ui.myfegypt.org/guide/introduction)
- [Components](https://ui.myfegypt.org/components/index)
- [Theming & dark mode](https://ui.myfegypt.org/guide/theming)
- [Brand rules (`DESIGN.md`)](./DESIGN.md)

## License

[MIT](./LICENSE) © Magdi Yacoub Global Heart Foundation
