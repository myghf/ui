import { describe, expect, it } from 'vitest'
import {
  addDays,
  formatHijriDate,
  hijriMonthLabel,
  hijriMonthLength,
  hijriParts,
  startOfHijriMonth,
} from './hijri'

describe('addDays', () => {
  it('adds and subtracts whole days in local time', () => {
    expect(addDays(new Date(2026, 0, 31), 1).getDate()).toBe(1)
    expect(addDays(new Date(2026, 0, 1), -1).getDate()).toBe(31)
    expect(addDays(new Date(2026, 0, 1), -1).getMonth()).toBe(11)
  })

  it('rolls over a leap-year February', () => {
    expect(addDays(new Date(2024, 1, 28), 1).getDate()).toBe(29)
    const nonLeap = addDays(new Date(2023, 1, 28), 1)
    expect(nonLeap.getDate()).toBe(1)
    expect(nonLeap.getMonth()).toBe(2)
  })

  it('keeps the wall-clock time when adding days', () => {
    // Calendar arithmetic, not millisecond arithmetic, so the
    // time of day survives a daylight-saving transition.
    const next = addDays(new Date(2026, 2, 8, 12, 30, 15), 1)
    expect([next.getHours(), next.getMinutes(), next.getSeconds()]).toEqual([
      12, 30, 15,
    ])
  })
})

describe('hijriParts', () => {
  it('maps a known Gregorian date to its Hijri parts', () => {
    // 1 Muharram 1446 AH ≈ 7 July 2024.
    expect(hijriParts(new Date(2024, 6, 7), 'en')).toEqual({ year: 1446, month: 1, day: 1 })
  })

  it('reads latin digits even for an Arabic locale', () => {
    expect(hijriParts(new Date(2024, 6, 7), 'ar-EG').year).toBe(1446)
  })

  it('crosses the Hijri year boundary', () => {
    // 2024-07-06 is the last day of 1445; the next day is
    // 1 Muharram 1446.
    const lastOf1445 = hijriParts(new Date(2024, 6, 6), 'en')
    expect(lastOf1445.year).toBe(1445)
    expect(lastOf1445.month).toBe(12)
    expect(hijriParts(new Date(2024, 6, 7), 'en')).toEqual({
      year: 1446,
      month: 1,
      day: 1,
    })
  })
})

describe('startOfHijriMonth', () => {
  it('returns the Gregorian date of Hijri day 1', () => {
    const start = startOfHijriMonth(new Date(2024, 6, 20), 'en')
    expect(hijriParts(start, 'en').day).toBe(1)
    expect(start.getTime()).toBeLessThanOrEqual(new Date(2024, 6, 20).getTime())
  })

  it('is the date itself on Hijri day 1', () => {
    const first = new Date(2024, 6, 7)
    expect(startOfHijriMonth(first, 'en').getTime()).toBe(first.getTime())
  })
})

describe('hijriMonthLength', () => {
  it('is 29 or 30 days', () => {
    const start = startOfHijriMonth(new Date(2024, 6, 7), 'en')
    expect([29, 30]).toContain(hijriMonthLength(start, 'en'))
  })

  it('ends on the day before the next Hijri month starts', () => {
    const start = startOfHijriMonth(new Date(2024, 8, 1), 'en')
    const length = hijriMonthLength(start, 'en')
    const lastDay = hijriParts(addDays(start, length - 1), 'en')
    const nextDay = hijriParts(addDays(start, length), 'en')
    expect(nextDay.day).toBe(1)
    expect(nextDay.month).not.toBe(lastDay.month)
  })

  it('walks a full Hijri year month by month', () => {
    let start = startOfHijriMonth(new Date(2024, 6, 7), 'en')
    let expectedMonth = 1
    for (let i = 0; i < 12; i += 1) {
      expect(hijriParts(start, 'en').month).toBe(expectedMonth)
      const length = hijriMonthLength(start, 'en')
      expect([29, 30]).toContain(length)
      expect(hijriParts(addDays(start, length), 'en').day).toBe(1)
      start = addDays(start, length)
      expectedMonth = (expectedMonth % 12) + 1
    }
    // Twelve Hijri months are about eleven days short of a
    // Gregorian year, so the walk ends the following June.
    expect(start.getFullYear()).toBe(2025)
  })
})

describe('hijriMonthLabel', () => {
  it('labels the month with its Hijri year', () => {
    expect(hijriMonthLabel(new Date(2024, 6, 7), 'en')).toContain('1446')
  })
})

describe('formatHijriDate', () => {
  it('localizes a Hijri date', () => {
    const label = formatHijriDate(new Date(2024, 6, 7), 'en')
    expect(label).toContain('1446')
    expect(label).not.toBe(formatHijriDate(new Date(2024, 6, 7), 'ar-EG'))
  })
})
