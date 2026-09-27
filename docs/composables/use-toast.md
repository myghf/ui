<script setup lang="ts">
import ToastProvider from '../.vitepress/theme/demos/composables/toast-provider.vue'
import ToastStore from '../.vitepress/theme/demos/composables/toast-store.vue'
</script>

# useToast

`useToast()` is the injection shortcut for the toast store that a `<Toaster>` ancestor
provides. Toasts are added through that store, not through component props, and the
`<Toaster>` component owns the viewports that display them.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { Toaster } from '@myghf/ui'
import SaveButton from './SaveButton.vue'
</script>

<template>
  <Toaster>
    <SaveButton />
  </Toaster>
</template>
```

```vue
<!-- SaveButton.vue -->
<script setup lang="ts">
import { useToast } from '@myghf/ui'

const toast = useToast() // resolves the store from the <Toaster> ancestor
</script>

<template>
  <button @click="toast.success('Saved', 'Your changes were saved.')">Save</button>
</template>
```

`<Toaster>` provides the store to its **default slot**, and `useToast()` resolves it from
**any descendant** — nesting several components deep is fine.

## Examples

### `useToast()` in a descendant

The buttons below are rendered inside `<Toaster>`'s slot, so `useToast()` finds the store.

<Demo>
  <ToastProvider />
</Demo>

<<< ../.vitepress/theme/demos/composables/toast-provider.vue
<<< ../.vitepress/theme/demos/composables/toast-provider-buttons.vue

### `createToastStore()` with an explicit store

When the components that add toasts cannot be nested under `<Toaster>` — or the queue must
outlive it — build a store with `createToastStore()` and pass it to `<Toaster :store>`.

<Demo>
  <ToastStore />
</Demo>

<<< ../.vitepress/theme/demos/composables/toast-store.vue

## `useToast()`

```ts
import { useToast } from '@myghf/ui'

const toast = useToast() // call in setup, at the top level
```

- **Parameters:** none.
- **Returns:** the `ToastStore` provided by the nearest `<Toaster>` ancestor.
- **Throws:** `useToast() requires a <Toaster /> mounted above this component.` when there is
  no provider in the current component tree.

`useToast()` is **setup-only**: it calls Vue's `inject(toastKey)`, which must run during a
component's setup. Do not call it inside an event handler, a watcher, or after an `await`.
Call it once at the top of `<script setup>` and use the returned store everywhere.

## `createToastStore(options?)`

Builds and returns a `ToastStore` directly. Use it when you need a store outside the
`<Toaster>` tree, want to pre-seed or share one, or need control over the defaults.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | `4` | Maximum toasts shown at once. Values below `1` clamp to `1`. |
| `duration` | `number` | `5000` | Default auto-dismiss delay in ms. `0` means persistent. |
| `position` | `ToastPosition` | `'top-end'` | Default viewport corner. |

```ts
import { createToastStore } from '@myghf/ui'

