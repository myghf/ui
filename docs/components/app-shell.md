<script setup lang="ts">
import AppShellBasic from '../.vitepress/theme/demos/app-shell/basic.vue'
</script>

# App shell

`AppShell` arranges a `Topbar`, a `Sidebar`, and the main content for a typical application
frame. On large screens the sidebar is docked beside the content; below the `lg` breakpoint
`collapsible` (the default) turns it into an off-canvas panel that `Topbar` opens with a
toggle button. The three parts share state through a Vue injection context, so you place the
slots and the wiring is automatic.

```vue
<script setup lang="ts">
import { AppShell, Sidebar, Topbar } from '@myghf/ui'
</script>

<template>
  <AppShell>
    <template #topbar><Topbar>My app</Topbar></template>
    <template #sidebar><Sidebar><!-- navigation --></Sidebar></template>
    <!-- main content -->
  </AppShell>
</template>
```

## Examples

The preview is bounded to a fixed height; in an app the shell fills the viewport.

<Demo>
  <AppShellBasic />
</Demo>

<<< ../.vitepress/theme/demos/app-shell/basic.vue

## AppShell

Slots: `topbar`, `sidebar`, `default` (the main region).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsible` | `boolean` | `true` | Collapse the sidebar off-canvas below the `lg` breakpoint. |

## Sidebar

Renders the navigation landmark. Docked at a fixed width on `lg`; below `lg` (when the shell is
collapsible) it slides in from the inline start.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Sidebar'` | Accessible name for the `nav` landmark. |
| `width` | `string` | `'16rem'` | Docked width when not collapsible (or used standalone). |

## Topbar

Renders the header bar. When it is inside a collapsible `AppShell` it shows a menu button
(visible below `lg`) that opens and closes the sidebar.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `'Toggle navigation'` | Accessible name for the menu button. |

## Accessibility

- `Sidebar` is a `nav` with an `aria-label`; `Topbar` is a `header`. Give each landmark a
  distinct label if you add more of them.
- The menu button is a real `<button>` with `aria-expanded` reflecting the open state and
  `aria-controls` pointing at the sidebar's id, so its state and target are announced.
- Opening the sidebar shows a backdrop and enables <kbd>Esc</kbd> to close it; clicking the
  backdrop also closes it. The off-canvas panel is only rendered when relevant, so keyboard
  focus never lands on an invisible sidebar.

## Dark mode & RTL

- The shell, topbar, and sidebar use semantic tokens (`bg-background`, `bg-surface`,
  `border-border`), so they adapt to dark mode automatically.
- The panel is anchored with logical `start-0` and `border-e`, and its off-canvas offset is
  `-translate-x-full` in LTR with an `rtl:translate-x-full` counterpart, so it slides from the
  correct edge under `dir="rtl"`.
