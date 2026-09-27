<script setup lang="ts">
import AlertTones from '../.vitepress/theme/demos/alert/tones.vue'
import AlertInteractive from '../.vitepress/theme/demos/alert/interactive.vue'
</script>

# Alert / Message

`Alert` presents an inline feedback message. It is exported **twice from the barrel** —
as `Alert` and as `Message` — pointing at the same component, so the two names are
interchangeable:

```ts
import { Alert, Message } from '@myghf/ui'
// `Alert === Message`
```

Use `Alert` for a page-level notice and `Message` where the PrimeVue migration used the
`Message` name; the behaviour and props are identical.

```vue
<script setup lang="ts">
import { Alert } from '@myghf/ui'

const onClose = () => {}
</script>

<template>
  <Alert tone="success" title="Saved" description="Your changes were saved." show-icon />
  <Alert tone="danger" variant="outline" closable @close="onClose">
    Something went wrong.
  </Alert>
</template>
```

## Examples

### Tones and variants

Each tone has a sensible icon. Set `show-icon` to render it, or pass `icon` to override
the default name.

<Demo>
  <AlertTones />
</Demo>

<<< ../.vitepress/theme/demos/alert/tones.vue

### Closable, actions, and auto-dismiss

`closable` renders a close button and emits `close`. Pass `duration` (milliseconds) to
auto-dismiss: the timer pauses on hover and focus, and resumes when both are released.
`0` or an omitted `duration` keeps the alert persistent. Use the `actions` slot for a
recovery action.

<Demo>
  <AlertInteractive />
</Demo>

<<< ../.vitepress/theme/demos/alert/interactive.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'info'` | Colour tone and the ARIA role (see Accessibility). |
| `title` | `string` | — | Bold title line. Can also be supplied through the `title` slot. |
| `description` | `string` | — | Body copy. Can also be supplied through the `description` slot. |
| `icon` | `string` | — | Lucide icon name; overrides the tone's default icon. Shown only when `showIcon` is set. |
| `showIcon` | `boolean` | `false` | Renders the leading icon. |
| `closable` | `boolean` | `false` | Renders a close button that emits `close`. |
| `duration` | `number` | — | Auto-dismiss after this many milliseconds. `0` or omitted is persistent. |
| `closeLabel` | `string` | `'Close'` | Accessible label for the close button. |
| `variant` | `'soft' \| 'outline'` | `'soft'` | Filled tint or bordered style. |

The default icon per tone is: `info` → `info`, `success` → `circle-check`,
`warning` → `triangle-alert`, `danger` → `circle-alert`, `secondary` → `info`.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | — | Emitted once when the alert is dismissed, whether by the close button or by `duration`. |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Replaces the leading icon. When used, the `showIcon`/`icon` props are bypassed. |
| `title` | Replaces the `title` text. |
| `description` | Replaces the `description` text. |
| `actions` | Rendered after the message content, before the close button — for a recovery action or link. |
| `close` | Replaces the close button's icon. |
| `default` | Extra body content rendered below the title and description. |

## Exposed methods

None. `Alert` does not call `defineExpose`.

## Accessibility

- The container gets its role from the tone: `warning` and `danger` render
  `role="alert"` (assertive), while `info`, `success`, and `secondary` render
  `role="status"` (polite). Reserve the alert tones for messages that need immediate
  attention.
- The close button is a real `<button type="button">` with an `aria-label` from
  `closeLabel`.
- The leading icon is `aria-hidden` and decorative.
- **Auto-dismiss can hide content.** A timed message may disappear before a screen-reader
  user reaches it. Avoid `duration` for important or actionable messages; prefer a
  persistent alert with a `closable` close button. When `duration` is used, the timer
  pauses on hover and focus, but this does not cover every assistive-technology path.
- For meaningful contrast, choose the tone to match the message urgency and rely on the
  shared tone classes rather than custom colours.

## Dark mode & RTL

- `toneClasses` supplies dark variants for both `soft` and `outline`
  (`dark:bg-*-900/40`, `dark:text-*-200`, `dark:border-*-700`), following the project's
  `*-900/40` + `*-200` dark-tint rule. The `secondary` tone uses semantic tokens that
  adapt automatically.
- The layout is direction-safe: a flex row with `gap-3`, a `min-w-0 flex-1` content
  column, and logical spacing on the close button (`-me-1 -mt-1 ms-auto`, which pushes it
  to the end edge in either direction).
