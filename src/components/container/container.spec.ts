// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Container from './Container.vue'

describe('Container', () => {
  it('centres content at the default max width with padding', () => {
    const classes = mount(Container).classes().join(' ')
    expect(classes).toContain('mx-auto')
    expect(classes).toContain('max-w-7xl')
    expect(classes).toContain('px-4')
  })

  it('applies the size variant', () => {
    expect(mount(Container, { props: { size: 'sm' } }).classes().join(' ')).toContain('max-w-3xl')
    expect(mount(Container, { props: { size: 'full' } }).classes().join(' ')).toContain('max-w-none')
  })

  it('renders the requested element', () => {
    expect(mount(Container, { props: { as: 'section' } }).element.tagName).toBe('SECTION')
  })

  it('drops padding when padded is false', () => {
    expect(mount(Container, { props: { padded: false } }).classes().join(' ')).not.toContain('px-4')
  })
})
