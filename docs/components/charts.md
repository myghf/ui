<script setup lang="ts">
import ChartsBasic from '../.vitepress/theme/demos/charts/basic.vue'
</script>

# Charts

`Sparkline` and `BarChart` render compact SVG charts from a small set of values, built on the
`d3-scale` and `d3-shape` primitives. Those are external dependencies, so a bundler only pulls
them in for the pages that actually use a chart. Both are accessible by default: give them a
`label` (a `Sparkline` without one is treated as decorative).

```vue
<script setup lang="ts">
import { BarChart, Sparkline } from '@myghf/ui'

const waitTimes = [4, 6, 5, 9, 7, 11, 8, 10]
const referrals = [
  { label: 'Cardiology', value: 42 },
  { label: 'Neurology', value: 28 },
]
</script>

<template>
  <Sparkline :data="waitTimes" label="Median wait times" />
  <BarChart :data="referrals" label="Referrals by unit" />
</template>
```

## Examples

<Demo>
  <ChartsBasic />
</Demo>

<<< ../.vitepress/theme/demos/charts/basic.vue

## Sparkline

A compact line or area chart for a single series, sized for table cells, metric cards, and
trend columns.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `number[]` | — | The series, in order. |
| `type` | `'line' \| 'area'` | `'line'` | Draw a stroked line or a filled area. |
| `width` | `number` | `120` | SVG width in pixels. |
| `height` | `number` | `32` | SVG height in pixels. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'info'` | Line/area colour. |
| `label` | `string` | — | Accessible name. When omitted the sparkline is decorative (`aria-hidden`). |

## BarChart

A categorical bar chart with a screen-reader table of the same values.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `{ label: string; value: number }[]` | — | The categories and their values. |
| `width` | `number` | `320` | SVG width in pixels. |
| `height` | `number` | `160` | SVG height in pixels. |
| `tone` | tone | `'info'` | Bar colour. |
| `label` | `string` | — (required) | Accessible name for the chart. |

## Accessibility

- `Sparkline` is `role="img"` with the `label` as its name; without a `label` it is
  `aria-hidden="true"`, so a purely decorative trend does not clutter the accessibility tree.
- `BarChart` exposes the chart as a named `role="img"` **and** a visually-hidden `<table>` with
  the same labels and values, so screen readers can read the data rather than only a summary.
- Both are non-interactive graphics; put a heading or caption nearby when the chart needs
  context, and keep an accessible name short.

## Dark mode & RTL

- Colour comes from the tone (`text-primary-500` etc.) via `currentColor`, so the charts adapt
  to dark mode automatically.
- The graphics are direction-neutral (values map to a fixed horizontal axis), so there is no RTL
  variant; mirror an axis yourself if a chart must follow the writing direction.
