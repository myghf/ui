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
| Actions & display | `Button`, `Tag`, `Icon`, `ThemeToggle`, `Alert`, `Message` |
| Feedback | `Toaster`, `useToast`, `createToastStore` |
| Form controls | `Input`, `InputNumber`, `Textarea`, `Password`, `Checkbox`, `Select`, `SelectButton`, `DatePicker`, `TreeSelect` |
| Navigation & overlays | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Dialog`, `Drawer`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` |
| Data | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableEmpty`, `TablePagination`, `DataTable`, `TreeTable`, `TransferList` |
| Utilities & types | `cn`, date and locale helpers, `toNumberOrNull`, `mergeFormatOptions`, `toPascalCase`, `resolveIconName`, `toneClasses`, `useTheme`, `createTheme`, `toastKey`, `TagTone`, `Tone`, `AlertVariant`, `DatePickerLabels`, `DrawerPosition`, `DrawerSize`, `ThemeMode`, `ToastSeverity`, `ToastPosition`, `DataTableFeatures`, `TreeTableColumn`, `TreeNode`, `FlatTreeRow`, `CheckedState` |

### Component examples

**Toasts** — mount one `<Toaster>` near the root and call `useToast()` from a descendant setup:

```vue
<!-- App.vue -->
<template>
  <Toaster position="top-end" :max="4" />
  <SaveButton />
</template>
```

```vue
<!-- SaveButton.vue -->
<script setup lang="ts">
import { useToast } from '@myghf/ui'

const toast = useToast() // setup-only; requires an ancestor <Toaster />
toast.success('Saved', 'Your changes were saved.')
toast.add({ title: 'Uploading…', severity: 'info', duration: 0 }) // 0 = persistent
</script>
```

`useToast()` throws unless a `<Toaster>` is mounted above the calling component. Positions are
logical (`top-start`…`bottom-end`, default `top-end`); severities are `info`, `success`, `warning`,
`danger`, `secondary`. For tests or a pre-seeded queue, build a store with `createToastStore()` and
pass it via `<Toaster :store="store">`.

**Alert / Message** — the same component under two names, sharing Tag's tones:

```vue
<Alert tone="success" title="Payment received" description="Receipt sent by email." show-icon />
<Message tone="danger" variant="outline" closable @close="dismissed = true">Something failed.</Message>
```

Tones: `info` (default), `success`, `warning`, `danger`, `secondary`; `variant` is `soft` (default)
or `outline`. Pass `duration` (ms) to auto-dismiss, pausable on hover/focus; `0`/omitted is
persistent.

**InputNumber** — numeric `v-model` that emits `number | null`:

```vue
<InputNumber v-model="amount" :min="0" :max="100" :step="5" integer show-buttons />
<InputNumber v-model="price" currency="USD" locale="en-US" prefix="$" />
```

Empty input emits `null`. Supports `min`/`max`/`step`/`stepSnapping`/`integer`, `locale`,
`formatOptions`/`currency`, `prefix`/`suffix`, `showButtons`, and `size`; reka's input renders
`role="spinbutton"` with `aria-roledescription`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
(via the underlying `NumberFieldInput`).

**Drawer** — controlled via `v-model:open`:

```vue
<Drawer v-model:open="open" position="end" size="md" title="Filters">
  <p>Drawer body</p>
  <template #footer><Button @click="open = false">Done</Button></template>
</Drawer>
```

Positions: `left`, `right` (default), `top`, `bottom`, plus logical `start`/`end` that mirror them
and flip in RTL. Sizes: `sm`, `md`, `lg`, `full`. Also supports `backdrop`, `closeOnEscape`,
`closeOnOutside`, `showClose`, and `preventScroll`.

> **Drawer caveat:** `preventScroll: false` only takes effect with `backdrop: false`; when a
> backdrop is shown, reka's overlay owns the body scroll lock.

**DatePicker i18n/time** — `DatePicker` accepts `hourFormat` (`'12' | '24'`, default `'24'`),
`minuteStep` (default `1`), `locale` (BCP-47, default runtime locale), `labels` (partial overrides
for `placeholder`, `previousMonth`, `nextMonth`, `clear`, `apply`, `today`, `time`, `hour`,
`minute`, `am`, `pm`), `weekStartsOn`, and `defaultOpen`. Month and weekday headers and the display
text are locale-formatted, and the nav chevrons flip in RTL. Override individual labels with
`label-<key>` slots.

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

### Dark mode

The preset sets `darkMode: ['class', '.dark']`, and importing `@myghf/ui/tokens.css` ships a dark
token block under both `[data-theme='dark']` and `.dark`. It overrides **only** the six semantic
variables; the brand colour scales are unchanged, so your own `--myghf-*` overrides still apply in
dark mode:

```css
/* shipped by tokens.css */
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

Use `useTheme()` — a shared singleton — or `createTheme()` for an independent controller:

```ts
import { useTheme } from '@myghf/ui'

const { mode, resolved, isDark, setMode, toggle, enable, disable, reset } = useTheme()
// defaults: storageKey 'myghf-theme', attribute 'both', defaultMode 'system'
```

```vue
<ThemeToggle />
```

`useTheme` follows the OS preference when `mode` is `'system'`, persists explicit choices to
`localStorage`, and writes **both** `.dark` and `data-theme="dark"` on `<html>` (`attribute: 'both'`).
`createTheme()` accepts the same options and returns an isolated instance.

> **Caveat:** Tailwind `dark:` utilities only activate under the `.dark` class. Setting
> `data-theme="dark"` by hand drives the token block but **not** `dark:` utilities. `useTheme` sets
> both so they always agree — if you apply the theme yourself, add `class="dark"` as well.

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
