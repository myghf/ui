<script setup lang="ts">
import TagTones from '../.vitepress/theme/demos/tag/tones.vue'
import TagRemovable from '../.vitepress/theme/demos/tag/removable.vue'
</script>

# Tag

`Tag` is a compact label for categorising or annotating content. It supports the shared
tone palette, an optional leading icon, and an optional remove button.

```vue
<script setup lang="ts">
import { Tag } from '@myghf/ui'
</script>

<template>
  <Tag tone="success" icon="circle-check">Active</Tag>
  <Tag tone="danger" removable @remove="remove">Failed</Tag>
</template>
```

## Examples

### Tones

Tones come from the shared `toneClasses` map. `secondary` is the default and uses the
muted surface rather than a brand tint.

<Demo>
  <TagTones />
</Demo>

<<< ../.vitepress/theme/demos/tag/tones.vue

### Icons and removal

Pass `icon` with a Lucide name to lead with an icon, and set `removable` to render a
remove button. The button emits `remove`; because the click is stopped, it does not
bubble to a parent handler.

<Demo>
  <TagRemovable />
</Demo>

<<< ../.vitepress/theme/demos/tag/removable.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'secondary'` | Colour tone; applies the `soft` classes from `toneClasses`. |
| `icon` | `string` | — | Optional Lucide icon name, rendered before the label through `Icon`. |
| `removable` | `boolean` | `false` | Renders a remove button at the end of the tag. |
| `removeLabel` | `string` | `'Remove'` | Accessible label for the remove button. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `remove` | — | Emitted when the remove button is clicked. The click is stopped, so it does not bubble. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag label content. |

There are no named slots.

## Exposed methods

None. `Tag` does not call `defineExpose`.

## Accessibility

- The remove control is a real `<button type="button">` with an `aria-label` taken from
  `removeLabel`. Give each removable tag a distinct label (for example
  `:remove-label="'Remove ' + tag.label"`) so screen-reader users can tell them apart.
- The default `removeLabel` is `'Remove'`; if several tags share it, the buttons are
  announced identically.
- The leading icon is rendered by `Icon`, which is always `aria-hidden`, so it adds no
  noise to the accessible name.
- Tone conveys meaning through colour. Pair it with text that carries the same meaning;
  do not rely on the tint alone.

## Dark mode & RTL

- The tone styles resolve through `toneClasses`, which pairs each light tint with a dark
  variant (`dark:bg-*-900/40`, `dark:text-*-200`), so tags stay legible in dark mode.
  `secondary` uses the semantic `bg-surface-muted` / `text-foreground`, which adapt
  automatically.
- The remove button is placed with logical spacing (`ms-0.5 -me-0.5`), so it flips to the
  start edge under RTL without a direction-specific class.
