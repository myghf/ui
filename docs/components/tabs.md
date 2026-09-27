<script setup lang="ts">
import TabsBasic from '../.vitepress/theme/demos/tabs/basic.vue'
import TabsControlled from '../.vitepress/theme/demos/tabs/controlled.vue'
</script>

# Tabs

`Tabs` is a thin wrapper around reka-ui's tabs primitive. It ships as four composable
pieces — `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` — that you assemble in
order. The active tab is controlled through `v-model` on the root; the children read it
from context.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@myghf/ui'

const tab = ref('overview')
</script>

<template>
  <Tabs v-model="tab">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="vitals">Vitals</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">Overview panel</TabsContent>
    <TabsContent value="vitals">Vitals panel</TabsContent>
  </Tabs>
</template>
```

## Examples

### Basic tabs

`TabsList` is the `role="tablist"` strip, each `TabsTrigger` carries a `value`, and each
`TabsContent` pairs with a trigger through the same `value`. A `disabled` trigger is
skipped during keyboard navigation and cannot be activated.

<Demo>
  <TabsBasic />
</Demo>

<<< ../.vitepress/theme/demos/tabs/basic.vue

### Controlled value

The root is fully controlled: keep the active value in your own state and update it from
anywhere, including controls outside the tab strip. `TabsContent` accepts
`padding` (default `true`) — set it to `false` to manage spacing yourself.

<Demo>
  <TabsControlled />
</Demo>

<<< ../.vitepress/theme/demos/tabs/controlled.vue

## Props

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | Value of the active tab. Bind it with `v-model`. |

`Tabs` renders reka's `TabsRoot` and forwards only `modelValue`; the reka defaults apply
(horizontal orientation, automatic activation, inactive panels unmounted).

### TabsList

No props. Renders reka's `TabsList` as the tab strip; extra attributes fall through to the
underlying element.

### TabsTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — (required) | Associates the trigger with the `TabsContent` of the same value. |
| `disabled` | `boolean` | `false` | Removes the trigger from keyboard navigation and prevents activation. |

### TabsContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — (required) | The tab this panel belongs to. |
| `padding` | `boolean` | `true` | Adds `pt-4` above the panel so content clears the strip. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted by `Tabs` when the active tab changes. |

`TabsList`, `TabsTrigger`, and `TabsContent` declare no custom events.

## Slots

| Component | Slot | Description |
| --- | --- | --- |
| `Tabs` | `default` | The tab strip and panels (`TabsList` + `TabsContent`). |
| `TabsList` | `default` | The `TabsTrigger`s. |
| `TabsTrigger` | `default` | Trigger content. |
| `TabsContent` | `default` | Panel content. |

None of the four components renders named slots.

## Exposed methods

None. `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` do not call `defineExpose`.
Drive the component through the bound `modelValue`.

## Accessibility

- reka-ui implements the WAI-ARIA tabs pattern: `role="tablist"`, `role="tab"` with
  `aria-selected` and `aria-controls`, and `role="tabpanel"` with `aria-labelledby`.
  Triggers are real `<button>`s.
- Keyboard: the strip uses a roving tabindex, so <kbd>Tab</kbd> reaches the active tab and
  <kbd>Arrow Left</kbd>/<kbd>Arrow Right</kbd> (and <kbd>Home</kbd>/<kbd>End</kbd>) move
  between triggers. With the default automatic activation, moving focus also activates the
  tab.
- `Tabs` does **not** expose reka's `orientation`, `activationMode`, or `dir` props, so you
  cannot switch to vertical layout or manual activation through the wrapper.
- Inactive panels are unmounted by default, so any local state inside a hidden
  `TabsContent` is discarded when you switch away. Keep long-lived state above `Tabs` (or in
  a store). The `padding` prop is purely presentational.

## Dark mode & RTL

- The strip uses `bg-surface-muted` with `text-muted`, the active trigger lifts to
  `bg-surface` / `text-foreground` with `shadow-sm`, the focus ring is `ring-primary-500`,
  and a disabled trigger is dimmed with `opacity-50`. All colours come from semantic tokens,
  so both themes adapt automatically.
- The strip and triggers use only logical flow utilities (`inline-flex`, `gap`, `justify-start`),
  so the row mirrors under `dir="rtl"` with no override. reka-ui reads the inherited
  direction to reverse the arrow keys; set `dir="rtl"` on an ancestor (or through a
  ConfigProvider) for correct direction handling.
