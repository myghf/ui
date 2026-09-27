# Tailwind preset

The `@myghf/ui` preset maps every `--myghf-*` token to a Tailwind utility and sets the library's
`darkMode` strategy. It is the default export of `@myghf/ui/tailwind-preset` (built to
`dist/tailwindPreset.js`):

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'

export default {
  presets: [myghfPreset],
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
}
```

The preset provides:

- the brand colour scales — `primary`, `secondary`, `success`, `warning`, `error`, `info`
  (steps `50`–`900`);
- the semantic colours — `background`, `foreground`, `surface`, `surface-muted`, `border`,
  `muted` (plus the `grey` alias);
- the font families — `font-sans`, `font-serif`, `font-ar`;
- the `popover` and `dialog` shadows;
- `darkMode: ['class', '.dark']`.

> Import `@myghf/ui/tokens.css` as well. Every colour value is
> `rgb(var(--myghf-*) / <alpha-value>)`, so without the tokens the palette has no value. See
> the [design tokens reference](/reference/tokens) and the [setup guide](/guide/setup).

## `darkMode`

```js
darkMode: ['class', '.dark'],
```

This is a top-level preset setting, not a `theme` extension. The `dark:` variant activates when an
ancestor carries the **`.dark`** class. The selector is named `.dark` because the token block uses
that class in addition to `[data-theme='dark']`.

| Applied on `<html>` | Token block (semantic colours) | Tailwind `dark:` utilities |
| --- | --- | --- |
| `class="dark"` | Applied | Active |
| `data-theme="dark"` only | Applied | **Inactive** |
| Both (the `useTheme()` default) | Applied | Active |

> **`dark:` utilities require the `.dark` class.** Setting `data-theme="dark"` by hand drives only
> the token block; every `dark:` variant stays inert. `useTheme()` writes both so the two always
> agree — if you apply a theme yourself, add `class="dark"` as well. See the
> [theming guide](/guide/theming).

## Colors

### Brand scales

Each brand scale defines the steps `50`–`900`. Every entry is
`'rgb(var(--myghf-<scale>-<step>) / <alpha-value>)'`.

| Utility family | Steps | Source tokens | Brand anchor |
| --- | --- | --- | --- |
| `primary-*` | `50`–`900` | `--myghf-primary-50` … `--myghf-primary-900` | MYGHF Blue at `500` |
| `secondary-*` | `50`–`900` | `--myghf-secondary-50` … `--myghf-secondary-900` | MYGHF Plum at `500` |
| `success-*` | `50`–`900` | `--myghf-success-50` … `--myghf-success-900` | MYGHF Teal at `500` |
| `warning-*` | `50`–`900` | `--myghf-warning-50` … `--myghf-warning-900` | MYGHF Gold at `500` |
| `error-*` | `50`–`900` | `--myghf-error-50` … `--myghf-error-900` | MYGHF Red at `500` |
| `info-*` | `50`–`900` | `--myghf-info-50` … `--myghf-info-900` | copy of `primary` |

Because Tailwind expands the scale, the usual prefixes apply: `bg-primary-500`, `text-error-600`,
`border-success-300`, `ring-warning-400`, `divide-secondary-200`, and so on.

### Semantic colors

| Common utility | Token | Role |
| --- | --- | --- |
| `bg-background` | `--myghf-background` | App/page background |
| `text-foreground` | `--myghf-foreground` | Body text and default icon colour |
| `bg-surface` | `--myghf-surface` | Cards, panels, popovers |
| `bg-surface-muted` | `--myghf-surface-muted` | Recessed surfaces, hovers |
| `border-border` | `--myghf-border` | Dividers and borders |
| `text-muted` | `--myghf-muted` | Secondary text, placeholders |
| `text-grey` | `--myghf-muted` | Alias for `muted` |

Each semantic colour is `'rgb(var(--myghf-<name>) / <alpha-value>)'`, so any Tailwind colour
prefix works (`bg-`, `text-`, `border-`, `from-`, `ring-`, …). Components should use these
semantic utilities so they adapt to dark mode automatically.

### Opacity modifiers

Every colour is defined with Tailwind's `<alpha-value>` placeholder, so the `/opacity` modifier
works on brand and semantic colours alike:

```html
<div class="bg-primary-500/50 text-foreground/70 border border-border/60">Translucent</div>
```

## Font families

| Utility | Stack |
| --- | --- |
| `font-sans` | `Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif` |
| `font-serif` | `Trajan Pro`, `Trajan`, `Times New Roman`, `serif` |
| `font-ar` | `GE SS Two`, `Adobe Arabic`, `Segoe UI`, `Tahoma`, `sans-serif` |

`font-sans` is the default for body and UI copy; `font-serif` is reserved for formal or ceremonial
headlines; set `font-ar` on RTL content (`<div dir="rtl" class="font-ar">`). These are fallback
stacks — the brand fonts are not bundled, so consumers must supply them. See the
[RTL & bilingual guide](/guide/rtl) and `DESIGN.md`.

## Shadows

| Utility | Value | Use |
| --- | --- | --- |
| `shadow-popover` | `0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)` | Popovers, menus, dropdowns |
| `shadow-dialog` | `0 20px 25px -5px rgb(0 0 0 / 0.25)` | Dialogs and drawers |

Beyond the families and shadows above, the preset adds no other `theme` extensions, so the rest of
Tailwind's default scale stays available.

## Notes

- **Tokens are required.** The preset only wires colour values; `@myghf/ui/tokens.css` supplies
  them. Both must be imported.
- **Brand scales are not re-declared in dark mode.** Only the six semantic tokens change, so
  consumer `:root` overrides survive. Tinted components add explicit `dark:` variants
  (`*-900/40` + `*-200`) instead.
- **`dark:` needs `.dark`.** `data-theme="dark"` alone changes tokens, not variants.
- **No raw hex in components.** Use these utilities or the `--myghf-*` variables directly; the
  channel values live in the [tokens reference](/reference/tokens).
