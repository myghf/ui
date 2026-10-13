// @vitest-environment jsdom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { RadioGroupRoot } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import * as UI from './index'

/**
 * The keyboard contracts of the interactive components.
 *
 * jsdom performs no layout and synthesises no real focus
 * traversal, so the suite locks in what a keyboard user gets
 * — Escape closes, arrows move, Enter selects — by
 * dispatching the keydown events reka-ui listens for. Escape
 * is dispatched on `window` because reka's dismissable layer
 * registers through VueUse's `onKeyStroke`, which listens on
 * the window.
 *
 * Roving-focus widgets (tabs, radio group) move *focus* with
 * arrows and select on Enter/Space; the radio group
 * additionally re-selects through a `setTimeout(0)`, so its
 * tests wait a macrotask. Components rendered in place mount
 * with `attachTo` — jsdom only moves `document.activeElement`
 * for elements in the document, and VTU mounts detached by
 * default. Portalled overlays (dialog, menu, palette) do not
 * need it, but it is harmless and uniform. Native button
 * activation (Enter on a focused button) and visual focus
 * rings are the browser suite's job.
 */

enableAutoUnmount(afterEach)

/** A keydown that reaches the listeners reka-ui registers. */
function key(target: EventTarget, name: string) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
}

/** Lets reka's `setTimeout(0)` selection run. */
function flushTimeout() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

/** The first element in the portalled overlay matching the selector. */
function overlay(selector: string): Element {
  const el = document.body.querySelector(selector)
  if (!el) throw new Error(`no ${selector} in the document`)
  return el
}

/** Mounts `UI.Tabs` with two triggers and one panel per tab. */
function mountTabs(modelValue: string, onUpdate: (value: string) => void) {
  const trigger = (value: string, label: string) =>
    h(UI.TabsTrigger as never, { value }, { default: () => label })
  const Host = defineComponent({
    render: () =>
      h(
        UI.Tabs as never,
        { modelValue, 'onUpdate:modelValue': onUpdate },
        {
          default: () => [
            h(UI.TabsList as never, {}, {
              default: () => [trigger('a', 'First'), trigger('b', 'Second')],
            }),
            h(UI.TabsContent as never, { value: 'a' }, { default: () => 'First panel' }),
            h(UI.TabsContent as never, { value: 'b' }, { default: () => 'Second panel' }),
          ],
        },
      ),
  })
  return mount(Host, { attachTo: document.body })
}

const selectOptions = [
  { label: 'Room A', value: 'a' },
  { label: 'Room B', value: 'b' },
  { label: 'Room C', value: 'c' },
]

