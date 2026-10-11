// @vitest-environment jsdom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { DialogContent, DialogOverlay, DialogRoot, DialogTitle } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Drawer from './Drawer.vue'

// The panel is portalled into `document.body`, so unmounting after each test is
// what keeps one test's panel out of the next test's DOM queries.
enableAutoUnmount(afterEach)

/** Captures `console.warn` output — reka-ui's a11y warnings go through it. */
function captureWarnings() {
  const seen: string[] = []
  const spy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    seen.push(args.map(String).join(' '))
  })
  return { seen, restore: () => spy.mockRestore() }
}

/** The panel is portalled into `document.body`. */
function content(): HTMLElement {
  const el = document.body.querySelector('[role="dialog"]')
  if (!el) throw new Error('drawer content not found')
  return el as HTMLElement
}

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

  // reka-ui points `aria-describedby` at a generated id that only resolves when
  // a DialogDescription renders, so an optional description must not leave a
  // dangling reference — reka warns about it and screen readers cannot follow it.
  it('drops aria-describedby when no description is given', async () => {
    const warn = captureWarnings()
    mount(Drawer, { props: { open: true, title: 'Filters' } })
    await nextTick()

    expect(warn.seen.filter((w) => w.includes('Missing `Description`'))).toEqual([])
    expect(content().getAttribute('aria-describedby')).toBeNull()
    warn.restore()
  })

  it('resolves aria-describedby from the description prop', async () => {
    const warn = captureWarnings()
    mount(Drawer, { props: { open: true, title: 'Filters', description: 'Help' } })
    await nextTick()

    expect(warn.seen).toEqual([])
    expect(document.getElementById(content().getAttribute('aria-describedby') ?? '')).not.toBeNull()
    warn.restore()
  })

  it('resolves aria-describedby from the description slot', async () => {
    mount(Drawer, {
      props: { open: true, title: 'Filters' },
      slots: { description: () => 'Slotted help' },
    })
    await nextTick()

    const describedBy = content().getAttribute('aria-describedby')
    expect(describedBy).not.toBeNull()
    expect(document.getElementById(describedBy ?? '')?.textContent).toBe('Slotted help')
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
