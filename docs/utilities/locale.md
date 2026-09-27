# locale

Thin wrappers over `Intl` for locale-aware labels and formatting. Pass a BCP-47 locale
string (for example `'en-US'`, `'en-GB'`, or `'ar'`); everything is computed on demand, and
no locale data is bundled beyond what the runtime already provides.

[DatePicker](/components/date-picker) uses these to render its calendar header, weekday row,
and field text.

## `getFirstDayOfWeek(locale)`

```ts
function getFirstDayOfWeek(locale: string): number
```

Returns the locale's first day of the week, read from `Intl.Locale`'s `weekInfo` (with a
`getWeekInfo()` fallback for older runtimes).

| Parameter | Type | Description |
| --- | --- | --- |
| `locale` | `string` | BCP-47 locale tag. |

**Returns:** `number` where `0` is Sunday … `6` is Saturday. When the locale is invalid or
the runtime does not expose week info, it falls back to `1` (Monday).

```ts
import { getFirstDayOfWeek } from '@myghf/ui'

getFirstDayOfWeek('en-US') // → 0 (Sunday)
getFirstDayOfWeek('en-GB') // → 1 (Monday)
getFirstDayOfWeek('de-DE') // → 1 (Monday)
```

## `getWeekdayLabels(locale, weekStartsOn)`

```ts
function getWeekdayLabels(locale: string, weekStartsOn: number): string[]
```

Builds seven short weekday labels (for example `'Sun'`, `'Mon'`) in the given locale, rotating
so the first label is `weekStartsOn`. The start index is normalised modulo 7, so negative and
out-of-range values wrap.

| Parameter | Type | Description |
| --- | --- | --- |
| `locale` | `string` | BCP-47 locale tag. |
| `weekStartsOn` | `number` | First day of the week; `0` = Sunday … `6` = Saturday. |

**Returns:** `string[]` of exactly seven labels, starting at `weekStartsOn`.

```ts
import { getFirstDayOfWeek, getWeekdayLabels } from '@myghf/ui'

const first = getFirstDayOfWeek('en-US') // 0
const labels = getWeekdayLabels('en-US', first)
// ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

getWeekdayLabels('en-GB', 1)[0] // → 'Mon'
```

## `getMonthLabel(date, locale)`

```ts
function getMonthLabel(date: Date, locale: string): string
```

Formats a long month name plus year, for a calendar header.

| Parameter | Type | Description |
| --- | --- | --- |
| `date` | `Date` | Any date in the target month. |
| `locale` | `string` | BCP-47 locale tag. |

**Returns:** `string` such as `'January 2026'`, localised to `locale`.

```ts
import { getMonthLabel } from '@myghf/ui'

getMonthLabel(new Date(2026, 0, 15), 'en-US') // → 'January 2026'
getMonthLabel(new Date(2026, 0, 15), 'fr-FR') // → 'janvier 2026'
```

## `formatLocalizedDate(date, locale)`

```ts
function formatLocalizedDate(date: Date, locale: string): string
```

Formats a date with `Intl.DateTimeFormat`'s `{ dateStyle: 'medium' }`.

| Parameter | Type | Description |
| --- | --- | --- |
| `date` | `Date` | The date to format. |
| `locale` | `string` | BCP-47 locale tag. |

**Returns:** `string` such as `'Jan 15, 2026'` (en-US) or `'15 janv. 2026'` (fr-FR).

```ts
import { formatLocalizedDate } from '@myghf/ui'

formatLocalizedDate(new Date(2026, 0, 15), 'en-US') // → 'Jan 15, 2026'
```

## `formatLocalizedTime(date, locale, hourFormat)`

```ts
function formatLocalizedTime(date: Date, locale: string, hourFormat: '12' | '24'): string
```

Formats the time of day, forcing a 12- or 24-hour clock regardless of the locale's default.

| Parameter | Type | Description |
| --- | --- | --- |
| `date` | `Date` | The date whose time is formatted. |
| `locale` | `string` | BCP-47 locale tag. |
| `hourFormat` | `'12' \| '24'` | `'24'` uses `hourCycle: 'h23'`; `'12'` uses `hour12: true`. |

**Returns:** `string` such as `'09:30'` (`'24'`) or `'9:30 AM'` (`'12'`).

```ts
import { formatLocalizedTime } from '@myghf/ui'

const at = new Date(2026, 0, 1, 9, 30)
formatLocalizedTime(at, 'en-GB', '24') // → '09:30'
formatLocalizedTime(at, 'en-US', '12') // → '9:30 AM'
```

## Notes

- These are **display** helpers only. To parse or move between `Date` and the picker's value
  types, use the [date](./date) utilities.
- Formatting depends on the runtime's ICU data. Node and modern browsers ship full ICU, so
  output matches between server and client; very small ICU builds may fall back to a default
  locale.
- Pass [DatePicker](/components/date-picker)'s `locale` prop to keep the field and this
  formatting in agreement.
