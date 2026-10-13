import { CalendarDateTime } from '@internationalized/date'
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

  it('roundtrips every hour of the day through the 12-hour form', () => {
    for (let hour = 0; hour < 24; hour += 1) {
      const { hour: twelve, meridiem } = to12Hour(hour)
      expect(from12Hour(twelve, meridiem)).toBe(hour)
    }
  })

  it('normalizes out-of-range hours in the 12-hour form', () => {
    expect(to12Hour(24)).toEqual({ hour: 12, meridiem: 'am' })
    expect(to12Hour(-1)).toEqual({ hour: 11, meridiem: 'pm' })
    expect(from12Hour(12, 'pm')).toBe(12)
  })

  it('roundtrips the last minute of the day', () => {
    expect(toMinutes('23:59')).toBe(1439)
    expect(toTime(1439)).toBe('23:59')
    expect(toTime(60)).toBe('01:00')
  })

  it('tolerates a time string without a minutes part', () => {
    expect(toMinutes('08')).toBe(480)
  })

  it('clamps the first and last minute of the day', () => {
    expect(clampTime(new Date(2026, 7, 15), '00:00').getHours()).toBe(0)
    const last = clampTime(new Date(2026, 7, 15), '23:59')
    expect(last.getHours()).toBe(23)
    expect(last.getMinutes()).toBe(59)
  })

  it('sorts null and equal dates', () => {
    const d = new Date(2026, 7, 15)
    expect(sortRange(null, d)).toEqual([null, d])
    expect(sortRange(d, null)).toEqual([d, null])
    expect(sortRange(d, new Date(d.getTime()))).toEqual([d, d])
  })

  it('zero-pads single-digit months and days in the ISO date', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toISODate(new Date(2026, 10, 30))).toBe('2026-11-30')
  })

  it('builds minute options that stop before 60 for large steps', () => {
    expect(buildMinuteOptions(90)).toEqual([0])
    expect(buildMinuteOptions(2.5)).toHaveLength(24)
  })

  it('converts a CalendarDateTime in the local timezone', () => {
    const out = valueToDate(new CalendarDateTime(2026, 8, 15, 14, 30))
    expect(out.getFullYear()).toBe(2026)
    expect(out.getMonth()).toBe(7)
    expect(out.getDate()).toBe(15)
    expect(out.getHours()).toBe(14)
    expect(out.getMinutes()).toBe(30)
  })
})
