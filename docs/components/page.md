<script setup lang="ts">
import PageBasic from '../.vitepress/theme/demos/page/basic.vue'
</script>

# Page

Page chrome: `Breadcrumbs` for the trail, `PageHeader` for the title/description/actions, and
`PageContent` for the padded, width-capped page body. They compose with the
[layout primitives](/components/layout) and are unconcerned with your router — `Breadcrumbs`
renders real anchors and exposes an `item` slot for router links.

```vue
<script setup lang="ts">
import { Breadcrumbs, PageContent, PageHeader } from '@myghf/ui'
</script>

<template>
  <PageContent>
    <PageHeader title="Patients" description="All records">
      <template #breadcrumbs>
        <Breadcrumbs :items="[{ label: 'Patients' }]" />
      </template>
      <template #actions><Button>New</Button></template>
    </PageHeader>
  </PageContent>
</template>
```

<Demo>
  <PageBasic />
</Demo>

<<< ../.vitepress/theme/demos/page/basic.vue

## Breadcrumbs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | `[]` | The trail. The last item is the current page. |
| `label` | `string` | `'Breadcrumb'` | Accessible name for the `nav` landmark. |

```ts
interface BreadcrumbItem {
  label: string
  href?: string // omit on the current page; rendered as text with aria-current
}
```

The `item` slot receives `{ item, index, isCurrent }` to render a custom link (e.g. a
`<router-link>`).

## PageHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Heading text, rendered as an `<h1>`. |
| `description` | `string` | — | Supporting text under the heading. |

Slots: `breadcrumbs`, `title`, `description`, `actions`. The heading renders only when a title
or the `title` slot is present.

## PageContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Max width (wraps [`Container`](/components/layout)). |

## Accessibility

- `Breadcrumbs` renders a `nav` with an `aria-label`; the last item carries
  `aria-current="page"`, and the separators are `aria-hidden`, so screen readers announce the
  trail without the chevrons.
- `PageHeader` renders the title as a real `<h1>`, giving the page its heading landmark; the
  description and actions are ordinary content and controls.
- `PageContent` is a plain container with no role, so it does not affect the accessibility tree.

## Dark mode & RTL

- All three use semantic tokens (`border-border`, `text-foreground`, `text-muted`), so they
  adapt to dark mode automatically.
- Breadcrumb separators use `ChevronRight` with `rtl:rotate-180`, and the trail uses logical
  `gap`, so it reads correctly right-to-left.
