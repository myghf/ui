<script setup lang="ts">
import TimelineBasic from '../.vitepress/theme/demos/timeline/basic.vue'
</script>

# Timeline

`Timeline` renders a chronological activity list: a labelled `<ol>` of `TimelineItem`s. Each
item is a bullet with a title, an optional timestamp, and a body, and consecutive bullets are
joined by a vertical line so the sequence reads as one continuous trail.

```vue
<script setup lang="ts">
import { Timeline, TimelineItem } from '@myghf/ui'
</script>

<template>
  <Timeline label="Admission">
    <TimelineItem title="Admitted" time="09:15" tone="success">Triage complete.</TimelineItem>
    <TimelineItem title="Transferred to ward" time="11:40">Bed 12 assigned.</TimelineItem>
  </Timeline>
</template>
```

## Examples

<Demo>
  <TimelineBasic />
</Demo>

<<< ../.vitepress/theme/demos/timeline/basic.vue

The line is drawn automatically between items and stops after the last bullet — there is
nothing to configure.

## Props

| `Timeline` prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Activity'` | Accessible name for the list. |

| `TimelineItem` prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Event title. Falls back to the `title` slot. |
| `time` | `string` | — | Timestamp shown next to the title. |
| `tone` | tone | `'info'` | Marker colour. |

The `TimelineItem` default slot is the event body.

## Events

None.

## Slots

- `Timeline` renders its `TimelineItem` children.
- `TimelineItem`: `title` (event title) and the default slot (event body).

## Exposed methods

None. `Timeline` does not call `defineExpose`.

## Accessibility

- `Timeline` is a labelled `<ol>`; the `label` prop becomes its `aria-label`, so the list
  announces as a set of events with a name.
- `TimelineItem` marks the timestamp up as `<time>` so assistive tech can read it as a date.
- The connecting line is a decorative pseudo-element; it never appears in the accessibility
  tree, and the list structure already conveys the order.

## Dark mode & RTL

- The line uses the `border` token and the markers use the tone map, so both follow the dark
  theme through the shared tokens.
- The line is positioned with the logical `start` utility and spacing uses `gap`, so the
  whole trail mirrors under `dir="rtl"`.
