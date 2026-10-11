<script setup lang="ts">
import PopoverBasic from '../.vitepress/theme/demos/popover/basic.vue'
</script>

# Popover

`Popover` is a floating panel anchored to a trigger, built on reka-ui. Pass the trigger through
the `trigger` slot and the panel content through the default slot; bind `v-model:open` to
control it, or omit it to let the component manage its own state.

```vue
<script setup lang="ts">
import { Button, Popover } from '@myghf/ui'
</script>

<template>
  <Popover>
    <template #trigger><Button>Filters</Button></template>
    <!-- panel content -->
  </Popover>
</template>
```

<Demo>
  <PopoverBasic />
</Demo>

<<< ../.vitepress/theme/demos/popover/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled open state. Omit for uncontrolled. Bind with `v-model:open`. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment along the side. |
| `sideOffset` | `number` | `4` | Gap from the trigger, in pixels. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Emitted when the open state changes. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | The trigger element (one focusable node). |
| `default` | The panel content. |

## Accessibility

- reka-ui gives the trigger `aria-expanded`/`aria-controls` and moves focus into the content;
  <kbd>Esc</kbd> closes it and returns focus to the trigger, and a pointer press outside closes
  it too.
- Keep the trigger a real control (a `Button` or a link) so it is keyboard reachable.

## Dark mode & RTL

- The panel uses semantic tokens (`bg-surface`, `border-border`, `shadow-popover`), so it adapts
  to dark mode automatically. Positioning comes from reka's popper, which honours the document
  direction, so it mirrors correctly under `dir="rtl"`.
