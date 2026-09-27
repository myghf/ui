<script setup lang="ts">
import IconBasic from '../.vitepress/theme/demos/icon/basic.vue'
import IconColor from '../.vitepress/theme/demos/icon/color.vue'
</script>

# Icon

`Icon` renders a [Lucide](https://lucide.dev) icon by name. It resolves the name to a
component from `lucide-vue-next` at runtime, so no per-icon import is needed.

```vue
<script setup lang="ts">
import { Icon } from '@myghf/ui'
</script>

<template>
  <Icon name="heart" />
  <Icon name="chart-line" :size="20" class="text-primary-500" />
</template>
```

## Examples

### Names and sizes

`name` accepts kebab-case or PascalCase Lucide names. An unknown or empty name falls
back to a circle, which makes a mistake visible instead of silently rendering nothing.

<Demo>
  <IconBasic />
</Demo>

<<< ../.vitepress/theme/demos/icon/basic.vue

### Colour

Icons inherit the current text colour through `currentColor`, so colour them with the
usual token-based text utilities.

<Demo>
  <IconColor />
</Demo>

<<< ../.vitepress/theme/demos/icon/color.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — (required) | Lucide icon name. Normalised with `resolveIconName` then `toPascalCase`; unknown or empty names fall back to `circle`. |
| `size` | `number` | `16` | Pixel size passed to the underlying Lucide component. |

## Events

`Icon` declares no custom events. Because it has a single root element, native listeners
and attributes such as `@click` and `class` fall through to the rendered `<svg>`.

## Slots

`Icon` renders no slots. Use `name` to choose the icon.

## Exposed methods

None. `Icon` does not call `defineExpose`.

## Accessibility

- `Icon` always renders `aria-hidden="true"`: it is **decorative**. It never contributes
  to the accessible name.
- Name the control, not the icon. Icon-only buttons need an `aria-label` on the button:
  ```vue
  <Button size="icon" aria-label="Search"><Icon name="search" /></Button>
  ```
- Icon-and-text pairs are fine as-is, because the text supplies the name.
- Do not rely on shape or colour alone to convey meaning; pair the icon with a label or
  tooltip text.
- For Lucide naming rules and usage guidance, see the [icons guide](/guide/icons).

## Dark mode & RTL

- Icons carry no theme-specific classes. They use `stroke="currentColor"`, so they adapt
  with whatever token-based text colour is applied (`text-foreground`, `text-muted`,
  `text-primary-500`, …).
- Icons are direction-neutral, but a directional glyph (for example a chevron used for
  navigation) may need the `rtl:rotate-180` variant. See the
  [RTL guide](/guide/rtl) for the per-component details.
