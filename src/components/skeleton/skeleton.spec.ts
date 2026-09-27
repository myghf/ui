// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('applies the pulse animation and muted surface tokens', () => {
    const wrapper = mount(Skeleton)
    const classes = wrapper.classes()
    expect(classes).toContain('animate-pulse')
    expect(classes).toContain('bg-surface-muted')
  })

  it('defaults to the medium rounded corner', () => {
    expect(mount(Skeleton).classes()).toContain('rounded-md')
  })

  it('maps each rounded variant to its utility class', () => {
    const cases = [
      ['sm', 'rounded-sm'],
      ['md', 'rounded-md'],
      ['lg', 'rounded-lg'],
      ['full', 'rounded-full'],
    ] as const

    for (const [variant, expected] of cases) {
      const classes = mount(Skeleton, { props: { rounded: variant } }).classes()
      expect(classes, `rounded="${variant}"`).toContain(expected)
    }
  })

  it('leaves the corners square for rounded="none"', () => {
    const classes = mount(Skeleton, { props: { rounded: 'none' } }).classes()
    for (const rounded of ['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full']) {
      expect(classes).not.toContain(rounded)
    }
  })

  it('turns width and height props into inline styles', () => {
    const wrapper = mount(Skeleton, { props: { width: '120px', height: '1rem' } })
    expect(wrapper.attributes('style')).toContain('width: 120px')
    expect(wrapper.attributes('style')).toContain('height: 1rem')
  })

  it('renders an empty placeholder block by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.text()).toBe('')
    expect(wrapper.element.children).toHaveLength(0)
  })

  it('renders default slot content inside the placeholder', () => {
    const wrapper = mount(Skeleton, { slots: { default: 'Loading profile' } })
    expect(wrapper.text()).toBe('Loading profile')
  })

  it('falls through attributes to the root element', () => {
    const wrapper = mount(Skeleton, { attrs: { 'data-testid': 'row', 'aria-hidden': 'true' } })
    expect(wrapper.attributes('data-testid')).toBe('row')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
