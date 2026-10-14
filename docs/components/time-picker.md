<script setup lang="ts">
import TimeFormats from '../.vitepress/theme/demos/time-picker/formats.vue'
import TimeBasic from '../.vitepress/theme/demos/time-picker/time.vue'
</script>

# TimePicker

`TimePicker` is a time-only field built on reka-ui's popover — the time section of
`DatePicker`'s `datetime` mode, standalone. It emits an `HH:MM` string, localizes
its display and labels through `Intl`, and each text label can be overridden per
instance.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from '@myghf/ui'

const appointment = ref<string | null>(null)
</script>

<template>
  <TimePicker v-model="appointment" />
</template>
```

## Examples

### Basic

The trigger shows the localized time, or the placeholder while empty. Selecting an
hour and minute and pressing Apply commits the value and closes the popover; a
Clear action emits `null`.

<Demo>
  <TimeBasic />
</Demo>

<<< ../.vitepress/theme/demos/time-picker/time.vue

### 12-hour format and minute steps

`hourFormat="12"` renders an AM/PM control and formats the trigger accordingly.
`minuteStep` controls the minute interval; it is clamped to `1`–`30`.

<Demo>
  <TimeFormats />
</Demo>

<<< ../.vitepress/theme/demos/time-picker/formats.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | — | Selected value as an `HH:MM` string, or `null` when empty. |
| `placeholder` | `string` | — | Trigger text while empty. **Deprecated** — prefer `labels.placeholder`; a `labels.placeholder` value wins over it. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `invalid` | `boolean` | `false` | Applies the error border. Falls through to the `FormField` context when omitted. The trigger is a button, so `aria-invalid` is not set — the `aria-describedby` association carries the message. |
| `size` | `'sm' \| 'default'` | `'default'` | Trigger height. |
| `inputId` | `string` | — | Applied to the trigger button so an external `<label for>` matches. |
| `hourFormat` | `'12' \| '24'` | `'24'` | Time format. `'12'` also renders an AM/PM control. |
| `minuteStep` | `number` | `1` | Minute interval; clamped to `1`–`30`. |
| `locale` | `string` | runtime locale | BCP-47 locale for time formatting and label defaults. Resolved from `Intl.DateTimeFormat` at setup, falling back to `'en'`. |
| `labels` | `Partial<TimeLabels>` | — | Per-instance text overrides; merged over the locale defaults. |
| `defaultOpen` | `boolean` | `false` | Opens the popover on mount. Useful for demos and tests. |

### `labels` keys

`labels` accepts any subset of: `placeholder`, `clear`, `apply`, `time`, `hour`,
`minute`, `am`, `pm`. Built-in translations ship for `en`, `fr`, `es`, `de`, and
`ar`; other locales fall back to English.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | Emitted when Apply or Clear is pressed. Apply emits the `HH:MM` string; Clear emits `null`. |

## Slots

Every label has a matching slot, each taking no props. A non-empty slot's text wins over
both `labels` and the locale default:

| Slot | Description |
| --- | --- |
| `label-placeholder` | Trigger text while empty. |
| `label-clear` | Clear action text. |
| `label-apply` | Apply action text. |
| `label-time` | Accessible name of the time group and the meridiem select. |
| `label-hour` | Accessible name of the hour select. |
| `label-minute` | Accessible name of the minute select. |
| `label-am` / `label-pm` | AM / PM option text (`hourFormat="12"`). |

## Exposed methods

| Method | Description |
| --- | --- |
| `focus()` | Focuses the trigger button. |

## Accessibility

- The trigger is a real `<button>` with popup semantics from reka-ui (`aria-haspopup`,
  `aria-expanded`); the popover manages focus and closes on <kbd>Esc</kbd>.
- The hour, minute, and meridiem selects are labelled from `hour` / `minute` / `time`,
  and grouped under a `role="group"` named from `time`.
- `invalid` only changes colour; it does **not** set `aria-invalid`. Add it to the trigger
  via a fall-through attribute if needed.
- For an external `<label for>`, pass `inputId` to match the label's `for` (the trigger is
  a button; associating via `aria-labelledby` is also acceptable).

## Dark mode & RTL

- The popover and trigger use semantic tokens (`bg-surface`, `text-foreground`,
  `border-border`, `shadow-popover`), so both themes stay legible.
- The selects and buttons are direction-neutral, so the control works under RTL without
  adjustment.
