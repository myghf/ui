# date

Pure date and time helpers used by [DatePicker](/components/date-picker). None of them read
the current clock, and `Date` values are read in the **local** time zone. The two conversion
helpers also bridge to [`@internationalized/date`](https://internationalized.date/), the
library DatePicker builds on.

## Conversion

### `dateToValue(d)`

```ts
function dateToValue(d: Date): CalendarDate
```

Converts a JavaScript `Date` to an `@internationalized/date` `CalendarDate`, keeping the
local year, month, and day and dropping the time.

| Parameter | Type | Description |
| --- | --- | --- |
| `d` | `Date` | The date to convert. Time-of-day is ignored. |

**Returns:** `CalendarDate` (month is 1-based).

```ts
import { dateToValue } from '@myghf/ui'

const value = dateToValue(new Date(2026, 7, 15, 23, 59))
// value.year === 2026, value.month === 8, value.day === 15
```

### `valueToDate(v)`

```ts
function valueToDate(v: DateValue): Date
```

Converts an `@internationalized/date` value back to a JavaScript `Date`. A `CalendarDateTime`
is resolved in the local time zone (keeping its time); a date-only value becomes local
midnight.

| Parameter | Type | Description |
| --- | --- | --- |
| `v` | `DateValue` | A `CalendarDate` or `CalendarDateTime`. |

**Returns:** `Date`.

```ts
import { CalendarDateTime } from '@internationalized/date'
import { dateToValue, valueToDate } from '@myghf/ui'

const roundTrip = valueToDate(dateToValue(new Date(2026, 7, 15)))
// → a local Date for 2026-08-15

valueToDate(new CalendarDateTime(2026, 8, 15, 9, 30)).getHours()
// → 9
```

::: info Installing the types
`@internationalized/date` ships as a dependency of `@myghf/ui`, so these helpers work out of
the box. If you annotate your own `CalendarDate`/`DateValue` variables, import the types from
`@internationalized/date` in your app.
:::

## ISO strings

### `toISODate(d)`

```ts
function toISODate(d: Date): string
```

Formats a `Date` as a zero-padded `YYYY-MM-DD` string, using local date parts. It is **not**
`toISOString()`, so it does not shift to UTC.

| Parameter | Type | Description |
| --- | --- | --- |
| `d` | `Date` | The date to format. |

**Returns:** `string` in `YYYY-MM-DD` form.

```ts
import { toISODate } from '@myghf/ui'

toISODate(new Date(2026, 2, 5)) // → '2026-03-05'
```

### `toTime(minutes)`

```ts
function toTime(minutes: number): string
```

Formats a number of minutes since midnight as a zero-padded `HH:MM` string.

| Parameter | Type | Description |
| --- | --- | --- |
| `minutes` | `number` | Minutes since midnight. |

**Returns:** `string` in `HH:MM` form. The value is not wrapped modulo 24, so `1440` formats
as `'24:00'`.

```ts
import { toTime } from '@myghf/ui'

toTime(0) // → '00:00'
toTime(545) // → '09:05'
```

### `toMinutes(time)`

```ts
function toMinutes(time: string): number
```

Parses an `HH:MM` string into minutes since midnight. A missing minute component is treated
as `0`, and a non-numeric component becomes `NaN`.

| Parameter | Type | Description |
| --- | --- | --- |
| `time` | `string` | A time in `HH:MM` form. |

**Returns:** `number` of minutes since midnight.

```ts
import { toMinutes } from '@myghf/ui'

toMinutes('09:05') // → 545
toMinutes('09') // → 540
```

## Time on a date

### `clampTime(d, time)`

```ts
function clampTime(d: Date, time: string): Date
```

Returns a **new** `Date` copied from `d` with the hours and minutes taken from `time` and the
seconds and milliseconds zeroed. `d` is not mutated.

| Parameter | Type | Description |
| --- | --- | --- |
| `d` | `Date` | The source date; its year, month, and day are kept. |
| `time` | `string` | The time to apply, in `HH:MM` form. |

**Returns:** a new `Date`.

```ts
import { clampTime } from '@myghf/ui'

const out = clampTime(new Date(2026, 7, 15, 23, 59, 59), '08:30')
// out.getHours() === 8, out.getMinutes() === 30, out.getSeconds() === 0
```

## Ranges

### `sortRange(a, b)`

```ts
function sortRange(a: Date, b: Date): [Date, Date]
function sortRange(a: Date | null, b: Date | null): [Date | null, Date | null]
```

Orders a pair of dates ascending by timestamp. If **either** value is `null`, the pair is
returned unchanged (`[a, b]`) rather than partially sorted, so a half-filled range keeps its
shape.

| Parameter | Type | Description |
| --- | --- | --- |
| `a` | `Date \| null` | First endpoint. |
| `b` | `Date \| null` | Second endpoint. |

**Returns:** a `[start, end]` tuple, ascending when both are present.

```ts
import { sortRange } from '@myghf/ui'

sortRange(new Date(2026, 1, 5), new Date(2026, 1, 1))
// → [2026-02-01, 2026-02-05]

sortRange(new Date(2026, 1, 5), null)
// → [2026-02-05, null] (unchanged)
```

## Option builders

### `buildHourOptions(hourFormat)`

```ts
function buildHourOptions(hourFormat: '12' | '24'): number[]
```

Builds the hour list for a picker. `'24'` returns `0`–`23`; `'12'` returns `1`–`12`.

| Parameter | Type | Description |
| --- | --- | --- |
| `hourFormat` | `'12' \| '24'` | Which clock the options target. |

**Returns:** `number[]` — 24 entries for `'24'`, 12 for `'12'`.

```ts
import { buildHourOptions } from '@myghf/ui'

buildHourOptions('24')[0] // → 0
buildHourOptions('12')[0] // → 1
buildHourOptions('12').length // → 12
```

### `buildMinuteOptions(minuteStep)`

```ts
function buildMinuteOptions(minuteStep: number): number[]
```

Builds the minute list from `0` up to (but not including) `60` in increments of `minuteStep`.
A non-finite or non-positive step falls back to `1`, so the list is never empty.

| Parameter | Type | Description |
| --- | --- | --- |
| `minuteStep` | `number` | Increment in minutes. Values `<= 0` or non-finite become `1`. |

**Returns:** `number[]` of minutes.

```ts
import { buildMinuteOptions } from '@myghf/ui'

buildMinuteOptions(15) // → [0, 15, 30, 45]
buildMinuteOptions(7) // → [0, 7, 14, 21, 28, 35, 42, 49, 56]
buildMinuteOptions(0) // → every minute (step falls back to 1)
```

## 12/24-hour conversion

### `to12Hour(hour24)`

```ts
function to12Hour(hour24: number): { hour: number; meridiem: 'am' | 'pm' }
```

Converts a 24-hour hour to its 12-hour representation. The input is reduced modulo 24 first,
so out-of-range and negative values are handled (`-1` → 11 pm).

| Parameter | Type | Description |
| --- | --- | --- |
| `hour24` | `number` | Hour on the 24-hour clock; any integer is accepted. |

**Returns:** `{ hour: number; meridiem: 'am' \| 'pm' }`, with `hour` in `1`–`12`.

```ts
import { to12Hour } from '@myghf/ui'

to12Hour(0) // → { hour: 12, meridiem: 'am' }
to12Hour(9) // → { hour: 9, meridiem: 'am' }
to12Hour(13) // → { hour: 1, meridiem: 'pm' }
```

### `from12Hour(hour, meridiem)`

```ts
function from12Hour(hour: number, meridiem: 'am' | 'pm'): number
```

The inverse of `to12Hour`: converts a 12-hour hour plus meridiem back to the 24-hour clock.

| Parameter | Type | Description |
| --- | --- | --- |
| `hour` | `number` | Hour on the 12-hour clock; reduced modulo 12. |
| `meridiem` | `'am' \| 'pm'` | `'pm'` adds twelve hours. |

**Returns:** `number` on the 24-hour clock (`0`–`23`).

```ts
import { from12Hour } from '@myghf/ui'

from12Hour(12, 'am') // → 0
from12Hour(12, 'pm') // → 12
from12Hour(1, 'pm') // → 13
```
