// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Inline from './Inline.vue'

describe('Inline', () => {
  it('lays children in a wrapping row with the default gap', () => {
    const classes = mount(Inline).classes().join(' ')
    expect(classes).toContain('flex-row')
    expect(classes).toContain('flex-wrap')
    expect(classes).toContain('gap-2')
  })

  it('disables wrapping', () => {
    expect(mount(Inline, { props: { wrap: false } }).classes().join(' ')).toContain('flex-nowrap')
  })

  it('applies alignment and justification', () => {
    const classes = mount(Inline, { props: { align: 'center', justify: 'end' } }).classes().join(' ')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-end')
  })
})
