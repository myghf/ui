<script setup lang="ts">
import IconGallery from '../.vitepress/theme/demos/icons/gallery.vue'
</script>

# Icons

The library renders icons through a single `Icon` component, backed by
[Lucide](https://lucide.dev). You pass a lucide icon **name**; the component resolves it to
a component at runtime.

## Usage

```vue
<script setup lang="ts">
import { Icon } from '@myghf/ui'
</script>

<template>
  <Icon name="heart" />
  <Icon name="chart-line" :size="20" />
  <Icon name="calendar" class="text-muted" />
</template>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `string` | — (required) | A lucide icon name; see naming below |
| `size` | `number` | `16` | Passed to the underlying lucide component |

<Demo>
  <IconGallery />
</Demo>

<<< ../.vitepress/theme/demos/icons/gallery.vue

## Lucide naming

`name` is normalized before lookup, so several spellings resolve to the same icon:

| You pass | Resolved to |
| --- | --- |
| `heart` | `Heart` |
| `chart-line` | `ChartLine` |
| `chartLine` | `ChartLine` |
| `ChevronDown` | `ChevronDown` |

Under the hood the component runs the name through `resolveIconName` (kebab-case
normalization) and then `toPascalCase` before indexing the `lucide-vue-next` exports.

Guidance:

- **Prefer kebab-case** (`chart-line`, `arrow-right`) — it matches Lucide's own naming and
  reads consistently with Tailwind class names.
- **No prefixes or suffixes.** Write `heart`, not `lucide-heart` or `HeartIcon`.
- **Unknown names fall back to a circle** rather than rendering nothing, so a gap is
  visible instead of silent. If you see a circle, the name is wrong or the icon does not
  exist in the bundled Lucide version.
- An **empty name also falls back to a circle**.

Browse names in the [Lucide icon library](https://lucide.dev/icons). The library resolves
against `lucide-vue-next` `^0.525.0`; icons added to Lucide after that release are not
available through `Icon` until the dependency is bumped.

## Sizing and color

- `size` sets the pixel dimensions; default is `16`.
- Icons render with `stroke="currentColor"`, so **colour comes from text colour**:
  `text-muted`, `text-primary-500`, `text-foreground`. Never hard-code a hex value.
- Inside `Button`, the base styles apply `[&_svg]:size-4`, so icons are 16 px regardless of
  the `size` prop. Use the button's `size` variants to scale the whole control.
- Use a Tailwind `size-*` class (`class="size-5"`) when you need a one-off size in markup.

## Accessibility

`Icon` renders `aria-hidden="true"` — it is always decorative. That means:

- **Icon-only controls need a name on the control**, not the icon:
  ```vue
  <Button size="icon" aria-label="Search">
    <Icon name="search" />
  </Button>
  ```
- **Icon + text pairs are fine as-is**, because the text supplies the name.
- Do not rely on colour or shape alone to convey meaning; pair the icon with a label or
  tooltip text.

## Using Lucide directly

Components like `Password` import lucide components directly for their own chrome. If you
want to render a Lucide icon outside the `Icon` component (for example, in a slot that
expects a component), install `lucide-vue-next` in your own app rather than relying on the
library's transitive dependency:

```bash
npm install lucide-vue-next
```

```vue
<script setup lang="ts">
import { HeartPulse } from 'lucide-vue-next'
</script>

<template>
  <HeartPulse class="size-5 text-error-500" />
</template>
```

## Related

- The `Icon` **component API** is documented on the components pages.
- The `resolveIconName` and `toPascalCase` **helpers** are documented on the utilities
  pages.
- This page covers icon **usage guidance** only.
