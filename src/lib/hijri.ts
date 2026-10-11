export type CalendarSystem = 'gregory' | 'islamic-umalqura'

export interface HijriParts {
  year: number
  /** 1–12. */
  month: number
  /** 1–30. */
  day: number
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}\u0000${JSON.stringify(options)}`
  let cached = formatters.get(key)
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, options)
    formatters.set(key, cached)
  }
  return cached
}

/** Adds whole days in local time (unlike `new Date(ms + n*86400000)`, which breaks across DST). */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

/** The Hijri (Umm al-Qura) year, month, and day for a Gregorian date. */
export function hijriParts(date: Date, locale = 'en'): HijriParts {
  const parts = formatter(locale, {
    calendar: 'islamic-umalqura',
    // Latin digits so the values parse regardless of the locale's numbering system.
    numberingSystem: 'latn',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)
  return { year: value('year'), month: value('month'), day: value('day') }
}

/** Gregorian date of the first day of the Hijri month containing `date`. */
export function startOfHijriMonth(date: Date, locale = 'en'): Date {
  const { day } = hijriParts(date, locale)
  return addDays(date, -(day - 1))
}

/** Length of the Hijri month starting on `firstDay`: 29 or 30 days. */
export function hijriMonthLength(firstDay: Date, locale = 'en'): number {
  return hijriParts(addDays(firstDay, 29), locale).day === 30 ? 30 : 29
}

/** Localized Hijri month and year, e.g. `'Rajab 1447'`. */
export function hijriMonthLabel(date: Date, locale: string): string {
  return formatter(locale, { calendar: 'islamic-umalqura', month: 'long', year: 'numeric' }).format(date)
}

/** Localized Hijri date, e.g. `'15 Rajab 1447'`. */
export function formatHijriDate(date: Date, locale: string): string {
  return formatter(locale, { calendar: 'islamic-umalqura', dateStyle: 'medium' }).format(date)
}
