<script setup lang="ts">
import ProgressBasic from '../.vitepress/theme/demos/progress/basic.vue'
</script>

# Progress

`Progress` is a horizontal progress bar built on reka-ui. It renders `role="progressbar"` with
`aria-valuenow`/`aria-valuemin`/`aria-valuemax`, and omits the value when it is indeterminate.
Use it for uploads, multi-step jobs, and any operation with measurable completion.

```vue
<script setup lang="ts">
import { Progress } from '@myghf/ui'
</script>

<template>
  <Progress :model-value="45" label="Upload progress" />
</template>
```

## Examples

### Determinate, tones, and sizes

Pass `modelValue` (with an optional `max`, default `100`) for a determinate bar. Omit
`modelValue` for an indeterminate one that pulses. `size` and `tone` change the track height
and fill colour.

<Demo>
  <ProgressBasic />
</Demo>

<<< ../.vitepress/theme/demos/progress/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | Progress value. `null` (or a non-finite number) renders an indeterminate bar. |
| `max` | `number` | `100` | Maximum value. A non-positive value falls back to `100`. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Track height. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'info'` | Fill colour. |
| `label` | `string` | — | Accessible name for the bar. **Recommended** — a `progressbar` should have one. |

## Slots

`Progress` renders no slots.

## Exposed methods

None. `Progress` does not call `defineExpose`.

## Accessibility

- reka-ui renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin` (`0`), and
  `aria-valuemax`. When `modelValue` is `null` the value attributes are omitted and
  `data-state="indeterminate"` is set, which is the correct announcement for an unknown
  duration.
- Pass `label` so the bar has an accessible name — assistive technology needs it to say what
  is progressing.
- The bar is not focusable and holds no interactive content; convey any completion action with
  a separate control.

## Dark mode & RTL

- The track uses `bg-surface-muted` and the fill a brand token (`bg-primary-500` and the other
  tones), so it adapts to dark mode automatically.
- The fill is sized with `width: N%`, not a physical transform, so it grows from the inline
  start and mirrors correctly under `dir="rtl"`. The transition is disabled under
  `motion-reduce`.
