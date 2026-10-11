<script setup lang="ts">
import LayoutBasic from '../.vitepress/theme/demos/layout/basic.vue'
</script>

# Layout primitives

Four small, token-free wrappers for the structure that every app rebuilds: `Container` for a
centred page column, `Stack` for vertical rhythm, `Inline` for a wrapping row, and `Grid` for
columns. They render plain elements (no styling beyond layout utilities), take an `as` prop to
choose the tag, and pass attributes through — so they compose with the rest of the library
without hiding anything.

```vue
<script setup lang="ts">
import { Container, Grid, Inline, Stack } from '@myghf/ui'
</script>

<template>
  <Container size="md">
    <Stack gap="lg">
      <Inline gap="sm"><!-- row --></Inline>
      <Grid :cols="3" gap="md"><!-- columns --></Grid>
    </Stack>
  </Container>
</template>
```

## Examples

<Demo>
  <LayoutBasic />
</Demo>

<<< ../.vitepress/theme/demos/layout/basic.vue

Spacing uses the shared scale — `none`, `xs`, `sm`, `md`, `lg`, `xl` — which maps to
`gap-0`/`gap-1`/`gap-2`/`gap-4`/`gap-6`/`gap-8`.

## Container

Centres content and caps its width, with responsive horizontal padding.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element to render. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Max width (`max-w-3xl` … `max-w-screen-2xl`, or none). |
| `padded` | `boolean` | `true` | Add responsive horizontal padding (`px-4 sm:px-6`). |

## Stack

A vertical flex column with a gap.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element to render. |
| `gap` | spacing scale | `'md'` | Space between children. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | — | Main-axis justification. |

## Inline

A horizontal flex row that wraps by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element to render. |
| `gap` | spacing scale | `'sm'` | Space between children. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | — | Main-axis justification. |
| `wrap` | `boolean` | `true` | Wrap children onto new lines. |

## Grid

A CSS grid. Choose a fixed `cols`, or set `minItemWidth` for responsive auto-fit columns.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element to render. |
| `gap` | spacing scale | `'md'` | Space between tracks. |
| `cols` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 12` | `1` | Fixed number of columns. |
| `minItemWidth` | `string` | — | Auto-fit columns at this minimum track width (e.g. `'16rem'`); overrides `cols`. |

## Accessibility

These components are structural only — they render `div`s (or whatever `as` names) with layout
utilities and no roles, so they do not affect semantics or the accessibility tree. Choose a
meaningful `as` where the structure is meaningful (e.g. `as="ul"` for a list, `as="nav"` for
navigation) so the outline stays accurate.

## Dark mode & RTL

They use only layout utilities (`flex`, `grid`, `gap`, `mx-auto`, logical padding) and semantic
`bg-*`/`border-*` are left to their children, so they need no dark-mode handling. Every spacing
and centring utility is direction-neutral or logical, so the layout mirrors correctly under
`dir="rtl"`.
