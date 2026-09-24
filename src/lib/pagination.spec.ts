import { describe, expect, it } from 'vitest'
import { pageRange, pageWindow, totalPages } from './pagination'

describe('pagination helpers', () => {
  it('reports the visible 1-based range', () => {
    expect(pageRange(0, 10, 42)).toEqual({ from: 1, to: 10, total: 42 })
    expect(pageRange(4, 10, 42)).toEqual({ from: 41, to: 42, total: 42 })
    expect(pageRange(0, 10, 0)).toEqual({ from: 0, to: 0, total: 0 })
  })

  it('counts pages, always at least one', () => {
    expect(totalPages(0, 10)).toBe(1)
    expect(totalPages(10, 10)).toBe(1)
    expect(totalPages(11, 10)).toBe(2)
  })

  it('windows page numbers around the current page', () => {
    expect(pageWindow(0, 10, 5)).toEqual([1, 2, 3, 4, 5])
    expect(pageWindow(4, 10, 5)).toEqual([3, 4, 5, 6, 7])
    expect(pageWindow(9, 10, 5)).toEqual([6, 7, 8, 9, 10])
    expect(pageWindow(0, 2, 5)).toEqual([1, 2])
  })
})
