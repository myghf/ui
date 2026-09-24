# @myghf/ui

The MYGHF shared Vue 3 design system — Tailwind-based, app-agnostic components.

## Install

```bash
npm install @myghf/ui
```

## Use

```css
/* once, in your app entry styles */
@import '@myghf/ui/tokens.css';
```

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'
export default {
  presets: [myghfPreset],
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
}
```

```ts
import { Button } from '@myghf/ui'
```

Override any `--ahc-*` token after importing `tokens.css` to re-theme.
