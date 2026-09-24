# @myghf/ui

[![npm version](https://img.shields.io/npm/v/@myghf/ui.svg)](https://www.npmjs.com/package/@myghf/ui)
[![license](https://img.shields.io/npm/l/@myghf/ui.svg)](./LICENSE)

The **Magdi Yacoub Global Heart Foundation (MYGHF)** shared Vue 3 design system — Tailwind-based,
app-agnostic, accessible components for MYGHF / Aswan Heart Centre applications.

- **Built on** [Vue 3](https://vuejs.org) + [Reka UI](https://reka-ui.com) primitives, styled with
  [Tailwind CSS](https://tailwindcss.com).
- **Brand-aligned** to the MYGHF palette, typography, and spacing (see [DESIGN.md](./DESIGN.md)).
- **Bilingual-ready**: English and Arabic, with RTL support.
- **Tree-shakeable** ESM output with bundled TypeScript types.
- **Accessible**: keyboard-operable primitives, focus-visible states, and WCAG-minded contrast.

## Requirements

| Dependency | Version |
| --- | --- |
| `vue` | `^3.5.0` (peer) |
| `tailwindcss` | `^3.4.0` (peer) |

## Install

```bash
npm install @myghf/ui
```

## Setup

Import the design tokens once, in your app entry stylesheet:

```css
/* app.css */
@import '@myghf/ui/tokens.css';
```

Then load the Tailwind preset and make sure your `content` globs include the library's output so its
utility classes are generated:

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'

export default {
  presets: [myghfPreset],
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
}
```

The preset provides the brand colour scale (`primary`, `secondary`, `success`, `warning`, `error`,
`info`), semantic colours (`background`, `foreground`, `surface`, `surface-muted`, `border`,
`muted`), and the font families (`font-sans`, `font-serif`, `font-ar`).

## Usage

```ts
import { Button, Input, DataTable } from '@myghf/ui'
```

```vue
<template>
  <form @submit.prevent="submit">
    <Input v-model="email" type="email" placeholder="you@example.com" />
    <Button type="submit" variant="primary">Continue</Button>
  </form>
</template>
```

### Components

| Area | Exports |
| --- | --- |
| Actions & display | `Button`, `Tag`, `Icon` |
| Form controls | `Input`, `Textarea`, `Password`, `Checkbox`, `Select`, `SelectButton`, `DatePicker`, `TreeSelect` |
| Navigation & overlays | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Dialog`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` |
| Data | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableEmpty`, `TablePagination`, `DataTable`, `TreeTable`, `TransferList` |
| Utilities & types | `cn`, date helpers, `toPascalCase`, `resolveIconName`, `TagTone`, `DataTableFeatures`, `TreeTableColumn`, `TreeNode`, `FlatTreeRow`, `CheckedState` |

### Entry points

| Import | Contents |
| --- | --- |
| `@myghf/ui` | Components, utilities, and types |
| `@myghf/ui/tokens.css` | CSS custom properties (`--myghf-*`) |
| `@myghf/ui/tailwind-preset` | Tailwind preset |

## Theming

Tokens are space-separated RGB channels so Tailwind's `<alpha-value>` opacity modifiers keep working.
Override any `--myghf-*` variable after importing `tokens.css`:

```css
:root {
  --myghf-primary-500: 0 130 177; /* custom brand blue */
  --myghf-background: 255 255 255; /* brand-white page background */
}
```

Do not hard-code hex values in component code — use the tokens or the Tailwind classes. See
[DESIGN.md](./DESIGN.md) for the full palette and rules.

## Bilingual & RTL

Wrap RTL content with `dir="rtl"` and the Arabic font:

```vue
<div dir="rtl" class="font-ar">
  <!-- Arabic content -->
</div>
```

Prefer logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`, `text-end`) over physical
ones, and use the `rtl:` variant for directional icons.

## Design system

Brand rules, the colour/token reference, typography, and logo usage live in
[DESIGN.md](./DESIGN.md). It is written for both developers and AI agents — follow it when building
MYGHF UI.

## Development

```bash
npm ci             # install from the lockfile
npm run typecheck  # vue-tsc --noEmit
npm test           # vitest run
npm run build      # vite build + copy tokens/preset into dist/
```

Contributor and release conventions are documented in [AGENTS.md](./AGENTS.md).

## Releasing

This package uses [Changesets](https://changesets.dev) for versioning and publishing, and ships
from CI via npm Trusted Publishing (OIDC) — there is no `NPM_TOKEN`.

1. Add a changeset describing your change and commit it with your work:
   ```bash
   npx changeset
   ```
2. Open a pull request into `main` as usual.
3. When it merges, CI opens (or updates) a **Version Packages** pull request that bumps `version`
   and updates `CHANGELOG.md`.
4. Merge that pull request to publish to npm. CI creates the git tag and GitHub Release
   automatically, with provenance.

## License

[MIT](./LICENSE) © Magdi Yacoub Global Heart Foundation
