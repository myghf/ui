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
})

describe('hijriParts', () => {
  it('maps a known Gregorian date to its Hijri parts', () => {
    // 1 Muharram 1446 AH ≈ 7 July 2024.
    expect(hijriParts(new Date(2024, 6, 7), 'en')).toEqual({ year: 1446, month: 1, day: 1 })
  })

  it('reads latin digits even for an Arabic locale', () => {
    expect(hijriParts(new Date(2024, 6, 7), 'ar-EG').year).toBe(1446)
  })
})

describe('startOfHijriMonth', () => {
  it('returns the Gregorian date of Hijri day 1', () => {
    const start = startOfHijriMonth(new Date(2024, 6, 20), 'en')
    expect(hijriParts(start, 'en').day).toBe(1)
    expect(start.getTime()).toBeLessThanOrEqual(new Date(2024, 6, 20).getTime())
  })
})

describe('hijriMonthLength', () => {
  it('is 29 or 30 days', () => {
    const start = startOfHijriMonth(new Date(2024, 6, 7), 'en')
    expect([29, 30]).toContain(hijriMonthLength(start, 'en'))
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
