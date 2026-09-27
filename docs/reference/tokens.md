<script setup lang="ts">
import TokensDemo from '../.vitepress/theme/demos/reference/tokens.vue'
</script>

# Design tokens

`@myghf/ui` ships its design tokens as CSS custom properties named `--myghf-*`. They live in
`tokens.css` and are imported once, from an app entry stylesheet:

```css
@import '@myghf/ui/tokens.css';
```

Every token is a **space-separated RGB channel triple** (`R G B`) — not a hex string, and not a
complete `rgb()` value:

```css
:root {
  --myghf-primary-500: 0 162 221;   /* channels, not a hex string */
  --myghf-background: 248 249 250;
}
```

The preset wraps each token with Tailwind's `<alpha-value>` placeholder, so the channels can be
composed with an alpha and the opacity modifiers work:

```css
color: rgb(var(--myghf-primary-500));             /* use the channels directly */
background-color: rgb(var(--myghf-primary-500) / 0.5);  /* …or with an alpha */
```

```html
<!-- Tailwind substitutes <alpha-value>, so /50 works -->
<div class="bg-primary-500/50 text-foreground">50% brand blue</div>
```

See the [Tailwind preset reference](/reference/tailwind-preset) for the utility mapping.

## Live swatches

Every token below, rendered from the stylesheet. Toggle the site's appearance to see the
semantic layer (and any brand tint) respond.

<Demo background="muted">
  <TokensDemo />
</Demo>

<<< ../.vitepress/theme/demos/reference/tokens.vue

## Semantic tokens