describe('Dialog keyboard', () => {
  it('closes on Escape', async () => {
    const onUpdate = vi.fn()
    mount(UI.Dialog, {
      props: { visible: true, title: 'Title', 'onUpdate:visible': onUpdate },
      attachTo: document.body,
    })
    await nextTick()
    await flushTimeout()

    key(window, 'Escape')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('moves focus into the dialog on open', async () => {
    mount(UI.Dialog, {
      props: { visible: true, title: 'Title' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    expect(overlay('[role="dialog"]').contains(document.activeElement)).toBe(
      true,
    )
  })
})

describe('Drawer keyboard', () => {
  it('closes on Escape', async () => {
    const onUpdate = vi.fn()
    mount(UI.Drawer, {
      props: { open: true, 'onUpdate:open': onUpdate },
      attachTo: document.body,
    })
    await nextTick()
    await flushTimeout()

    key(window, 'Escape')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith(false)
  })
})

describe('DropdownMenu keyboard', () => {
  /** Mounts an open menu with one item, portalled like a real menu. */
  function mountOpenMenu(onUpdate: (open: boolean) => void) {
    const Host = defineComponent({
      render: () =>
        h(
          UI.DropdownMenu as never,
          { open: true, 'onUpdate:open': onUpdate },
          {
            default: () =>
              h(UI.DropdownMenuContent as never, { forceMount: true }, {
                default: () => h(UI.DropdownMenuItem as never, {}, { default: () => 'Edit' }),
              }),
          },
        )
    })
    return mount(Host, { attachTo: document.body })
  }

  it('closes on Escape', async () => {
    const onUpdate = vi.fn()
    mountOpenMenu(onUpdate)
    await nextTick()
    await flushTimeout()

    key(window, 'Escape')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith(false)
  })
})

describe('Select keyboard', () => {
  function mountSelect(onUpdate: (value: unknown) => void) {
    return mount(UI.Select, {
      props: {
        options: selectOptions,
        optionLabel: 'label',
        optionValue: 'value',
        'onUpdate:modelValue': onUpdate,
      },
      attachTo: document.body,
    })
  }

  it('opens on Enter and closes on Escape', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountSelect(onUpdate)

    await wrapper.get('button').trigger('keydown', { key: 'Enter' })
    expect(overlay('[role="listbox"]').textContent).toContain('Room A')

    key(window, 'Escape')
    await nextTick()
    expect(document.body.querySelector('[role="listbox"]')).toBeNull()
  })

  it('moves the highlight on ArrowDown and selects it on Enter', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountSelect(onUpdate)

    await wrapper.get('button').trigger('keydown', { key: 'Enter' })
    await nextTick()
    await flushTimeout()

    // Opening through the keyboard moves focus into the
    // listbox, so the arrow keys travel from the focused option.
    key(document.activeElement as Element, 'ArrowDown')
    await flushTimeout()
    await nextTick()

    const highlighted = overlay('[role="option"][data-highlighted]')
    expect(highlighted.textContent).toContain('Room B')

    key(highlighted, 'Enter')
    await nextTick()
    await flushTimeout()
    expect(onUpdate).toHaveBeenCalledWith('b')
  })
})

describe('Combobox keyboard', () => {
  function mountCombobox(onUpdate?: (value: unknown) => void) {
    return mount(UI.Combobox, {
      props: {
        options: selectOptions,
        optionLabel: 'label',
        optionValue: 'value',
        defaultOpen: true,
        ...(onUpdate ? { 'onUpdate:modelValue': onUpdate } : {}),
      },
      attachTo: document.body,
    })
  }

  it('moves the highlight on ArrowDown and selects it on Enter', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountCombobox(onUpdate)
    await nextTick()
    await flushTimeout()

    // Opening highlights the first option; the arrow keys
    // move the highlight from there.
    const input = wrapper.get('input').element
    key(input, 'ArrowDown')
    await nextTick()

    const highlighted = overlay('[role="listbox"] [data-highlighted]')
    expect(highlighted.textContent).toContain('Room B')

    // Enter is handled by the listbox, which selects the
    // highlighted item.
    key(highlighted, 'Enter')
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('b')
  })

  it('closes on Escape', async () => {
    mountCombobox()
    await nextTick()
    await flushTimeout()

    key(window, 'Escape')
    // The content leaves through reka's Presence,
    // which completes on a macrotask.
    await flushTimeout()
    await nextTick()

    expect(document.body.querySelector('[role="listbox"]')).toBeNull()
  })
})

describe('Tabs keyboard', () => {
  it('moves focus to the next tab on ArrowRight and selects it on Enter', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountTabs('a', onUpdate)
    await nextTick()

    const tabs = (): Element[] =>
      Array.from(wrapper.element.querySelectorAll('[role="tab"]'))
    key(tabs()[0], 'ArrowRight')
    await nextTick()

    // Arrows only move focus; selection happens on Enter/Space.
    expect(document.activeElement?.textContent).toContain('Second')

    key(document.activeElement as Element, 'Enter')
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('b')
  })

  it('moves focus back on ArrowLeft', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountTabs('b', onUpdate)
    await nextTick()

    const tabs = (): Element[] =>
      Array.from(wrapper.element.querySelectorAll('[role="tab"]'))
    key(tabs()[1], 'ArrowLeft')
    await nextTick()

    expect(document.activeElement?.textContent).toContain('First')
  })

  it('jumps focus to the first and last tab on Home and End', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountTabs('b', onUpdate)
    await nextTick()

    const tabs = (): Element[] =>
      Array.from(wrapper.element.querySelectorAll('[role="tab"]'))
    key(tabs()[1], 'Home')
    await nextTick()
    expect(document.activeElement?.textContent).toContain('First')

    key(tabs()[0], 'End')
    await nextTick()
    expect(document.activeElement?.textContent).toContain('Second')
  })
})

