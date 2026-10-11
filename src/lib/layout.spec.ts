import { describe, expect, it } from 'vitest'
import { ALIGN_CLASSES, COLS_CLASSES, GAP_CLASSES, JUSTIFY_CLASSES } from './layout'

describe('layout class maps', () => {
  it('defines a class for every gap', () => {
    for (const gap of ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const) {
      expect(GAP_CLASSES[gap]).toMatch(/^gap-/)
    }
  })

  it('defines a class for every alignment', () => {
    for (const align of ['start', 'center', 'end', 'stretch'] as const) {
      expect(ALIGN_CLASSES[align]).toMatch(/^items-/)
    }
  })

  it('defines a class for every justification', () => {
    for (const justify of ['start', 'center', 'end', 'between'] as const) {
      expect(JUSTIFY_CLASSES[justify]).toMatch(/^justify-/)
    }
  })

  it('defines a class for every column count', () => {
    for (const cols of [1, 2, 3, 4, 5, 6, 12] as const) {
      expect(COLS_CLASSES[cols]).toBe(`grid-cols-${cols}`)
    }
  })
})
