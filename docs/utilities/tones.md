<script setup lang="ts">
import TonesDemo from '../.vitepress/theme/demos/utilities/tones.vue'
</script>

# tones

The shared tone map behind every tinted component. A **tone** is a semantic status
(`'info' | 'success' | 'warning' | 'danger' | 'secondary'`), and `toneClasses` maps each one
to the class strings and ARIA role used to render it. `Tag`, `Alert`/`Message`, and `Toast`
all read from it, so tinting stays consistent across the library.

```ts
import { toneClasses, type Tone, type ToneClasses } from '@myghf/ui'
```

## Types

### `Tone`

```ts
type Tone = 'info' | 'success' | 'warning' | 'danger' | 'secondary'
```

### `ToneClasses`

```ts
interface ToneClasses {
  soft: string
  outline: string
  icon: string
  role: 'alert' | 'status'
}
```

| Field | Type | Description |
| --- | --- | --- |
| `soft` | `string` | Filled/tinted surface classes (background **and** text), including `dark:` variants. |
| `outline` | `string` | Bordered variant with a transparent background. |
| `icon` | `string` | Text-colour classes for a leading icon. |
| `role` | `'alert' \| 'status'` | The ARIA live-region role that matches the tone's urgency. |

## `toneClasses`

```ts
const toneClasses: Record<Tone, ToneClasses>
```

The complete map. `secondary` is the neutral tone — it uses semantic tokens
(`bg-surface-muted`, `border-border`, `text-muted`) rather than a brand tint.

| Tone | `role` | `soft` | `outline` | `icon` |
| --- | --- | --- | --- | --- |
| `info` | `status` | `bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200` | `border border-primary-300 text-primary-800 dark:border-primary-700 dark:text-primary-200` | `text-primary-500 dark:text-primary-300` |
| `success` | `status` | `bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-200` | `border border-success-300 text-success-800 dark:border-success-700 dark:text-success-200` | `text-success-500 dark:text-success-300` |
| `warning` | `alert` | `bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-200` | `border border-warning-300 text-warning-800 dark:border-warning-700 dark:text-warning-200` | `text-warning-500 dark:text-warning-300` |
| `danger` | `alert` | `bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-200` | `border border-error-300 text-error-800 dark:border-error-700 dark:text-error-200` | `text-error-500 dark:text-error-300` |
| `secondary` | `status` | `bg-surface-muted text-foreground` | `border border-border text-foreground` | `text-muted` |

Every brand-tinted tone carries both light and `dark:` classes following the library's
`*-900/40` + `*-200` rule (see the [theming guide](/guide/theming)). All values are
token-based utilities — there is no raw colour anywhere in the map.

## Example

```ts
import { cn, toneClasses } from '@myghf/ui'

const { soft, outline, icon, role } = toneClasses.warning

// Compose a custom element with the library's tint:
const classes = cn('rounded-md px-2 py-1 text-sm', soft)

// Pick the live-region role:
const ariaRole = role // → 'alert'
```

<Demo background="muted">
  <TonesDemo />
</Demo>

<<< ../.vitepress/theme/demos/utilities/tones.vue

## Notes

- **Reach for a component first.** `Tag`, `Alert`/`Message`, and `Toast` already apply
  `toneClasses`; use the map directly only when building your own tinted surface.
- **`role` carries meaning, not just styling.** `warning` and `danger` map to `alert`
  (assertively announced); the other tones map to `status`. Honour it when you render your
  own live regions.
- **`soft` includes text colour.** It is a background/text pair, so apply it to an element
  that should darken or lighten its text with the tint. Use `icon` only for the leading
  glyph.
