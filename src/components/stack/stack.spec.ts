// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Stack from './Stack.vue'

describe('Stack', () => {
  it('stacks children vertically with the default gap', () => {
    const classes = mount(Stack).classes().join(' ')
    expect(classes).toContain('flex-col')
    expect(classes).toContain('gap-4')
  })

  it('applies gap, align and justify', () => {
    const classes = mount(Stack, { props: { gap: 'lg', align: 'center', justify: 'between' } })
      .classes()
      .join(' ')
    expect(classes).toContain('gap-6')
    expect(classes).toContain('items-center')
    expect(classes).toContain('justify-between')
  })

  it('omits alignment classes when they are unset', () => {
    const classes = mount(Stack).classes().join(' ')
    expect(classes).not.toContain('items-')
    expect(classes).not.toContain('justify-')
  })
})
