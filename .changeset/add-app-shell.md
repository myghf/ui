---
'@myghf/ui': minor
---

Add the app shell: `AppShell`, `Sidebar`, `Topbar`

`AppShell` arranges a topbar, sidebar, and main content. On large screens the sidebar is
docked; below the `lg` breakpoint `collapsible` (default) turns it into an off-canvas panel
that `Topbar` opens with a menu button. The three share an injection context, so the button
carries `aria-expanded`/`aria-controls` targeting the sidebar's id, the backdrop and <kbd>Esc</kbd>
close it, and the off-canvas offset mirrors under RTL. Exported from `@myghf/ui` and
auto-imported by the Nuxt module.
