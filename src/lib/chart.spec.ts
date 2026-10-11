import { describe, expect, it } from 'vitest'
import { areaPath, barRects, linePath } from './chart'

const size = { width: 100, height: 40 }

describe('linePath', () => {
  it('returns empty for no data', () => {
    expect(linePath([], size)).toBe('')
  })

  it('builds a path from the values', () => {
    const path = linePath([1, 3, 2, 5], size)
    expect(path.startsWith('M')).toBe(true)
    expect(path).toContain('C') // monotone curve segments
  })

  it('handles a flat series without dividing by zero', () => {
    const path = linePath([2, 2, 2], size)
    expect(path.startsWith('M')).toBe(true)
    expect(path).not.toContain('NaN')
  })
})

describe('areaPath', () => {
  it('returns empty for no data', () => {
    expect(areaPath([], size)).toBe('')
  })

  it('closes the path back to the baseline', () => {
    const path = areaPath([1, 2, 3], size)
    expect(path.startsWith('M')).toBe(true)
    expect(path.endsWith('Z')).toBe(true)
  })
})

describe('barRects', () => {
  it('returns empty for no data', () => {
    expect(barRects([], size)).toEqual([])
  })

  it('returns one rect per value inside the box', () => {
    const rects = barRects([4, 8, 2], size)
    expect(rects).toHaveLength(3)
    for (const rect of rects) {
      expect(rect.x).toBeGreaterThanOrEqual(0)
      expect(rect.x + rect.width).toBeLessThanOrEqual(size.width)
      expect(rect.y).toBeGreaterThanOrEqual(0)
      expect(rect.height).toBeGreaterThanOrEqual(0)
    }
    // The tallest bar reaches the top of the plot area.
    expect(Math.min(...rects.map((rect) => rect.y))).toBeLessThan(size.height / 2)
  })

  it('handles all-zero data', () => {
    const rects = barRects([0, 0], size)
    expect(rects.every((rect) => rect.height >= 0)).toBe(true)
  })
})
