<script setup lang="ts">
import SelectButtonBasic from '../.vitepress/theme/demos/select-button/basic.vue'
</script>

# SelectButton

`SelectButton` is a segmented control: a row of mutually exclusive options with a sliding
highlight behind the selected one. It is built on reka-ui's radio group, so it exposes
`radiogroup` / `radio` semantics and arrow-key navigation.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SelectButton } from '@myghf/ui'

const view = ref('day')
const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
]
</script>

<template>
  <SelectButton v-model="view" :options="options" aria-label="Calendar view" />
</template>
```

## Examples

### Segmented options

`optionLabel` / `optionValue` name the object keys (both default to `label` / `value`). The
highlight is measured from the checked item and follows selection, resize, and option
changes.

<Demo>
  <SelectButtonBasic />
</Demo>

<<< ../.vitepress/theme/demos/select-button/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `AcceptableValue` | — | Selected value. |
| `options` | `Record<string, unknown>[]` | — | Choices, read via `optionLabel` / `optionValue`. |
| `optionLabel` | `string` | `'label'` | Key whose value is shown as an option's label. |
| `optionValue` | `string` | `'value'` | Key whose value is emitted as an option's value. |
| `disabled` | `boolean` | `false` | Disables the whole group. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown` | Emitted with the value of the newly selected option. |

## Slots

`SelectButton` renders no slots. Options are data-only.

## Exposed methods

None. `SelectButton` does not call `defineExpose`.

## Accessibility

- reka-ui renders the group with `role="radiogroup"` and each item with `role="radio"` +
  `aria-checked`, so assistive technology announces it as a single-choice set. Arrow keys
  move between options.
- Give the group an accessible name with `aria-label` or `aria-labelledby`; it renders no
  visible label. Extra attributes fall through to the group root.
  ```vue
  <SelectButton v-model="view" :options="options" aria-label="Calendar view" />
  ```
- The moving highlight is `aria-hidden` and purely decorative; selection is conveyed by
  `aria-checked`, not by the highlight alone.
- There is no `invalid` state and no size prop.

## Dark mode & RTL

- The track uses `bg-surface` with a `border-border` outline and the highlight uses
  `primary-500` with white text, so it adapts to dark mode through the shared tokens.
- The highlight is positioned from the checked item's physical `offsetLeft` / `offsetTop`,
  which stays correct when the flex row mirrors under RTL — the measured box matches the
  item's rendered position. Items use symmetric padding and no physical directional
  utilities.
