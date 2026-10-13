import { describe, expect, it } from 'vitest'
import { formatLocalizedDate, formatLocalizedTime, getFirstDayOfWeek, getMonthLabel, getWeekdayLabels } from './locale'

describe('getFirstDayOfWeek', () => {
  it('returns Sunday for en-US', () => expect(getFirstDayOfWeek('en-US')).toBe(0))
  it('returns Monday for en-GB and de-DE', () => {
    expect(getFirstDayOfWeek('en-GB')).toBe(1)
    expect(getFirstDayOfWeek('de-DE')).toBe(1)
  })
  it('falls back to Monday for an invalid locale', () => {
    // An underscore is not a valid language-tag separator.
    expect(getFirstDayOfWeek('not_a_locale')).toBe(1)
  })
})

describe('getWeekdayLabels', () => {
  it('returns seven labels starting on the given day', () => {
    const sun = getWeekdayLabels('en-US', 0)
    const mon = getWeekdayLabels('en-US', 1)
    expect(sun).toHaveLength(7)
    expect(sun[0]).toMatch(/^Sun/i)
    expect(mon[0]).toMatch(/^Mon/i)
  })

  it('normalizes an out-of-range week start', () => {
    // 2026-01-04 is a Sunday, so -1 (and 7) wrap to it.
    expect(getWeekdayLabels('en-US', -1)[0]).toMatch(/^Sat/i)
    expect(getWeekdayLabels('en-US', 7)[0]).toMatch(/^Sun/i)
    expect(getWeekdayLabels('en-US', -1)).toHaveLength(7)
  })
})

describe('formatting', () => {
  it('localizes the month label', () => {
    expect(getMonthLabel(new Date(2026, 0, 15), 'en-US')).toMatch(/January/i)
    expect(getMonthLabel(new Date(2026, 0, 15), 'fr-FR')).not.toBe(getMonthLabel(new Date(2026, 0, 15), 'en-US'))
  })

  it('formats a localized date', () => {
    expect(formatLocalizedDate(new Date(2026, 0, 15), 'en-US')).toContain('2026')
  })

  it('formats 24-hour and 12-hour times', () => {
    expect(formatLocalizedTime(new Date(2026, 0, 1, 9, 30), 'en-GB', '24')).toMatch(/^\d{2}:\d{2}$/)
    expect(formatLocalizedTime(new Date(2026, 0, 1, 9, 30), 'en-US', '12')).toMatch(/[AP]M/)
  })

  it('formats midnight and noon in both hour cycles', () => {
    const midnight = new Date(2026, 0, 1, 0, 30)
    const noon = new Date(2026, 0, 1, 12, 30)
    expect(formatLocalizedTime(midnight, 'en-GB', '24')).toBe('00:30')
    expect(formatLocalizedTime(noon, 'en-GB', '24')).toBe('12:30')
    expect(formatLocalizedTime(midnight, 'en-US', '12')).toMatch(/12:30\s*AM/i)
    expect(formatLocalizedTime(noon, 'en-US', '12')).toMatch(/12:30\s*PM/i)
  })

  it('formats the last minute of the day in 24-hour mode', () => {
    expect(formatLocalizedTime(new Date(2026, 0, 1, 23, 59), 'en-GB', '24')).toBe('23:59')
  })
})