describe('RadioGroup keyboard', () => {
  const options = [
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
  ]

  /**
   * The group is controlled: the checked radio follows
   * `modelValue`, so the host re-binds it like a real
   * `v-model` parent would. Without the re-bind the
   * checked radio would never move.
   */
  function mountGroup(initial: string, onUpdate: (value: string) => void) {
    const Host = defineComponent({
      setup() {
        const value = ref(initial)
        return () =>
          h(UI.RadioGroup as never, {
            modelValue: value.value,
            options,
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v as string
              onUpdate(v as string)
            },
          })
      },
    })
    return mount(Host, { attachTo: document.body })
  }

  it('selects the next option on ArrowDown and the previous on ArrowUp', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountGroup('low', onUpdate)
    await nextTick()

    // The checked radio is the current tab stop. The arrow
    // keys move focus, and the newly focused radio selects
    // itself through a `setTimeout(0)`.
    const checked = () =>
      wrapper.element.querySelector('[role="radio"][aria-checked="true"]')
    key(checked() as Element, 'ArrowDown')
    await nextTick()
    await flushTimeout()
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('normal')
    expect(checked()?.getAttribute('id')).toContain('-1')

    key(checked() as Element, 'ArrowUp')
    await nextTick()
    await flushTimeout()
    await nextTick()
    expect(onUpdate).toHaveBeenLastCalledWith('low')
  })

  it('selects the previous option on ArrowUp from the second', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountGroup('normal', onUpdate)
    await nextTick()

    key(
      wrapper.element.querySelector('[role="radio"][aria-checked="true"]') as Element,
      'ArrowUp',
    )
    await nextTick()
    await flushTimeout()
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('low')
  })

  it('reaches the group through the reka root', () => {
    // The wrapper delegates the keyboard handling to reka's
    // RadioGroupRoot, which owns the roving focus and arrow keys.
    const wrapper = mount(UI.RadioGroup, { props: { modelValue: 'low', options } })
    expect(wrapper.findComponent(RadioGroupRoot).exists()).toBe(true)
  })
})

describe('CommandPalette keyboard', () => {
  const items = [
    { label: 'New patient', action: 'new' },
    { label: 'Settings', action: 'settings' },
  ]

  function mountPalette(extra: Record<string, unknown> = {}) {
    const Host = defineComponent({
      render: () => h(UI.CommandPalette as never, { open: true, items, ...extra }),
    })
    return mount(Host, { attachTo: document.body })
  }

  function input(): HTMLInputElement {
    const el = document.body.querySelector('input')
    if (!el) throw new Error('palette input not found')
    return el as HTMLInputElement
  }

  it('moves focus to the first item on ArrowDown', async () => {
    mountPalette()
    await nextTick()
    await flushTimeout()

    key(input(), 'ArrowDown')
    await nextTick()
    await nextTick()

    expect(document.activeElement?.textContent).toContain('New patient')
  })

  it('closes on Escape', async () => {
    const onUpdate = vi.fn()
    mountPalette({ 'onUpdate:open': onUpdate })
    await nextTick()
    await flushTimeout()

    key(input(), 'Escape')
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  // Enter on the focused item is native button activation, which
  // jsdom does not synthesise; the click path is covered in the
  // component's own spec.
})

describe('Tooltip keyboard', () => {
  function mountTooltip(extra: Record<string, unknown> = {}) {
    const Host = defineComponent({
      render: () =>
        h(
          UI.Tooltip as never,
          { text: 'Help text', delayDuration: 0, ...extra },
          { default: () => h('button', { type: 'button' }, 'Hover me') },
        ),
    })
    return mount(Host, { attachTo: document.body })
  }

  it('opens on focus and closes on Escape', async () => {
    const wrapper = mountTooltip()
    await nextTick()
    await flushTimeout()

    wrapper.get('button').element.focus()
    await nextTick()
    await nextTick()

    expect(overlay('[role="tooltip"]').textContent).toContain('Help text')

    key(window, 'Escape')
    // The tooltip hides through reka's Presence,
    // which completes on a macrotask.
    await flushTimeout()
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
  })
})
