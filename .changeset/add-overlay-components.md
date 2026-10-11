---
'@myghf/ui': minor
---

Add Tooltip, Popover, and Accordion

- `Tooltip`: a short hover/focus label for a single trigger, built on reka-ui, with `text`/`side`/
  `align`/`sideOffset`/`delayDuration` and a `content` slot.
- `Popover`: a floating panel anchored to a trigger, with `v-model:open` and positioning props.
- `Accordion` + `AccordionItem`: collapsible sections with `single`/`multiple` types and
  `v-model` over the open value(s).

All are exported from `@myghf/ui` and auto-imported by the Nuxt module.
