import { describe, expect, it } from 'vitest'
import { shouldIgnoreRowToggle, toggleExpandedRow } from './tableInteractions'

const host = (match: string | null) => ({
  closest: (selector: string) => (selector.includes(match ?? '\u0000') ? {} : null),
})

describe('shouldIgnoreRowToggle', () => {
  it('ignores clicks that land inside an interactive element', () => {
    expect(shouldIgnoreRowToggle(host('button'))).toBe(true)
    expect(shouldIgnoreRowToggle(host('a'))).toBe(true)
    expect(shouldIgnoreRowToggle(host('input'))).toBe(true)
  })

  it('ignores clicks opted out with data-row-toggle-ignore', () => {
    expect(shouldIgnoreRowToggle(host('data-row-toggle-ignore'))).toBe(true)
  })

  it('allows clicks on plain cells and on non-elements', () => {
    expect(shouldIgnoreRowToggle(host(null))).toBe(false)
    expect(shouldIgnoreRowToggle(null)).toBe(false)
  })
})

describe('toggleExpandedRow', () => {
  it('opens one row at a time', () => {
    expect(toggleExpandedRow({}, 'r1')).toEqual({ r1: true })
    expect(toggleExpandedRow({ r2: true }, 'r1')).toEqual({ r1: true })
  })

  it('closes the open row when it is toggled again', () => {
    expect(toggleExpandedRow({ r1: true }, 'r1')).toEqual({})
  })
})
