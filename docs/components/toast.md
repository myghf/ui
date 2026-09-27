<script setup lang="ts">
import ToastSeverities from '../.vitepress/theme/demos/toast/severities.vue'
import ToastPositions from '../.vitepress/theme/demos/toast/positions.vue'
</script>

# Toast

`Toaster` is the toast provider you mount once, near the root of your app. It renders the
viewports that display toasts and owns a reactive store. `useToast()` resolves that store,
and `createToastStore()` builds one directly when you need to share or pre-seed it.

```vue
<script setup lang="ts">
import { Button, Toaster, createToastStore } from '@myghf/ui'

const toast = createToastStore({ position: 'top-end', max: 4 })
</script>

<template>
  <Toaster :store="toast" />
  <Button @click="toast.success('Saved', 'Your changes were saved.')">Save</Button>
</template>
```

Toasts are added through the store, not a component prop. `createToastStore()` returns
`add` / `remove` / `clear` plus one convenience method per severity.

## Examples

### Severities

Each severity sets the colour and icon, and picks the live-region politeness. The demo
also shows a persistent toast (`duration: 0`) and one with an inline action.

<Demo>
  <ToastSeverities />
</Demo>

<<< ../.vitepress/theme/demos/toast/severities.vue

### Positions and queueing

`position` is logical. Set a default on the store and override it per toast; with the
default `max` of `2` in this demo, extra toasts queue and appear as slots free up.

<Demo>
  <ToastPositions />
</Demo>

<<< ../.vitepress/theme/demos/toast/positions.vue

## Props

### `Toaster`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `ToastPosition` | `'top-end'` | Default viewport corner for toasts that do not set their own `position`. |
| `max` | `number` | `4` | Maximum toasts shown at once. Extras stay queued. Values below 1 are clamped to 1. |
| `duration` | `number` | `5000` | Default auto-dismiss delay in ms. `0` means persistent. |
| `gap` | `string` | `'0.5rem'` | CSS gap between stacked toasts in a viewport. |
| `label` | `string` | `'Notifications'` | Accessible label for the toast viewport region. |
| `store` | `ToastStore` | — | Use an existing store instead of the one `<Toaster>` creates. Pass the same store you send toasts to. |

### Toast options

Passed to `store.add()` or set through the option object behind each convenience method.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Bold title line. |
| `description` | `string` | — | Supporting body copy. |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'info'` | Colour and icon. |
| `duration` | `number` | Toaster's `duration` | Auto-dismiss delay in ms; `0` is persistent. |
| `position` | `ToastPosition` | Toaster's `position` | Per-toast viewport override. |
| `closable` | `boolean` | `true` | Shows the close button unless set to `false`. |
| `icon` | `string` | Severity default | Lucide icon name that overrides the severity icon. |
| `action` | `{ label: string; onClick: () => void }` | — | Inline action button; `label` doubles as its accessible name. |

The default icon per severity is: `info` → `info`, `success` → `circle-check`,
`warning` → `triangle-alert`, `danger` → `circle-alert`, `secondary` → `info`.

Positions are logical and mirror under RTL: `top-start`, `top-center`, `top-end`,
`bottom-start`, `bottom-center`, `bottom-end`.

## Events

`Toaster` declares no events. It displays whatever the store contains; observe the store
directly if you need to react to changes.

## Slots

`Toaster` renders no slots. Mount it once next to your app content and drive it through a
store — there is no default slot to nest the calling component in.

::: tip Sharing one queue across the app
`<Toaster>` creates a store and provides it to its own subtree, but it renders only the
toast viewports (no default slot). To share a queue with components elsewhere in your
tree, create a single store with `createToastStore()` and render
`<Toaster :store="store" />`, then call that store's methods. `useToast()` is the inject
shortcut for a store that a `<Toaster>` ancestor has provided.
:::

## Exposed methods

`Toaster` exposes nothing through `defineExpose`. The API lives on the store.

### `useToast()`

```ts
import { useToast } from '@myghf/ui'

const toast = useToast() // call in setup, at the top level
toast.success('Saved', 'Your changes were saved.')
```

`useToast()` is **setup-only**: it calls `inject(toastKey)` and must run during a
component's setup, not inside an event handler or after an `await`. Without an ancestor
`<Toaster>` in the same subtree it throws
`useToast() requires a <Toaster /> mounted above this component.`

### `createToastStore(options?)`

Builds and returns a `ToastStore`. `options` is `{ max?, duration?, position? }`, with the
same defaults as `<Toaster>`.

### `toastKey`

The `InjectionKey<ToastStore>` used for provide/inject. Useful when you want to provide a
store yourself (for tests or a custom shell) rather than through `<Toaster>`.

### `ToastStore`

| Member | Type | Description |
| --- | --- | --- |
| `items` | `Ref<ToastItem[]>` | Every toast, including those queued past `max`. |
| `visible` | `ComputedRef<ToastItem[]>` | The `max` most recent toasts, oldest first. |
| `add` | `(options: ToastOptions) => string` | Adds a toast and returns its generated id. |
| `remove` | `(id: string) => void` | Removes the toast with that id; a queued toast moves up. |
| `clear` | `() => void` | Removes all toasts. |
| `info` / `success` / `warning` / `danger` / `secondary` | `(title: string, description?: string) => string` | Convenience wrappers that add a toast at that severity. |

## Accessibility

- `<Toaster>` labels each viewport with `label` (default `'Notifications'`). Keep it
  descriptive when more than one toaster is present.
- Severity drives live-region politeness: `danger` and `warning` are announced
  assertively (reka's `foreground` type), while `info`, `success`, and `secondary` are
  announced politely (`background`). Reserve the assertive severities for messages that
  need immediate attention.
- Reka adds a **F8** shortcut that focuses the toast viewport, so keyboard users can reach
  toasts without a pointer.
- The close button has `aria-label="Close"`; an `action` passes its `label` as the
  button's accessible name. Icons are decorative and marked hidden.
- **Auto-dismiss can outrun a screen reader.** For important or actionable messages, pass
  `duration: 0` to keep the toast until the user dismisses it, and give it a
  `description` so the meaning is not carried by the title alone.

## Dark mode & RTL

- Toasts use the shared `toneClasses` soft treatment, which includes dark variants
  (`dark:bg-*-900/40`, `dark:text-*-200`) and semantic surface tokens, so both themes are
  covered.
- Viewports are placed with logical utilities (`start-0` / `end-0`), and `top-center` /
  `bottom-center` use `inset-x-0 mx-auto`. Under RTL the `start` and `end` viewports swap
  edges automatically; the centre positions stay centred.
- Toast content is an inline-flex row with `gap-3` and `min-w-0 flex-1`; the action and
  close controls use logical margins, so no per-direction overrides are required.
