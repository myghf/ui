// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Grid from './Grid.vue'

describe('Grid', () => {
  it('renders a grid with the default single column and gap', () => {
    const classes = mount(Grid).classes().join(' ')
    expect(classes).toContain('grid')
    expect(classes).toContain('grid-cols-1')
    expect(classes).toContain('gap-4')
  })

  it('applies the column count', () => {
    expect(mount(Grid, { props: { cols: 3 } }).classes().join(' ')).toContain('grid-cols-3')
  })

  it('uses auto-fit columns when minItemWidth is set', () => {
    const wrapper = mount(Grid, { props: { minItemWidth: '16rem' } })
    expect(wrapper.classes().join(' ')).not.toContain('grid-cols-')
    expect(wrapper.attributes('style')).toContain('repeat(auto-fit, minmax(16rem, 1fr))')
  })

  it('renders the requested element', () => {
    expect(mount(Grid, { props: { as: 'ul' } }).element.tagName).toBe('UL')
  })
})
