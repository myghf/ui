// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { toneClasses } from '../../lib/tones'
import Tag from './Tag.vue'

describe('Tag', () => {
  it('applies the soft tone classes including dark variants', () => {
    const wrapper = mount(Tag, { props: { tone: 'success' }, slots: { default: 'Done' } })
    const cls = wrapper.get('span').classes().join(' ')
    expect(cls).toContain('bg-success-100')
    expect(cls).toContain('dark:bg-success-900/40')
  })

  it('defaults an omitted tone to the secondary soft classes', () => {
    const wrapper = mount(Tag, { slots: { default: 'Draft' } })
    const cls = wrapper.get('span').classes().join(' ')

    // Tied to the source of truth: every soft class of the secondary tone.
    for (const token of toneClasses.secondary.soft.split(' ')) {
      expect(cls).toContain(token)
    }
    expect(cls).toContain('bg-surface-muted')
    expect(cls).toContain('text-foreground')
  })

  it('renders a remove button that emits remove once when clicked', async () => {
    const onRemove = vi.fn()
    const wrapper = mount(Tag, {
      props: { removable: true, onRemove },
      slots: { default: 'Draft' },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove')

    await button.trigger('click')

    // Under this Vue/VTU pair `wrapper.emitted()` records nothing; assert the spy.
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
