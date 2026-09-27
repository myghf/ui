<script setup lang="ts">
import DropdownMenuBasic from '../.vitepress/theme/demos/dropdown-menu/basic.vue'
import DropdownMenuAlignment from '../.vitepress/theme/demos/dropdown-menu/alignment.vue'
import DropdownMenuGrouped from '../.vitepress/theme/demos/dropdown-menu/grouped.vue'
</script>

# DropdownMenu

`DropdownMenu` is a set of composable pieces — root, trigger, content, item, separator,
label, and group — built on reka-ui's menu primitive. The root coordinates open state; the
trigger opens the menu; the content is portalled; each item emits `select`; and the
separator, label, and group structure a longer menu.

```vue
<script setup lang="ts">
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@myghf/ui'

function doEdit() {}
function doDelete() {}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="outline">Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>File</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem icon="file-pen" @select="doEdit">Edit</DropdownMenuItem>
        <DropdownMenuItem icon="copy">Duplicate</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem icon="trash-2" variant="destructive" @select="doDelete">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

## Examples

### Basic menu

Compose the trigger with a real control (here, `Button`). Use `variant="destructive"` on
items that remove or destroy something.

<Demo>
  <DropdownMenuBasic />
</Demo>

<<< ../.vitepress/theme/demos/dropdown-menu/basic.vue

### Alignment and offset

`align` chooses how the content lines up with the trigger (`start` / `center` / `end`),
and `sideOffset` sets the gap in pixels.

<Demo>
  <DropdownMenuAlignment />
</Demo>

<<< ../.vitepress/theme/demos/dropdown-menu/alignment.vue

### Groups, labels, and icons

Use `DropdownMenuLabel` for a section caption, `DropdownMenuGroup` to group related items
(announced as a `role="group"`), and `DropdownMenuSeparator` for a divider between
sections. Items take an optional leading `icon` and a `disabled` flag; a disabled item is
dimmed, skipped by keyboard navigation, and does not emit `select`.

<Demo>
  <DropdownMenuGrouped />
</Demo>

<<< ../.vitepress/theme/demos/dropdown-menu/grouped.vue

## Props

### `DropdownMenu`

The root declares no props of its own. Extra attributes — including reka's `open`,
`defaultOpen`, `modal`, and `dir` — fall through to `DropdownMenuRoot` via `$attrs`. Use
`v-model:open` for a controlled menu.

### `DropdownMenuTrigger`

No props. It renders reka's trigger through `as-child` with `focus-on-select` enabled, so
the single element in its default slot becomes the trigger and regains focus after a
selection.

### `DropdownMenuContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment of the content relative to the trigger. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side the content is placed on. |
| `sideOffset` | `number` | `4` | Distance between the trigger and the content, in pixels. |

The content renders inside reka's portal, so it is appended to `<body>` rather than to the
component's place in the DOM.

### `DropdownMenuItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive'` | `'default'` | `destructive` colours the label with the error token to signal a risky action. |
| `icon` | `string` | — | Optional leading lucide icon name. Rendered `aria-hidden` and decorative. |
| `disabled` | `boolean` | `false` | Dims the item, skips it in keyboard navigation, and suppresses its `select` event. |

### `DropdownMenuSeparator`

No props. Renders a divider (`role="separator"`) between groups of items.

### `DropdownMenuLabel`

No props. Renders a muted section caption. It is a reka menu label, so it is not focusable
and cannot be selected.

### `DropdownMenuGroup`

No props. Renders a `role="group"` wrapper for related items; it is itself not focusable.

## Events

| Event | On | Payload | Description |
| --- | --- | --- | --- |
| `update:open` | `DropdownMenu` | `boolean` | Emitted when the menu opens or closes. |
| `select` | `DropdownMenuItem` | — | Emitted when the item is chosen (pointer or keyboard). Not emitted while the item is `disabled`. |

## Slots

| Component | Slot | Description |
| --- | --- | --- |
| `DropdownMenu` | `default` | The trigger and content. |
| `DropdownMenuTrigger` | `default` | The single trigger element. |
| `DropdownMenuContent` | `default` | The menu items. |
| `DropdownMenuItem` | `default` | The item's content (text, shortcut hint). Use the `icon` prop, not a slotted icon, when you want the leading-icon spacing. |
| `DropdownMenuLabel` | `default` | The section caption text. |
| `DropdownMenuGroup` | `default` | The group's items. |
| `DropdownMenuSeparator` | — | No slot; it renders a fixed divider. |

There are no named slots.

## Exposed methods

None. No part of `DropdownMenu` calls `defineExpose`; drive state with `v-model:open` and
react to `select` on the items.

## Accessibility

- reka-ui supplies the menu semantics: the trigger exposes `aria-haspopup="menu"` and
  `aria-expanded`, and the content is a `role="menu"` with roving focus. Arrow keys move
  between items, typeahead jumps to an item by its text, and <kbd>Esc</kbd> closes the
  menu and returns focus to the trigger.
- `DropdownMenuTrigger` sets `focus-on-select`, so focus lands back on the trigger after
  an item is chosen — important for keyboard users.
- **Name the trigger.** `DropdownMenuTrigger` renders no visible label of its own; when
  the slot is icon-only, give it an `aria-label`:
  ```vue
  <DropdownMenuTrigger>
    <Button size="icon" aria-label="More actions"><Icon name="ellipsis" /></Button>
  </DropdownMenuTrigger>
  ```
- `variant="destructive"` only changes the colour. Reinforce the meaning in the label
  ("Delete") and add a confirmation step for irreversible actions.
- `DropdownMenuLabel` captions a section and is not focusable; `DropdownMenuGroup` adds
  `role="group"`, so assistive technology can treat related items as a unit.
  `DropdownMenuSeparator` exposes `role="separator"` as a structural divider.
- `disabled` uses reka's disabled semantics: the item is dimmed, skipped when arrowing
  through the menu, and its `select` is suppressed — do not rely on it to hide a
  destructive action the user should not see.
- Items are menu items, not links. For navigation, handle `select` and route manually (or
  render your own anchor inside the item and keep the menu open semantics in mind).

## Dark mode & RTL

- The content uses semantic tokens (`bg-surface`, `border-border`, `text-foreground`,
  `shadow-popover`); highlighted and disabled items use `surface-muted` and opacity, so
  both themes are covered.
- Item layout is logical: an inline-flex row with `gap-2` and symmetric padding, so it
  needs no RTL override. `DropdownMenuContent`'s `align` and `side` are resolved by
  reka against the trigger, so placement follows the document direction.
