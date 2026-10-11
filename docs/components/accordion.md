<script setup lang="ts">
import AccordionBasic from '../.vitepress/theme/demos/accordion/basic.vue'
</script>

# Accordion

`Accordion` and `AccordionItem` show collapsible sections, built on reka-ui. Put
`AccordionItem`s inside `Accordion` and bind `v-model` to the open item's `value` (or an array
of values with `type="multiple"`).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, AccordionItem } from '@myghf/ui'

const open = ref('clinical')
</script>

<template>
  <Accordion v-model="open">
    <AccordionItem value="clinical" title="Clinical notes">…</AccordionItem>
    <AccordionItem value="labs" title="Lab results">…</AccordionItem>
  </Accordion>
</template>
```

<Demo>
  <AccordionBasic />
</Demo>

<<< ../.vitepress/theme/demos/accordion/basic.vue

## Accordion props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[]` | — | Open item value(s). Bind with `v-model`. |
| `type` | `'single' \| 'multiple'` | `'single'` | One open item, or several. |
| `collapsible` | `boolean` | `true` | When `single`, allow closing the open item. |
| `disabled` | `boolean` | `false` | Disables every item. |

## AccordionItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies the item within the accordion. |
| `title` | `string` | — | Header text. Falls back to the `title` slot. |

## Slots

| Slot | Where | Description |
| --- | --- | --- |
| `default` | `Accordion` | The `AccordionItem`s. |
| `title` | `AccordionItem` | Replaces the header text. |
| `default` | `AccordionItem` | The collapsible panel body. |

## Accessibility

- reka-ui renders each header as a `button` with `aria-expanded` and `aria-controls`, wired to a
  panel with `role="region"`; <kbd>Enter</kbd>/<kbd>Space</kbd> toggle it, and the chevron is
  decorative (`aria-hidden`).

## Dark mode & RTL

- The frame uses semantic tokens (`border-border`, `bg-surface`, `text-muted`), so it adapts to
  dark mode automatically. The header is a flex row with `text-start` and logical spacing, so it
  mirrors correctly under `dir="rtl"`.
