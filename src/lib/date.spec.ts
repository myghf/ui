import { describe, expect, it } from 'vitest'
import { clampTime, dateToValue, sortRange, toISODate, toMinutes, toTime, valueToDate } from './date'

describe('date helpers', () => {
  it('dateToValue → CalendarDate and valueToDate roundtrip', () => {
    const d = new Date(2026, 7, 15, 0, 0, 0)
    const v = dateToValue(d)
    expect(v.year).toBe(2026)
    expect(v.month).toBe(8)
    expect(v.day).toBe(15)
    expect(valueToDate(v).toDateString()).toBe(d.toDateString())
  })

  it('toMinutes / toTime convert HH:MM', () => {
    expect(toMinutes('09:05')).toBe(545)
    expect(toTime(545)).toBe('09:05')
    expect(toTime(0)).toBe('00:00')
  })

  it('clampTime sets hours and minutes, zeroing seconds', () => {
    const out = clampTime(new Date(2026, 7, 15, 23, 59, 59), '08:30')
    expect(out.getHours()).toBe(8)
    expect(out.getMinutes()).toBe(30)
    expect(out.getSeconds()).toBe(0)
    expect(out.getDate()).toBe(15)
  })

  it('sortRange orders a Date pair ascending', () => {
    const a = new Date(2026, 1, 5)
    const b = new Date(2026, 1, 1)
    const [s, e] = sortRange(a, b)
    expect(s?.getDate()).toBe(1)
    expect(e?.getDate()).toBe(5)
  })

  it('toISODate is zero-padded YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 2, 5))).toBe('2026-03-05')
  })
})
