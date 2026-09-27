import { describe, expect, it } from 'vitest'
import { buildHourOptions, buildMinuteOptions, clampTime, dateToValue, from12Hour, sortRange, to12Hour, toISODate, toMinutes, toTime, valueToDate } from './date'

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

  it('builds 24- and 12-hour option lists', () => {
    expect(buildHourOptions('24')).toHaveLength(24)
    expect(buildHourOptions('12')).toHaveLength(12)
  })

  it('builds minute options from the step and never returns an empty list', () => {
    expect(buildMinuteOptions(15)).toEqual([0, 15, 30, 45])
    expect(buildMinuteOptions(7)).toHaveLength(9)
    expect(buildMinuteOptions(0).length).toBeGreaterThan(0)
  })

  it('converts between 12- and 24-hour representations', () => {
    expect(to12Hour(0)).toEqual({ hour: 12, meridiem: 'am' })
    expect(to12Hour(13)).toEqual({ hour: 1, meridiem: 'pm' })
    expect(from12Hour(12, 'am')).toBe(0)
    expect(from12Hour(1, 'pm')).toBe(13)
  })
})
