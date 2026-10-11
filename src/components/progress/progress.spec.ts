// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Progress from './Progress.vue'

describe('Progress', () => {
  it('exposes progressbar semantics with the value and range', () => {
    const root = mount(Progress, { props: { modelValue: 40, label: 'Uploading' } }).get('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBe('40')
    expect(root.attributes('aria-valuemin')).toBe('0')
    expect(root.attributes('aria-valuemax')).toBe('100')
    expect(root.attributes('aria-label')).toBe('Uploading')
  })

  it('honours a custom max', () => {
    const root = mount(Progress, { props: { modelValue: 5, max: 20, label: 'Steps' } }).get('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBe('5')
    expect(root.attributes('aria-valuemax')).toBe('20')
  })

  it('renders an indeterminate bar when there is no value', () => {
    const root = mount(Progress, { props: { label: 'Loading' } }).get('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.attributes('data-state')).toBe('indeterminate')
  })

  it('falls back to max 100 for a non-positive max', () => {
    const root = mount(Progress, { props: { modelValue: 50, max: 0, label: 'x' } }).get('[role="progressbar"]')
    expect(root.attributes('aria-valuemax')).toBe('100')
  })

  it('sizes the fill from the percentage', () => {
    const wrapper = mount(Progress, { props: { modelValue: 30, label: 'x' } })
    const indicator = wrapper.get('[role="progressbar"]').get('div')
    expect(indicator.attributes('style')).toContain('30%')
  })

  it('clamps the fill percentage to 0..100', () => {
    const over = mount(Progress, { props: { modelValue: 250, label: 'x' } }).get('[role="progressbar"]').get('div')
    expect(over.attributes('style')).toContain('100%')
    const under = mount(Progress, { props: { modelValue: -10, label: 'x' } }).get('[role="progressbar"]').get('div')
    expect(under.attributes('style')).toContain('0%')
  })

  it('applies the tone and size classes', () => {
    const wrapper = mount(Progress, { props: { modelValue: 10, tone: 'danger', size: 'lg', label: 'x' } })
    expect(wrapper.get('[role="progressbar"]').classes().join(' ')).toContain('h-4')
    expect(wrapper.get('[role="progressbar"]').get('div').classes().join(' ')).toContain('bg-error-500')
  })
})