const toast = createToastStore({ position: 'bottom-end', max: 3, duration: 0 })
```

The returned store's `add()` fills in the store defaults for any toast that omits them, so
per-toast options always win. Pass the store to `<Toaster :store="toast" />` (or to your own
provider) so it has a viewport to render into. Rendering the store's methods without a
`<Toaster>` shows nothing.

## The `ToastStore`

| Member | Type | Description |
| --- | --- | --- |
| `items` | `Ref<ToastItem[]>` | Every toast, including those queued past `max`. |
| `visible` | `ComputedRef<ToastItem[]>` | The `max` most recent toasts, oldest first. |
| `add` | `(options: ToastOptions) => string` | Adds a toast and returns its generated id. |
| `remove` | `(id: string) => void` | Removes the toast with that id; a queued toast moves up. |
| `clear` | `() => void` | Removes all toasts, queued ones included. |
| `info` | `(title: string, description?: string) => string` | Convenience wrapper for `severity: 'info'`. |
| `success` | `(title: string, description?: string) => string` | Convenience wrapper for `severity: 'success'`. |
| `warning` | `(title: string, description?: string) => string` | Convenience wrapper for `severity: 'warning'`. |
| `danger` | `(title: string, description?: string) => string` | Convenience wrapper for `severity: 'danger'`. |
| `secondary` | `(title: string, description?: string) => string` | Convenience wrapper for `severity: 'secondary'`. |

`add()` returns the toast id; keep it if you want to `remove()` that toast programmatically.
The convenience methods are the same call with `severity` preset, so
`toast.success('Saved')` is equivalent to
`toast.add({ title: 'Saved', severity: 'success' })`.

### `ToastOptions`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Bold title line. |
| `description` | `string` | — | Supporting body copy. |
| `severity` | `ToastSeverity` | `'info'` | Colour, icon, and live-region politeness. |
| `duration` | `number` | Store's `duration` | Auto-dismiss delay in ms; `0` is persistent. |
| `position` | `ToastPosition` | Store's `position` | Per-toast viewport override. |
| `closable` | `boolean` | `true` | Shows the close button unless `false`. |
| `icon` | `string` | Severity default | Lucide icon name that overrides the severity icon. |
| `action` | `{ label: string; onClick: () => void }` | — | Inline action button. |

## Severities

`ToastSeverity` is `'info' | 'success' | 'warning' | 'danger' | 'secondary'`. Severity picks
the tone and icon, and drives the live-region politeness: `warning` and `danger` are announced
assertively (`role="alert"`), while `info`, `success`, and `secondary` are announced politely
(`role="status"`).

| Severity | Default icon | Role |
| --- | --- | --- |
| `'info'` | `info` | `status` |
| `'success'` | `circle-check` | `status` |
| `'warning'` | `triangle-alert` | `alert` |
| `'danger'` | `circle-alert` | `alert` |
| `'secondary'` | `info` | `status` |

The default icon and the tone classes come from
[`toneClasses`](/utilities/tones); pass `icon` to override the glyph. See the
[Toast component](/components/toast) for the visual treatment.

## Positions

`ToastPosition` is one of six logical corners:

```
top-start   top-center   top-end
bottom-start bottom-center bottom-end
```

Positions are **logical**: `start` and `end` mirror under RTL, while the centre positions
stay centred. Set a default on the store (`position`) and override it per toast
(`add({ position })`). The component page has a
[live positions demo](/components/toast#positions-and-queueing).

## Duration and queueing

- `duration` is the auto-dismiss delay in **milliseconds**; the default is `5000`.
- `duration: 0` makes a toast **persistent** until the user dismisses it or code calls
  `remove()`/`clear()`. Prefer it for important or actionable messages.
- `max` caps how many toasts are **visible** at once. Extra toasts stay in `items` (they are
  **queued**), and the oldest visible ones make room as they dismiss. `visible` is the `max`
  most recent toasts; `items` holds everything, queued toasts included.
- Adding past `max` never drops a toast — it waits in the queue.

## `toastKey`

`toastKey` is the `InjectionKey<ToastStore>` used for the provide/inject pair. Reach for it
only when you provide a store yourself — for example in tests or a custom shell — instead of
going through `<Toaster>`:

```ts
import { provide } from 'vue'
import { createToastStore, toastKey } from '@myghf/ui'

provide(toastKey, createToastStore())
```

## Provider requirement

`useToast()` only works below a `<Toaster>`. The normal setup is to mount one near the root
and put the app content in its default slot:

```vue
<Toaster>
  <RouterView />
</Toaster>
```

A store created with `createToastStore()` still needs a `<Toaster :store="store" />` to
render. `useToast()` itself does not create a store; it throws rather than silently dropping
toasts, so a missing provider fails loudly during development.

## Related

- [Toast component](/components/toast) — `<Toaster>` props, slots, and examples.
- [Theming guide](/guide/theming) — the shared tone tokens toasts use.
- [useTheme](/composables/use-theme) — the other composable in the library.
