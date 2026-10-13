# hijri

Helpers for the **Hijri (Umm al-Qura)** calendar, used by
[DatePicker](/components/date-picker) when `calendar="islamic-umalqura"`. Gregorian is the
default everywhere; these are for showing or laying out the Hijri calendar alongside it. All of
them delegate to the platform's `Intl` data, so the exact month boundaries follow the runtime's
Umm al-Qura table.

```ts
import { hijriParts, hijriMonthLabel } from '@myghf/ui'

hijriParts(new Date(2024, 6, 7)) // → { year: 1446, month: 1, day: 1 }
hijriMonthLabel(new Date(2024, 6, 7), 'en') // → 'Muharram 1446'
```

## `addDays(date, days)`

Adds whole days in local time, keeping the time of day and rolling
month and year boundaries over — unlike adding milliseconds, which
drifts across a DST change.

```ts
function addDays(date: Date, days: number): Date
```

## `hijriParts(date, locale?)`

```ts
function hijriParts(date: Date, locale?: string): { year: number; month: number; day: number }
```

The Hijri year, month (1–12), and day (1–30) for a Gregorian date. Digits are read as Latin even
for an Arabic locale, so the numbers parse.

## `startOfHijriMonth(date, locale?)`

```ts
function startOfHijriMonth(date: Date, locale?: string): Date
```

The Gregorian `Date` of day 1 of the Hijri month containing `date`.

## `hijriMonthLength(firstDay, locale?)`

```ts
function hijriMonthLength(firstDay: Date, locale?: string): number
```

The length of that month: `29` or `30`.

## `hijriMonthLabel(date, locale)`

```ts
function hijriMonthLabel(date: Date, locale: string): string
```

The localized Hijri month and year, e.g. `'Muharram 1446'`.

## `formatHijriDate(date, locale)`

```ts
function formatHijriDate(date: Date, locale: string): string
```

The localized Hijri date, e.g. `'1 Muharram 1446'`.

## Types

```ts
type CalendarSystem = 'gregory' | 'islamic-umalqura'
interface HijriParts { year: number; month: number; day: number }
```
