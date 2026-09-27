import { describe, expect, it } from 'vitest'
import { formatLocalizedDate, formatLocalizedTime, getFirstDayOfWeek, getMonthLabel, getWeekdayLabels } from './locale'

describe('getFirstDayOfWeek', () => {
  it('returns Sunday for en-US', () => expect(getFirstDayOfWeek('en-US')).toBe(0))
  it('returns Monday for en-GB and de-DE', () => {
    expect(getFirstDayOfWeek('en-GB')).toBe(1)
    expect(getFirstDayOfWeek('de-DE')).toBe(1)
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
})
