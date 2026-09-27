// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from './Tag.vue'

describe('Tag', () => {
  it('applies the soft tone classes including dark variants', () => {
    const wrapper = mount(Tag, { props: { tone: 'success' }, slots: { default: 'Done' } })
    const cls = wrapper.get('span').classes().join(' ')
    expect(cls).toContain('bg-success-100')
    expect(cls).toContain('dark:bg-success-900/40')
  })
})
