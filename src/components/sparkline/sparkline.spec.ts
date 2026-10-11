// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Sparkline from './Sparkline.vue'

describe('Sparkline', () => {
  it('is decorative when no label is given', () => {
    const svg = mount(Sparkline, { props: { data: [1, 2, 3] } }).get('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
  })

  it('exposes an accessible name when labelled', () => {
    const svg = mount(Sparkline, { props: { data: [1, 2], label: 'Wait times' } }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Wait times')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })

  it('draws a path for both line and area types', () => {
    const line = mount(Sparkline, { props: { data: [1, 2, 3] } }).get('path')
    expect(line.attributes('d')).toContain('M')
    expect(line.attributes('fill')).toBe('none')

    const area = mount(Sparkline, { props: { data: [1, 2, 3], type: 'area' } }).get('path')
    expect(area.attributes('fill')).toBe('currentColor')
  })

  it('renders no path without data', () => {
    expect(mount(Sparkline, { props: { data: [] } }).find('path').exists()).toBe(false)
  })
})
