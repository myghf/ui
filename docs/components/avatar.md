<script setup lang="ts">
import AvatarExamples from '../.vitepress/theme/demos/avatar/examples.vue'
</script>

# Avatar

`Avatar` represents a person or entity with a circular image, falling back to
initials when no image is available. It is a pure presentational primitive: pass
`src` for a picture, or `name`/`initials` to render a token-tinted monogram. All
sizing comes from the shared design tokens, so it follows your theme in light and
dark modes.

```vue
<script setup lang="ts">
import { Avatar } from '@myghf/ui'
</script>

<template>
  <Avatar src="/magdi.png" alt="Magdi Yacoub" />
  <Avatar name="Magdi Yacoub" />
  <Avatar initials="MY" size="lg" />
</template>
```

## Examples

### Sizes and fallbacks

`size` controls the circle (`sm`, `default`, `lg`, `xl`). When `src` is set the
component renders an `<img>`; if the image fails to load, or when `src` is
omitted, it falls back to initials taken from `initials` or derived from `name`
(the first letter of up to two words). The demo uses the package logo as a
sample image.

<Demo>
  <AvatarExamples />
</Demo>

<<< ../.vitepress/theme/demos/avatar/examples.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | `undefined` | Image URL. When set (and it has not errored) an `<img>` is rendered. |
| `alt` | `string` | `undefined` | Alternative text for the image; also used as the `aria-label` of the initials fallback. |
| `name` | `string` | `undefined` | Full name used to derive initials when `initials` is not supplied. |
| `initials` | `string` | `undefined` | Explicit initials for the fallback. Takes precedence over `name`. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl'` | `'default'` | Circle size: `size-6 text-xs`, `size-8 text-sm`, `size-10 text-base`, or `size-14 text-lg`. |

## Events

`Avatar` declares no custom events. The image handles its own native `error`
event internally to switch to the initials fallback. Because the component
renders one of two branches, consumer attributes, classes, and native listeners
fall through to whichever element is rendered (`<img>` or the fallback `<span>`).

## Slots

`Avatar` renders no slots. Use `src` for an image or `initials`/`name` for the
monogram; there is no content area to fill.

## Exposed methods

None. `Avatar` does not call `defineExpose`.

## Accessibility

- The image branch renders a real `<img>` with an `alt` attribute, defaulting to
  `alt ?? name ?? ''`. Pass `alt` whenever the picture conveys identity; an
  `alt=""` (the default when neither is set) marks a decorative image.
- The initials fallback is a `<span role="img">` labelled with `aria-label`,
  resolving to `alt ?? name ?? initials`. Screen readers announce the label rather
  than reading the raw letters as text. When that name is empty, `role` and
  `aria-label` are omitted rather than emitting an empty `aria-label`.
- Keep `alt`/`name` meaningful: avoid using the avatar alone as the only label for
  an interactive control — pair it with a visible name where possible.

## Dark mode & RTL

- The fallback uses `toneClasses.info.soft`, which pairs `bg-primary-100` /
  `text-primary-800` in light mode with `dark:bg-primary-900/40` /
  `dark:text-primary-200` in dark mode. No extra dark-mode classes are needed.
- Layout uses logical, direction-neutral utilities (`inline-flex`, `items-center`,
  `justify-center`) and `object-cover`, so the component renders identically in LTR
  and RTL.
