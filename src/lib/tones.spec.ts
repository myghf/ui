import { describe, expect, it } from 'vitest'
import { toneClasses } from './tones'

const TONES = ['info', 'success', 'warning', 'danger', 'secondary'] as const

describe('toneClasses', () => {
  it('defines soft, outline, icon and role for every tone', () => {
    for (const tone of TONES) {
      expect(toneClasses[tone].soft).toBeTruthy()
      expect(toneClasses[tone].outline).toBeTruthy()
      expect(toneClasses[tone].icon).toBeTruthy()
      expect(['alert', 'status']).toContain(toneClasses[tone].role)
    }
  })

  it('maps warning and danger to the assertive role', () => {
    expect(toneClasses.warning.role).toBe('alert')
    expect(toneClasses.danger.role).toBe('alert')
    expect(toneClasses.info.role).toBe('status')
  })

  it('gives every tinted brand tone a dark variant', () => {
    for (const tone of ['info', 'success', 'warning', 'danger'] as const) {
      expect(toneClasses[tone].soft).toMatch(/dark:/)
      expect(toneClasses[tone].outline).toMatch(/dark:/)
      expect(toneClasses[tone].icon).toMatch(/dark:/)
    }
  })
})
