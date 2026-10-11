// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Popover from './Popover.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Popover', () => {
  it('renders the trigger and hides the content while closed', () => {
    const wrapper = mount(Popover, {
      slots: { trigger: () => h('button', 'Open'), default: () => 'Body' },
    })
    expect(wrapper.get('button').text()).toBe('Open')
    expect(wrapper.text()).not.toContain('Body')
  })

  it('renders the content in a portal when open', async () => {
    mount(Popover, {
      props: { open: true },
      slots: { trigger: () => h('button', 'Open'), default: () => h('p', 'Body') },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.textContent).toContain('Body')
  })

  it('emits update:open when the open state changes', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Popover, {
      props: { open: true, 'onUpdate:open': onUpdate },
      slots: { trigger: () => h('button', 'Open'), default: () => 'Body' },
      attachTo: document.body,
    })
    // reka's content closes on Escape; emit from the root to assert the wiring.
    wrapper.findComponent({ name: 'PopoverRoot' }).vm.$emit('update:open', false)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(false)
  })
})
