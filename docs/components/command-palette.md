<script setup lang="ts">
import CommandPaletteBasic from '../.vitepress/theme/demos/command-palette/basic.vue'
</script>

# CommandPalette

`CommandPalette` is a keyboard-first command launcher built on the [Dialog](/components/dialog).
Open it, type to filter a flat list of commands, and pick one with the mouse or the keyboard
(<kbd>↓</kbd>/<kbd>↑</kbd> to move, <kbd>Enter</kbd> to run, <kbd>Esc</kbd> to close).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CommandPalette, type CommandItem } from '@myghf/ui'

const open = ref(false)
const items: CommandItem[] = [
  { id: 'new-patient', label: 'New patient', group: 'Patients' },
  { id: 'settings', label: 'Settings', group: 'App' },
]
</script>

<template>
  <CommandPalette v-model:open="open" :items="items" @select="(item) => run(item.id)" />
</template>
```

<Demo>
  <CommandPaletteBasic />
</Demo>

<<< ../.vitepress/theme/demos/command-palette/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Open state. Bind with `v-model:open`. |
| `items` | `CommandItem[]` | `[]` | The commands to search. |
| `placeholder` | `string` | `'Type a command…'` | Search input placeholder. |
| `emptyLabel` | `string` | `'No results'` | Shown when nothing matches. |
| `searchLabel` | `string` | `'Search commands'` | Accessible name for the search input. |
| `title` | `string` | `'Command palette'` | Screen-reader-only dialog title. |
| `description` | `string` | `'Search for and run a command.'` | Screen-reader-only dialog description. |

### CommandItem

```ts
interface CommandItem {
  id: string
  label: string
  description?: string
  group?: string       // short trailing label, e.g. a section name
  keywords?: string[]  // extra terms to match against
  icon?: string        // Lucide icon name
}
```

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Emitted when the palette opens or closes. |
| `select` | `CommandItem` | Emitted with the chosen command; the palette then closes. |

## Accessibility

- The palette is a labelled dialog (a visually-hidden title and description), so it announces
  its purpose on open. Focus moves to the search input when it opens.
- Results are real `<button>`s in a list, so they are keyboard reachable; <kbd>↓</kbd>/<kbd>↑</kbd>
  from the input move focus into the list, and <kbd>Esc</kbd> closes the dialog and returns focus
  to whatever opened it.
- Filtering matches the label, description, and any `keywords`, so results stay reachable by
  typing alone.

## Dark mode & RTL

- The panel uses semantic tokens (`bg-surface`, `border-border`, `shadow-dialog`), so it adapts
  to dark mode automatically. Layout is logical (`text-start`, `gap`), so it mirrors correctly
  under `dir="rtl"`.
