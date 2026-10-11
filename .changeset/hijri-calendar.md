---
'@myghf/ui': minor
---

Add Hijri (Umm al-Qura) calendar support to DatePicker

- New `calendar` prop (`'gregory' | 'islamic-umalqura'`, default `'gregory'`) lays the grid out,
  labels the month, numbers the days, and formats the selected date in the chosen calendar. The
  emitted `modelValue` stays a Gregorian `Date`.
- New hijri utilities — `addDays`, `hijriParts`, `startOfHijriMonth`, `hijriMonthLength`,
  `hijriMonthLabel`, `formatHijriDate` (and the `CalendarSystem` / `HijriParts` types) — backed by
  the platform's `Intl` Umm al-Qura data. Exported from `@myghf/ui` and auto-imported by the Nuxt
  module.
