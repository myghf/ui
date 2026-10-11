<script setup lang="ts">
import TooltipBasic from '../.vitepress/theme/demos/tooltip/basic.vue'
</script>

# Tooltip

`Tooltip` shows a short label on hover and focus, built on reka-ui. Wrap a single focusable
element (a button, link, or icon) in the default slot; the trigger's attributes are merged onto
it.

```vue
<script setup lang="ts">
import { Button, Tooltip } from '@myghf/ui'
</script>

<template>
  <Tooltip text="Saves and closes">
    <Button>Save</Button>
  </Tooltip>
</template>
```

<Demo>
  <TooltipBasic />
</Demo>

<<< ../.vitepress/theme/demos/tooltip/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Tooltip text. Falls back to the `content` slot. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the side. |
| `sideOffset` | `number` | `6` | Gap from the trigger, in pixels. |
| `delayDuration` | `number` | `300` | Milliseconds before it opens on hover. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | The trigger element (exactly one focusable node). |
| `content` | Overrides the `text` prop with rich content. |

## Accessibility

- reka-ui wires `aria-describedby` from the trigger to the tooltip and exposes the content with
  `role="tooltip"`; it opens on both hover and keyboard focus, and closes on <kbd>Esc</kbd>.
- The tooltip is supplementary: never put essential information in it. The trigger must already
  make sense on its own (e.g. an icon-only button with an `aria-label`).

## Dark mode & RTL

- The content uses semantic tokens (`bg-surface`, `border-border`, `text-foreground`), so it
  adapts to dark mode automatically; positioning comes from reka's popper, which resolves the
  document direction, so it mirrors correctly under `dir="rtl"`.