The semantic layer describes roles rather than hues, so components styled with `bg-surface`,
`text-foreground`, and `border-border` adapt to dark mode with no extra classes. These are the
**only** tokens re-declared by the dark block (see [Dark mode](#dark-mode)).

| Token | Light (`:root`) | Dark | Role |
| --- | --- | --- | --- |
| `--myghf-background` | `248 249 250` | `15 18 23` | App/page background |
| `--myghf-foreground` | `0 0 0` | `243 244 246` | Body text and default icon colour |
| `--myghf-surface` | `255 255 255` | `26 30 37` | Cards, panels, popovers |
| `--myghf-surface-muted` | `243 244 246` | `39 44 53` | Recessed surfaces, hovers |
| `--myghf-border` | `230 230 230` | `55 61 71` | Dividers and borders |
| `--myghf-muted` | `128 128 128` | `156 163 175` | Secondary text, placeholders |

## Brand scales

Each brand scale runs `50`–`900`, with `500` as the brand value. These values are the same in
light and dark: **the dark block does not re-declare these tokens**, so a consumer override keeps
applying in dark mode.

### Primary — MYGHF Blue (`500`)

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-primary-50` | `240 249 253` |
| 100 | `--myghf-primary-100` | `217 241 250` |
| 200 | `--myghf-primary-200` | `173 225 244` |
| 300 | `--myghf-primary-300` | `115 204 236` |
| 400 | `--myghf-primary-400` | `56 182 228` |
| 500 | `--myghf-primary-500` | `0 162 221` |
| 600 | `--myghf-primary-600` | `0 130 177` |
| 700 | `--myghf-primary-700` | `0 100 137` |
| 800 | `--myghf-primary-800` | `0 73 99` |
| 900 | `--myghf-primary-900` | `0 49 66` |

### Secondary — MYGHF Plum (`500`)

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-secondary-50` | `249 244 247` |
| 100 | `--myghf-secondary-100` | `240 228 235` |
| 200 | `--myghf-secondary-200` | `222 198 213` |
| 300 | `--myghf-secondary-300` | `198 157 183` |
| 400 | `--myghf-secondary-400` | `175 115 153` |
| 500 | `--myghf-secondary-500` | `152 76 124` |
| 600 | `--myghf-secondary-600` | `122 61 99` |
| 700 | `--myghf-secondary-700` | `94 47 77` |
| 800 | `--myghf-secondary-800` | `68 34 56` |
| 900 | `--myghf-secondary-900` | `46 23 37` |

### Success — MYGHF Teal (`500`)

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-success-50` | `243 251 250` |
| 100 | `--myghf-success-100` | `231 246 245` |
| 200 | `--myghf-success-200` | `202 236 234` |
| 300 | `--myghf-success-300` | `158 220 216` |
| 400 | `--myghf-success-400` | `90 195 189` |
| 500 | `--myghf-success-500` | `13 167 158` |
| 600 | `--myghf-success-600` | `11 147 139` |
| 700 | `--myghf-success-700` | `9 120 114` |
| 800 | `--myghf-success-800` | `7 94 88` |
| 900 | `--myghf-success-900` | `5 70 66` |

### Warning — MYGHF Gold (`500`)

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-warning-50` | `254 250 242` |
| 100 | `--myghf-warning-100` | `252 242 223` |
| 200 | `--myghf-warning-200` | `249 227 186` |
| 300 | `--myghf-warning-300` | `245 207 136` |
| 400 | `--myghf-warning-400` | `241 187 87` |
| 500 | `--myghf-warning-500` | `237 168 39` |
| 600 | `--myghf-warning-600` | `190 134 31` |
| 700 | `--myghf-warning-700` | `147 104 24` |
| 800 | `--myghf-warning-800` | `107 76 18` |
| 900 | `--myghf-warning-900` | `71 50 12` |

### Error — MYGHF Red (`500`)

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-error-50` | `254 245 244` |
| 100 | `--myghf-error-100` | `253 235 234` |
| 200 | `--myghf-error-200` | `250 210 208` |
| 300 | `--myghf-error-300` | `246 173 170` |
| 400 | `--myghf-error-400` | `240 116 111` |
| 500 | `--myghf-error-500` | `233 50 43` |
| 600 | `--myghf-error-600` | `205 44 38` |
| 700 | `--myghf-error-700` | `168 36 31` |
| 800 | `--myghf-error-800` | `130 28 24` |
| 900 | `--myghf-error-900` | `98 21 18` |

### Info — semantic copy of primary

`info` carries the same channel values as `primary`. It is a separate scale so feedback styling
never couples to the brand scale.

| Step | Token | Value |
| --- | --- | --- |
| 50 | `--myghf-info-50` | `240 249 253` |
| 100 | `--myghf-info-100` | `217 241 250` |
| 200 | `--myghf-info-200` | `173 225 244` |
| 300 | `--myghf-info-300` | `115 204 236` |
| 400 | `--myghf-info-400` | `56 182 228` |
| 500 | `--myghf-info-500` | `0 162 221` |
| 600 | `--myghf-info-600` | `0 130 177` |
| 700 | `--myghf-info-700` | `0 100 137` |
| 800 | `--myghf-info-800` | `0 73 99` |
| 900 | `--myghf-info-900` | `0 49 66` |

## Dark mode

The dark block sits under **two** selectors at once, and sets `color-scheme: dark` so native
controls and scrollbars follow:

```css
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

Three rules matter:

1. **Only the semantic layer is remapped.** The brand scales (`primary` … `info`, steps `50`–`900`)
   are **not** re-declared in the dark block. A consumer's `:root` override of a brand token
   therefore keeps applying while dark mode is active — it is never shadowed by a more specific
   dark rule.
2. **Brand tints need explicit `dark:` variants.** A light tint such as `bg-primary-100` is paired
   with `dark:bg-primary-900/40 dark:text-primary-200` (and `dark:border-primary-700` for
   outlines). This is codified in `toneClasses` and used by `Tag`, `Alert`/`Message`, and `Toast`;
   see the [theming guide](/guide/theming).
3. **`dark:` utilities require the `.dark` class.** Setting `data-theme="dark"` by hand drives this
   token block but leaves Tailwind's `dark:` variants inactive. `useTheme()` writes both (its
   default `attribute` is `'both'`) so the two always agree.

## Overriding tokens

Override any `--myghf-*` variable **after** importing `tokens.css`, so your rule wins by source
order:

```css
@import '@myghf/ui/tokens.css';

:root {
  --myghf-primary-500: 0 130 177;   /* custom brand blue */
  --myghf-background: 255 255 255;  /* strict brand white */
}
```

Because the dark block re-declares only the six semantic tokens, a `:root` override of a brand
scale survives dark mode. Prefer overriding tokens to patching component class names.

> **Tokens are not optional.** Without `tokens.css`, every `rgb(var(--myghf-*))` resolves to
> nothing and the palette collapses.
