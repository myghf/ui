<script setup lang="ts">
import SpinnerSizes from '../.vitepress/theme/demos/spinner/sizes.vue'
</script>

# Spinner

`Spinner` is an inline loading indicator. It pairs an animated
[Lucide](https://lucide.dev) `loader-circle` icon with visually hidden status text, so
both sighted and screen-reader users are told that work is in progress.

```vue
<script setup lang="ts">
import { Spinner } from '@myghf/ui'
</script>

<template>
  <Spinner />
  <Spinner size="lg" tone="success" label="Saving your changes" />
</template>
```

## Examples

### Sizes and tones

`size` controls the glyph (`sm`, `default`, `lg`) and `tone` picks the colour from the
shared tone palette. Keep the default `info` tone for neutral loading and reserve the
warning/danger tones for recovery states such as a retry.

<Demo>
  <SpinnerSizes />
</Demo>

<<< ../.vitepress/theme/demos/spinner/sizes.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Icon size: `size-4`, `size-5`, or `size-6`. |
| `label` | `string` | `'Loading…'` | Accessible status text, rendered visually hidden (`sr-only`) and announced by `role="status"`. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'secondary'` | `'info'` | Colour tone applied to the glyph through `toneClasses[tone].icon`. |

## Events

`Spinner` declares no custom events. Because it has a single root element, native
listeners and attributes such as `@click` and `class` fall through to the root `<span>`.

## Slots

`Spinner` renders no slots. Use `label` for the status text and `size`/`tone` to style it.

## Exposed methods

None. `Spinner` does not call `defineExpose`.

## Accessibility

- The root is `role="status"` with `aria-live="polite"`, so the label is announced when
  the spinner appears without interrupting the user.
- The label is rendered in an `sr-only` span and defaults to `Loading…`. Pass a specific
  `label` (for example `"Saving your changes"`) when several spinners could be active at
  once, so assistive technology can distinguish them.
- The icon is `aria-hidden` and decorative; the hidden text carries all meaning. Do not
  rely on the animation alone to signal progress, and prefer a determinate progress
  indicator when the duration is known.
- Because the label is `sr-only`, it is still exposed to accessibility APIs even though
  it is not visible on screen.

## Dark mode & RTL

- Colours come from `toneClasses[tone].icon`, which includes dark variants
  (`dark:text-*-300`) and semantic tokens for the `secondary` tone, so the spinner adapts
  to dark mode with no extra classes.
- The component is direction-neutral: it is an inline flex box with no directional
  padding, margin, or transforms. The spin animation is rotational, so it reads the same
  in LTR and RTL.
