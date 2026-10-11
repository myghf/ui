<script setup lang="ts">
import DashboardBasic from '../.vitepress/theme/demos/dashboard/basic.vue'
</script>

# Dashboard

Small building blocks for operational and clinical dashboards: a metric card, a status badge, a
timeline, and a stepper. They are presentation-only, so they drop into any layout (pair them with
[Grid/Stack](/components/layout)) and the [charts](/components/charts).

```vue
<script setup lang="ts">
import { StatCard, StatusBadge } from '@myghf/ui'
</script>

<template>
  <StatCard label="Admissions" :value="128" hint="This month" :trend="12" />
  <StatusBadge tone="success" label="Stable" />
</template>
```

<Demo>
  <DashboardBasic />
</Demo>

<<< ../.vitepress/theme/demos/dashboard/basic.vue

## StatCard

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The metric name. |
| `value` | `string \| number` | — | The headline value. |
| `hint` | `string` | — | Small text under the value. |
| `trend` | `number` | — | Percentage change; its sign picks the tone (positive → success, negative → danger). |
| `tone` | tone | `'info'` | Accent tone when there is no trend. |

Slots: `value`, `hint`, and a default slot for extra content.

## StatusBadge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | tone | `'info'` | Badge colour. |
| `label` | `string` | — | Label text. Falls back to the default slot. |
| `pulse` | `boolean` | `false` | Animate the dot for a live/active status. |

## Timeline

`Timeline` renders a labelled `<ol>`; add `TimelineItem`s inside.

| `Timeline` prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Activity'` | Accessible name for the list. |

| `TimelineItem` prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Event title. Falls back to the `title` slot. |
| `time` | `string` | — | Timestamp shown next to the title. |
| `tone` | tone | `'info'` | Marker colour. |

The `TimelineItem` default slot is the event body.

## Stepper

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Zero-based index of the current step. |
| `steps` | `{ label: string; description?: string }[]` | `[]` | The steps. |
| `label` | `string` | `'Progress'` | Accessible name for the step list. |

The default slot renders the current step's content; a `step` slot can override a step's label.

## Accessibility

- `StatCard` shows the trend as `+12%` visually and `up 12 percent` to screen readers (the
  sign/arrow are `aria-hidden`).
- `StatusBadge`'s dot is decorative (`aria-hidden`); the label carries the meaning — never rely
  on colour alone, keep the text.
- `Timeline` is a labelled `<ol>`; `TimelineItem` marks the timestamp up as `<time>`.
- `Stepper` marks the active step with `aria-current="step"` and shows a check for completed
  steps (the icon is `aria-hidden`, so the label is the announcement).

## Dark mode & RTL

- All of them use semantic tokens (`bg-surface`, `border-border`, `text-muted`) and the tone map,
  so they adapt to dark mode automatically.
- Layout is logical (`gap`, `text-start`, `ms`/`me`), so everything mirrors under `dir="rtl"`.
