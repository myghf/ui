<script setup lang="ts">
import SkeletonExamples from '../.vitepress/theme/demos/skeleton/examples.vue'
</script>

# Skeleton

`Skeleton` is a placeholder block shown while content loads. It renders an empty,
pulsing `<div>` using the `surface-muted` token, sized with `width`/`height` and
shaped with `rounded`, so layouts can reserve space and avoid content jumps.

```vue
<script setup lang="ts">
import { Skeleton } from '@myghf/ui'
</script>

<template>
  <Skeleton width="12rem" height="1rem" />
  <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
</template>
```

## Examples

### Shapes, corners, and sizes

Compose several skeletons to mirror the layout they stand in for — circles for
avatars, short bars for text lines, and a larger block with `rounded="lg"` for a
card. A skeleton is decorative by default; give it a default slot when you need
content inside the placeholder (for example a centred label).

<Demo>
  <SkeletonExamples />
</Demo>

<<< ../.vitepress/theme/demos/skeleton/examples.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Corner radius: `rounded-sm`, `rounded-md`, `rounded-lg`, or `rounded-full`. `none` leaves the corners square. |
| `width` | `string` | `undefined` | Any CSS length, applied as an inline `width` (for example `'12rem'` or `'40%'`). |
| `height` | `string` | `undefined` | Any CSS length, applied as an inline `height` (for example `'1rem'` or `'2.5rem'`). |

## Events

`Skeleton` declares no custom events. Because it has a single root element, native
listeners and attributes such as `@click` and `class` fall through to the root `<div>`.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Optional content rendered inside the placeholder. When omitted, the block stays empty and shows only the pulsing background. |

## Exposed methods

None. `Skeleton` does not call `defineExpose`.

## Accessibility

- A skeleton is purely decorative, so it deliberately carries no `role` and makes no
  announcement. Screen readers skip an empty `<div>`, which is the desired behaviour.
- Pass `aria-hidden="true"` when the skeleton sits next to real content and you want to
  guarantee it is ignored. Attributes fall through to the root element.
- Mark the region that is loading with `aria-busy="true"` on its container, and remove
  the skeletons once the content arrives, so assistive technology is told when the load
  has finished.
- Do not rely on the animation alone to convey status; pair skeletons with text or a
  live region when the wait could be long.

## Dark mode & RTL

- The fill comes from the `bg-surface-muted` token, which is defined for both the light
  and dark themes, so no extra dark-mode classes are needed.
- The component uses no directional utilities (no margins, padding, or transforms), so
  it renders identically in LTR and RTL.
