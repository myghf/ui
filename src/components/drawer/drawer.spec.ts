// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { DialogContent, DialogOverlay, DialogRoot, DialogTitle } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Drawer from './Drawer.vue'

describe('Drawer', () => {
  it('reflects the controlled open prop', async () => {
    const wrapper = mount(Drawer, { props: { open: false, title: 'Filters' }, slots: { default: 'body' } })
    expect(wrapper.findComponent(DialogContent).exists()).toBe(false)
    await wrapper.setProps({ open: true })
    expect(wrapper.findComponent(DialogContent).exists()).toBe(true)
  })

  it('renders a DialogTitle even when no title or header is given', () => {
    const wrapper = mount(Drawer, { props: { open: true } })
    expect(wrapper.findComponent(DialogTitle).exists()).toBe(true)
  })

  it.each(['left', 'right', 'top', 'bottom', 'start', 'end'] as const)('places the panel for %s', (position) => {
    const wrapper = mount(Drawer, { props: { open: true, position } })
    const cls = wrapper.getComponent(DialogContent).classes().join(' ')
    expect(cls).toContain(position === 'top' || position === 'bottom' ? 'inset-x-0' : 'inset-y-0')
  })

  it('prevents escape-key dismissal when disabled', async () => {
    const wrapper = mount(Drawer, { props: { open: true, closeOnEscape: false } })
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    wrapper.findComponent(DialogContent).vm.$emit('escapeKeyDown', event)
    await nextTick()
    expect(preventDefault).toHaveBeenCalled()
  })

  it('forwards update:open', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Drawer, { props: { open: true, 'onUpdate:open': onUpdate } })
    wrapper.findComponent(DialogRoot).vm.$emit('update:open', false)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('locks scroll via a transparent overlay when backdrop is off but preventScroll is on', () => {
    const wrapper = mount(Drawer, { props: { open: true, backdrop: false, preventScroll: true } })
    expect(wrapper.findComponent(DialogOverlay).exists()).toBe(true)
    expect(wrapper.getComponent(DialogOverlay).classes()).toContain('bg-transparent')
    expect(wrapper.getComponent(DialogContent).attributes('prevent-scroll')).toBeUndefined()
  })

  it('renders no overlay when both backdrop and preventScroll are off', () => {
    const wrapper = mount(Drawer, { props: { open: true, backdrop: false, preventScroll: false } })
    expect(wrapper.findComponent(DialogOverlay).exists()).toBe(false)
  })

  it('renders a dimming overlay when backdrop is on', () => {
    const wrapper = mount(Drawer, { props: { open: true, backdrop: true } })
    expect(wrapper.getComponent(DialogOverlay).classes()).toContain('bg-black/50')
  })
})
