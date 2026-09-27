<script setup lang="ts">
import DrawerPositions from '../.vitepress/theme/demos/drawer/positions.vue'
import DrawerBehavior from '../.vitepress/theme/demos/drawer/behavior.vue'
</script>

# Drawer

`Drawer` is a panel that slides in from an edge of the viewport. It shares reka-ui's
dialog primitive with [Dialog](/components/dialog), but adds edge positions, `start`/`end`
variants that mirror under RTL, edge-aware sizes, and configurable dismissal.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer } from '@myghf/ui'

const open = ref(false)
</script>

<template>
  <Drawer v-model:open="open" position="end" title="Filters">
    <p>Filter controls…</p>
    <template #footer>
      <Button variant="outline" @click="open = false">Close</Button>
    </template>
  </Drawer>
  <Button @click="open = true">Open filters</Button>
</template>
```

## Examples

### Positions

`position` accepts six values: the physical `left` / `right` / `top` / `bottom`, plus the
logical `start` and `end`, which map to those edges and flip under RTL.

<Demo>
  <DrawerPositions />
</Demo>

<<< ../.vitepress/theme/demos/drawer/positions.vue

### Backdrop, dismissal, and scroll

Turn off the dimming overlay with `backdrop`, block <kbd>Esc</kbd> with `closeOnEscape`,
block outside clicks with `closeOnOutside`, and control the body scroll lock with
`preventScroll`.

<Demo>
  <DrawerBehavior />
</Demo>

<<< ../.vitepress/theme/demos/drawer/behavior.vue

::: warning `preventScroll: false` needs `backdrop: false`
Reka's overlay — not the panel — owns the body scroll lock. The overlay is rendered
whenever `backdrop` **or** `preventScroll` is `true`, so with the default `backdrop: true`
the body stays locked no matter what `preventScroll` says. To actually allow background
scrolling, set **both** `backdrop: false` and `preventScroll: false`.
:::

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Whether the drawer is open. Bind it with `v-model:open`. |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom' \| 'start' \| 'end'` | `'right'` | Edge the panel slides in from. `start`/`end` are logical and flip under RTL. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Edge-aware size (see below). |
| `backdrop` | `boolean` | `true` | Renders the dimming overlay behind the panel. |
| `closeOnEscape` | `boolean` | `true` | Whether <kbd>Esc</kbd> dismisses the drawer. |
| `closeOnOutside` | `boolean` | `true` | Whether a click outside the panel dismisses it. |
| `preventScroll` | `boolean` | `true` | Locks body scroll while the drawer is open. See the caveat above. |
| `title` | `string` | — | Header title. Can also be provided through the `header` slot. |
| `description` | `string` | — | Supporting line. Can also be provided through the `description` slot. |
| `showClose` | `boolean` | `true` | Renders the header close button. |

Sizes map to the panel's constrained dimension:

| Size | Horizontal (`left` / `right` / `start` / `end`) | Vertical (`top` / `bottom`) |
| --- | --- | --- |
| `sm` | `max-w-sm` | `max-h-64` |
| `md` | `max-w-md` | `max-h-96` |
| `lg` | `max-w-lg` | `max-h-[32rem]` |
| `full` | `max-w-full` | `max-h-full` |

For `top` / `bottom`, the vertical max-height is applied instead of a width.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Emitted when the drawer requests to open or close. Required for `v-model:open`. |
| `open` | — | Emitted after the drawer opens. |
| `close` | — | Emitted after the drawer closes. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Element that opens the drawer, rendered `as-child` (a single attribute/ref-accepting element). |
| `header` | Replaces the title text. Rendered inside the `<DialogTitle>`. |
| `description` | Replaces the description text. Rendered inside the `<DialogDescription>`. |
| `default` | Body content, in the scrollable region. |
| `footer` | Actions row, shown only when the slot is present. |
| `close` | Replaces the close button's icon. |

## Exposed methods

None. `Drawer` does not call `defineExpose`. Control it through the bound `open` value.

## Accessibility

- Like `Dialog`, the panel is a reka dialog with `role="dialog"`, `aria-modal="true"`, a
  focus trap, and focus restored to the trigger on close.
- If you pass neither `title` nor the `header` slot, `Drawer` renders a visually hidden
  `<DialogTitle>` ("Drawer") so the panel always has an accessible name. Prefer a real
  `title` that describes the drawer.
- The close button is a real `<button>` with `aria-label="Close"`; use the `close` slot
  to change its icon.
- `closeOnEscape: false` and `closeOnOutside: false` cancel reka's default dismissal.
  Because focus stays trapped inside the panel, a drawer with both disabled and
  `showClose: false` would be impossible to dismiss — always leave one exit available.
- The overlay (`backdrop: true`) communicates modality visually; when `backdrop: false`,
  background content stays visible and the panel is less clearly modal.

## Dark mode & RTL

- The overlay uses `bg-black/50 dark:bg-black/70`; the panel uses semantic tokens
  (`bg-surface`, `border-border`, `shadow-dialog`), so both themes are covered.
- `start` / `end` are logical (`start-0` / `end-0`) and their slide transforms are mirrored
  with `rtl:` variants, so the panel enters from the correct edge in each direction. The
  physical `left` / `right` positions stay put and do not flip.
- The footer's close-side padding and the header close button are direction-safe; the
  `sm`/`md`/`lg` widths are symmetric, so no extra RTL overrides are needed.
