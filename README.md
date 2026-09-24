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

## Releasing

This package uses [Changesets](https://changesets.dev) for versioning and publishing.

1. Add a changeset describing your change and commit it with your work:
   ```bash
   npx changeset
   ```
2. Open a pull request into `main` as usual.
3. When it merges, CI opens (or updates) a **Version Packages** pull request that bumps
   `version` and updates `CHANGELOG.md`.
4. Merge that pull request to publish to npm via Trusted Publishing (OIDC). CI creates the
   git tag and GitHub Release automatically.
