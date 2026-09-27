# Installation

## Requirements

| Dependency | Version | Notes |
| --- | --- | --- |
| `vue` | `^3.5.0` | Peer dependency |
| `tailwindcss` | `^3.4.0` | Peer dependency; Tailwind 3 config format |

Both peers are declared on the package, so your package manager will warn if they are
missing or out of range. Tailwind 4 is outside the peer range: the preset targets
Tailwind 3's `presets` / `darkMode` config format.

The library also depends on [Reka UI](https://reka-ui.com) for accessible primitives and
on [`lucide-vue-next`](https://lucide.dev) for icons. They install with the package; you do
not list them yourself.

## Install

```bash
npm install @myghf/ui
```

The package is published to the public npm registry under the `@myghf` scope. This
repository commits `package-lock.json`, so use `npm`.

## Entry points

| Import | Contents |
| --- | --- |
| `@myghf/ui` | Components, composables, utilities, and types |
| `@myghf/ui/tokens.css` | The `--myghf-*` CSS custom properties (light and dark) |
| `@myghf/ui/tailwind-preset` | The Tailwind preset (default export) |

```ts
import { Button, Input, DataTable } from '@myghf/ui'
```

```css
@import '@myghf/ui/tokens.css';
```

```js
import myghfPreset from '@myghf/ui/tailwind-preset'
```

The package is ESM-only and ships bundled types at `dist/index.d.ts`, so no separate
`@types` package is needed.

## Next step

Continue with [Setup](/guide/setup) to wire the tokens, the preset, and the `content`
globs into your app.
