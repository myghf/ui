import { describe, expect, it } from 'vitest'
import { mergeFormatOptions, toNumberOrNull } from './number'

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
