// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatusBadge from './StatusBadge.vue'

describe('StatusBadge', () => {
  it('renders a label and a decorative dot', () => {
    const wrapper = mount(StatusBadge, { props: { label: 'Active' } })
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.findAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it('applies the tone', () => {
    expect(mount(StatusBadge, { props: { label: 'x', tone: 'success' } }).classes().join(' ')).toContain('bg-success-100')
  })

  it('adds a ping dot when pulsing', () => {
    const wrapper = mount(StatusBadge, { props: { label: 'Live', pulse: true } })
    expect(wrapper.find('.animate-ping').exists()).toBe(true)
  })

  it('accepts slot content', () => {
    expect(mount(StatusBadge, { slots: { default: 'Custom' } }).text()).toContain('Custom')
  })
})
