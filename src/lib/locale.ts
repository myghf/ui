export function getFirstDayOfWeek(locale: string): number {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const weekInfo = loc.weekInfo ?? loc.getWeekInfo?.()
    if (weekInfo && typeof weekInfo.firstDay === 'number') return weekInfo.firstDay % 7
  } catch {
    // fall through to the default
  }
  return 1
}

export function getWeekdayLabels(locale: string, weekStartsOn: number): string[] {
  const start = ((Math.trunc(weekStartsOn) % 7) + 7) % 7
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  // 2026-01-04 is a Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2026, 0, 4 + ((start + i) % 7))),
  )
}

export function getMonthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

export function formatLocalizedDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
}

export function formatLocalizedTime(date: Date, locale: string, hourFormat: '12' | '24'): string {
  const options: Intl.DateTimeFormatOptions =
    hourFormat === '24'
      ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
      : { hour: 'numeric', minute: '2-digit', hour12: true }
  return new Intl.DateTimeFormat(locale, options).format(date)
}
