import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 0, 'c')).toBe('a c')
  })

  it('resolves conflicting tailwind-merge classes to the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('merges conflicting arbitrary values', () => {
    expect(cn('bg-primary-500', 'bg-error-500')).toBe('bg-error-500')
  })
})
