<script setup lang="ts">
import ButtonVariants from '../.vitepress/theme/demos/button/variants.vue'
import ButtonSizes from '../.vitepress/theme/demos/button/sizes.vue'
import ButtonIcons from '../.vitepress/theme/demos/button/icons.vue'
import ButtonRtl from '../.vitepress/theme/demos/button/rtl.vue'
</script>

# Button

`Button` is the primary action control. It renders a native `<button>` styled from the
design tokens, with five visual variants, five sizes, optional leading/trailing icons, and
built-in `loading` and `disabled` states.

```vue
<script setup lang="ts">
import { Button } from '@myghf/ui'
</script>

<template>
  <Button>Save</Button>
  <Button variant="outline" size="sm" icon="download">Export</Button>
  <Button variant="destructive" loading>Deleting…</Button>
</template>
```

## Examples

### Variants

Five variants cover the hierarchy of actions: `default` for the primary action,
`secondary` for a supporting one, `destructive` for irreversible actions, and
`outline`/`ghost` for lower-emphasis controls.

<Demo>
  <ButtonVariants />
</Demo>

<<< ../.vitepress/theme/demos/button/variants.vue

### Sizes and states

`sm`, `default`, and `lg` set the control height; `icon` and `icon-sm` are square for
icon-only buttons. `loading` shows a leading spinner and disables the button while keeping
the label visible, and `label` supplies the text without a slot.

<Demo>
  <ButtonSizes />
</Demo>

<<< ../.vitepress/theme/demos/button/sizes.vue

### Icons and loading

`icon` renders a leading lucide icon, `iconTrailing` adds one after the label, and
`iconPos="end"` moves the `icon` to the trailing edge. Icons are decorative
(`aria-hidden`), so an icon-only button still needs its own `aria-label`. While `loading`
is `true`, a leading `icon` is replaced by a spinner, `iconTrailing` (and an `icon` with
`iconPos="end"`) still renders, and the label stays visible so the button keeps its
accessible name.

<Demo>
  <ButtonIcons />
</Demo>

<<< ../.vitepress/theme/demos/button/icons.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost'` | `'default'` | Visual style. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-sm'` | `'default'` | Control height and padding. `icon` and `icon-sm` render a square button. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. Defaults to `button` so it never submits a form by accident. |
| `disabled` | `boolean` | `false` | Disables the button and blocks pointer/keyboard interaction. |
| `loading` | `boolean` | `false` | Shows a leading spinner, sets `aria-busy="true"` and `data-loading`, and disables the button while work is in flight. The label stays visible. |
| `label` | `string` | — | Text label; equivalent to the default slot. PrimeVue parity for the app migration. |
| `icon` | `string` | — | Leading lucide icon name. Replaced by the spinner while `loading`, unless `iconPos="end"`. |
| `iconTrailing` | `string` | — | Trailing lucide icon name. Implies end placement and is still rendered while `loading`. |
| `iconPos` | `'start' \| 'end'` | `'start'` | Edge the `icon` renders on. `end` places it after the label, equivalent to `iconTrailing`. |

## Events

`Button` declares no custom events. It renders a native `<button>`, so native listeners
such as `@click` fall through via attribute inheritance. Both `disabled` and `loading`
disable the element, so it does not fire while work is in flight.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button content (also fed by the `label` prop). Kept visible while `loading`; a spinner is prepended to it. |

There are no named slots.

## Exposed methods

None. `Button` does not call `defineExpose`.

## Accessibility

- The base style includes a visible focus ring (`focus-visible:ring-2` in
  `primary-500`, offset against the background), so keyboard users can always see focus.
- The default `type="button"` avoids accidental form submits. Set `type="submit"`
  explicitly when the button should submit.
- `disabled` sets the native `disabled` attribute, so the button is removed from the tab
  order and does not respond to clicks while disabled.
- The loading spinner is `aria-hidden="true"` and decorative. Because the label stays
  rendered, the button keeps its accessible name while `loading`, and `loading` sets
  `aria-busy="true"` so assistive technology can announce that work is in progress.
- A trailing icon still renders while `loading` (only the leading icon is replaced by the
  spinner), so avoid a trailing glyph that implies a state the button is not in.
- **Icon-only buttons need a name.** Use `size="icon"` (or `icon-sm`) with `aria-label`:
  ```vue
  <Button size="icon" aria-label="Search"><Icon name="search" /></Button>
  ```
- Do not rely on colour alone to convey meaning; a destructive action should also say so
  in its label.

## Dark mode & RTL

- `outline` and `ghost` style from semantic tokens (`bg-surface`, `text-foreground`,
  `border-border`, `hover:bg-surface-muted`), so they adapt to dark mode automatically.
- `default`, `secondary`, and `destructive` use brand-scale backgrounds with white text;
  brand scales do not change in dark mode, so these are identical in both themes. The
  focus-ring offset uses `dark:focus-visible:ring-offset-background` so the ring stays
  visible on dark surfaces.
- Buttons are direction-neutral: sizes use symmetric `px-*` padding and the base uses
  `gap-2`, an inline-flex layout, and `whitespace-nowrap`. No logical-property overrides
  are required.

<Demo>
  <ButtonRtl />
</Demo>

<<< ../.vitepress/theme/demos/button/rtl.vue
