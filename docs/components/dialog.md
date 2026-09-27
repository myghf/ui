<script setup lang="ts">
import DialogBasic from '../.vitepress/theme/demos/dialog/basic.vue'
import DialogSizes from '../.vitepress/theme/demos/dialog/sizes.vue'
</script>

# Dialog

`Dialog` is a modal window built on reka-ui's dialog primitive. It is controlled through
`v-model:visible`, renders an overlay and a focus-trapped panel, and ships with header,
body, and footer regions.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog } from '@myghf/ui'

const visible = ref(false)
</script>

<template>
  <Dialog v-model:visible="visible" title="Publish changes" description="This updates the live site.">
    <template #trigger>
      <Button>Open dialog</Button>
    </template>
    <template #footer>
      <Button variant="outline" @click="visible = false">Cancel</Button>
      <Button @click="visible = false">Publish</Button>
    </template>
  </Dialog>
</template>
```

## Examples

### Basic dialog

Pass `title` and `description` for the header, fill the default slot with body content,
and use the `footer` slot for actions. The `trigger` slot is rendered `as-child`, so the
element you provide becomes the dialog trigger.

<Demo>
  <DialogBasic />
</Demo>

<<< ../.vitepress/theme/demos/dialog/basic.vue

### Sizes

`size` sets the panel's maximum width. The panel is centred and capped at `85vh` tall;
its body scrolls while the header and footer stay fixed.

<Demo>
  <DialogSizes />
</Demo>

<<< ../.vitepress/theme/demos/dialog/sizes.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Whether the dialog is open. Bind it with `v-model:visible`. |
| `title` | `string` | — | Header title. Can also be provided through the `header` slot. |
| `description` | `string` | — | Supporting line under the title. Can also be provided through the `description` slot. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width: `sm` → `max-w-sm`, `md` → `max-w-md`, `lg` → `max-w-2xl`, `xl` → `max-w-4xl`. |

`Dialog` is fully controlled: keep `visible` in your own state and let the component
report requested changes through `update:visible`.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:visible` | `boolean` | Emitted when the dialog requests to open or close (trigger click, overlay click, <kbd>Esc</kbd>, or the close button). |
| `close` | — | Emitted once when the dialog closes. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Element that opens the dialog. Rendered through reka's `as-child`, so it must be a single element that accepts attributes and a ref. |
| `header` | Replaces the title text. Rendered inside the `<DialogTitle>`. |
| `description` | Replaces the description text. Rendered inside the `<DialogDescription>`. |
| `default` | Body content, in the scrollable region. |
| `footer` | Actions row, shown only when the slot is present. |

## Exposed methods

None. `Dialog` does not call `defineExpose`. Open and close it by updating the bound
`visible` value.

## Accessibility

- reka-ui renders the panel with `role="dialog"` and `aria-modal="true"`, traps focus
  inside it, and restores focus to the trigger on close.
- The title and description are wired to the panel through `aria-labelledby` /
  `aria-describedby`. **Provide at least a `title`**, or an accessible name via an
  `aria-label`. Because `Dialog` only renders `<DialogTitle>` when `title` (or the
  `header` slot) is present, a dialog with neither has no accessible name.
- <kbd>Esc</kbd> closes the dialog and clicking the overlay dismisses it. `Dialog` does
  **not** expose `closeOnEscape` / `closeOnOutside` props; if you need different dismissal
  behaviour, use [Drawer](/components/drawer), which does.
- The close button is a real `<button>` with `aria-label="Close"`.
- Focus is trapped while the dialog is open, so packaging it inside a `<ClientOnly>` is
  only about SSR hydration — it does not change the runtime behaviour.

## Dark mode & RTL

- The overlay uses `bg-black/50 dark:bg-black/70`, and the panel styles entirely from
  semantic tokens (`bg-surface`, `border-border`, `text-foreground`, `text-muted`,
  `shadow-dialog`), so both themes are covered.
- The panel is centred with physical utilities (`left-1/2 -translate-x-1/2`) because it
  is symmetric; no override is needed under RTL. Header and footer use flex with `gap`
  and `justify-end`, and the header's close button sits at the end edge without physical
  padding.
