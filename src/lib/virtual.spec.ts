import { describe, expect, it } from 'vitest'
import { virtualWindow } from './virtual'

describe('virtualWindow', () => {
  it('renders the leading rows plus overscan at the top', () => {
    const window = virtualWindow(100, 40, 0, 400, 4)
    expect(window.start).toBe(0)
    expect(window.end).toBe(14)
    expect(window.paddingTop).toBe(0)
    expect(window.paddingBottom).toBe((100 - 14) * 40)
  })

  it('shifts the window as the user scrolls', () => {
    const window = virtualWindow(100, 40, 800, 400, 4)
    expect(window.start).toBe(16)
    expect(window.end).toBe(34)
    expect(window.paddingTop).toBe(16 * 40)
  })

  it('clamps to the row count', () => {
    const window = virtualWindow(10, 40, 4000, 400, 4)
    expect(window.start).toBe(10)
    expect(window.end).toBe(10)
    expect(window.paddingTop).toBe(400)
    expect(window.paddingBottom).toBe(0)
  })

  it('handles empty and degenerate inputs', () => {
    expect(virtualWindow(0, 40, 0, 400)).toEqual({ start: 0, end: 0, paddingTop: 0, paddingBottom: 0 })
    const zeroHeight = virtualWindow(10, 0, 0, 0, 1)
    expect(zeroHeight.end).toBeGreaterThan(0)
  })
})
