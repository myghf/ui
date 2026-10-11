import { describe, expect, it } from 'vitest'
import { formatCurrency, formatNumber, formatPercent, mergeFormatOptions, toNumberOrNull } from './number'

describe('toNumberOrNull', () => {
  it('returns null for empty or invalid input', () => {
    expect(toNumberOrNull(undefined)).toBeNull()
    expect(toNumberOrNull(null)).toBeNull()
    expect(toNumberOrNull(Number.NaN)).toBeNull()
  })

  it('keeps valid numbers including zero', () => {
    expect(toNumberOrNull(0)).toBe(0)
    expect(toNumberOrNull(2.5)).toBe(2.5)
  })
})

describe('mergeFormatOptions', () => {
  it('lets explicit format options override the currency shorthand', () => {
    expect(mergeFormatOptions({ currency: 'USD', formatOptions: { maximumFractionDigits: 0 } })).toMatchObject({
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    })
  })

  it('forces integer formatting last', () => {
    expect(mergeFormatOptions({ integer: true, formatOptions: { maximumFractionDigits: 3 } })).toMatchObject({
      maximumFractionDigits: 0,
    })
  })
})

describe('formatNumber', () => {
  it('formats for a locale', () => {
    expect(formatNumber(1234.5, 'en-US')).toBe('1,234.5')
    expect(formatNumber(1234.5, 'de-DE')).toBe('1.234,5')
  })

  it('passes options through', () => {
    expect(formatNumber(1234.5, 'en-US', { maximumFractionDigits: 0 })).toBe('1,235')
  })

  it('falls back to String(value) for an invalid locale', () => {
    expect(formatNumber(10, 'not a locale!')).toBe('10')
  })
})

describe('formatCurrency', () => {
  it('formats with a currency', () => {
    expect(formatCurrency(1234.5, 'USD', 'en-US')).toContain('1,234.50')
  })
})

describe('formatPercent', () => {
  it('formats a ratio as a percentage', () => {
    expect(formatPercent(0.25, 'en-US')).toBe('25%')
  })
})
