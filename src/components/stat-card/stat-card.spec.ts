// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatCard from './StatCard.vue'

describe('StatCard', () => {
  it('renders the label, value and hint', () => {
    const wrapper = mount(StatCard, { props: { label: 'Admissions', value: 128, hint: 'This month' } })
    expect(wrapper.text()).toContain('Admissions')
    expect(wrapper.text()).toContain('128')
    expect(wrapper.text()).toContain('This month')
  })

  it('describes a positive trend for assistive tech', () => {
    const wrapper = mount(StatCard, { props: { label: 'x', value: 1, trend: 12 } })
    expect(wrapper.get('.sr-only').text()).toBe('up 12 percent')
  })

  it('describes a negative trend', () => {
    expect(mount(StatCard, { props: { label: 'x', value: 1, trend: -4 } }).get('.sr-only').text()).toBe('down 4 percent')
  })

  it('accepts a value slot', () => {
    const wrapper = mount(StatCard, { props: { label: 'x', value: 0 }, slots: { value: '<strong>42</strong>' } })
    expect(wrapper.get('strong').text()).toBe('42')
  })
})
