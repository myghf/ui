<script setup lang="ts">
import DatePickerDate from '../.vitepress/theme/demos/date-picker/date.vue'
import DatePickerModes from '../.vitepress/theme/demos/date-picker/modes.vue'
</script>

# DatePicker

`DatePicker` is a calendar field with three modes — a single `date`, a `range`, or a
`datetime` — built on reka-ui's popover. It localizes its month, weekday, and time labels
through `Intl`, and each text label can be overridden per instance.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@myghf/ui'

const date = ref<Date | null>(null)
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

## Examples

### Single date

The trigger shows the localized date, or the placeholder while empty. Selecting a day
commits it and closes the popover; a Clear action appears once a value exists.

<Demo>
  <DatePickerDate />
</Demo>

<<< ../.vitepress/theme/demos/date-picker/date.vue

### Range and date-time modes

`mode="range"` returns a `[start, end]` tuple (ordered, regardless of click order).
`mode="datetime"` adds an hour/minute picker and commits only when Apply is pressed;
`hourFormat`, `minuteStep`, and `locale` shape that picker.

<Demo>
  <DatePickerModes />
</Demo>

<<< ../.vitepress/theme/demos/date-picker/modes.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'date' \| 'range' \| 'datetime'` | `'date'` | Picker behaviour: single day, a start–end range, or a day plus time. |
| `modelValue` | `Date \| [Date, Date] \| null` | — | Selected value: a `Date` for `date`/`datetime`, a `[start, end]` tuple for `range`, `null` when empty. |
| `placeholder` | `string` | — | Trigger text while empty. **Deprecated** — prefer `labels.placeholder`; a `labels.placeholder` value wins over it. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `invalid` | `boolean` | `false` | Applies the error border. Visual only; it does not set `aria-invalid`. |
| `size` | `'sm' \| 'default'` | `'default'` | Trigger height. |
| `inputId` | `string` | — | Applied to the trigger button so an external `<label for>` matches. |
| `hourFormat` | `'12' \| '24'` | `'24'` | Time format in `datetime` mode. `'12'` also renders an AM/PM control. |
| `minuteStep` | `number` | `1` | Minute interval in `datetime` mode; clamped to `1`–`30`. |
| `locale` | `string` | runtime locale | BCP-47 locale for month, weekday, and time formatting. Resolved from `Intl.DateTimeFormat` at setup, falling back to `'en'`. |
| `labels` | `Partial<DatePickerLabels>` | — | Per-instance text overrides; merged over the locale defaults. |
| `weekStartsOn` | `number` | from locale | First day of the week (`0` = Sunday … `6` = Saturday). Defaults to the locale's week info, falling back to Monday. |
| `defaultOpen` | `boolean` | `false` | Opens the popover on mount. Useful for demos and tests. |

### `labels` keys

`labels` accepts any subset of: `placeholder`, `previousMonth`, `nextMonth`, `clear`,
`apply`, `today`, `time`, `hour`, `minute`, `am`, `pm`. Built-in translations ship for
`en`, `fr`, `es`, `de`, and `ar`; other locales fall back to English. `today` is part of
the type for parity but is not currently rendered by the component.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `Date \| [Date, Date] \| null` | Emitted on selection. `range` waits for both ends; `datetime` waits for Apply; Clear emits `null`. |

## Slots

Every label has a matching slot, each taking no props. A non-empty slot's text wins over
both `labels` and the locale default:

| Slot | Description |
| --- | --- |
| `label-placeholder` | Trigger text while empty. |
| `label-previousMonth` | Accessible name of the previous-month button. |
| `label-nextMonth` | Accessible name of the next-month button. |
| `label-clear` | Clear action text. |
| `label-apply` | Apply action text (`datetime` mode). |
| `label-today` | Reserved; not currently rendered. |
| `label-time` | Accessible name of the time group and meridiem select. |
| `label-hour` | Accessible name of the hour select. |
| `label-minute` | Accessible name of the minute select. |
| `label-am` / `label-pm` | AM / PM option text (`hourFormat="12"`). |

## Exposed methods

None. `DatePicker` does not call `defineExpose`.

## Accessibility

- The trigger is a real `<button>` with popup semantics from reka-ui (`aria-haspopup`,
  `aria-expanded`); the popover manages focus and closes on <kbd>Esc</kbd>.
- Previous/next month buttons carry `aria-label`s from `previousMonth` / `nextMonth`, and the
  time selects are labelled from `time` / `hour` / `minute`.
- **Day cells are announced as bare numbers.** Each day is a button whose text is just the
  day of the month, with no full-date `aria-label`, so a screen reader reads "27" rather than
  "27 September 2026". This is a known gap — supply surrounding context or an external
  readout if the full date must be announced.
- `invalid` only changes colour; it does **not** set `aria-invalid`. Add it to the trigger via
  a fall-through attribute if needed.
- For an external `<label for>`, pass `inputId` to match the label's `for` (the trigger is a
  button; associating via `aria-labelledby` is also acceptable).

## Dark mode & RTL

- The popover and trigger use semantic tokens (`bg-surface`, `text-foreground`,
  `border-border`, `shadow-popover`). The in-range days use `primary-100` /
  `primary-800` with explicit `dark:bg-primary-900/40 dark:text-primary-200` variants, and the
  selected endpoints use `primary-500` with white text, so both themes stay legible.
- The navigation chevrons use `rtl:rotate-180`, so "previous" and "next" point the correct way
  under RTL. The calendar grid and time controls are direction-neutral.
