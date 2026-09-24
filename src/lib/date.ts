import { CalendarDate, CalendarDateTime, getLocalTimeZone, type DateValue } from '@internationalized/date'

export function dateToValue(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function valueToDate(v: DateValue): Date {
  if (v instanceof CalendarDateTime) return v.toDate(getLocalTimeZone())
  return new Date(v.year, v.month - 1, v.day)
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function toTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function clampTime(d: Date, time: string): Date {
  const out = new Date(d)
  out.setHours(Math.floor(toMinutes(time) / 60), toMinutes(time) % 60, 0, 0)
  return out
}

export function sortRange(a: Date, b: Date): [Date, Date]
export function sortRange(a: Date | null, b: Date | null): [Date | null, Date | null]
export function sortRange(a: Date | null, b: Date | null): [Date | null, Date | null] {
  if (!a || !b) return [a, b]
  return a.getTime() <= b.getTime() ? [a, b] : [b, a]
}

export function toISODate(d: Date): string {
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${d.getFullYear()}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
