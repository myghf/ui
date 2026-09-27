// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { DropdownMenuItem as RekaItem } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Icon from '../icon/Icon.vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuContent from './DropdownMenuContent.vue'
import DropdownMenuGroup from './DropdownMenuGroup.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuLabel from './DropdownMenuLabel.vue'
import DropdownMenuSeparator from './DropdownMenuSeparator.vue'

/**
 * Reka's menu item only renders inside a menu content, and the content is
 * portalled and gated on open state. Mounting a real (force-mounted, open)
 * menu keeps the item inside the contexts reka injects, so the wrapper can be
 * exercised for real.
 *
 * jsdom cannot synthesise the pointer events reka turns into selection, so the
 * forwarding and suppression halves are asserted by emitting from the reka item
 * directly (the Checkbox spec uses the same technique). Listener spies are used
 * instead of `wrapper.emitted()`, which records nothing under this Vue/VTU pair.
 */
function mountItem(props: { icon?: string; disabled?: boolean; onSelect?: () => void } = {}) {
  const Host = defineComponent({
    setup() {
      return () =>
        h(
          DropdownMenu,
          { open: true, 'onUpdate:open': () => {} },
          {
            default: () =>
              h(
                DropdownMenuContent,
                { forceMount: true },
                {
                  default: () =>
                    h(
                      DropdownMenuItem,
                      { icon: props.icon, disabled: props.disabled, onSelect: props.onSelect },
                      { default: () => 'Edit' },
                    ),
                },
              ),
          },
        )
    },
  })
  return mount(Host)
}

describe('DropdownMenuItem', () => {
  it('renders an Icon before its content when an icon is set', () => {
    const item = mountItem({ icon: 'pencil' }).findComponent(DropdownMenuItem)

    expect(item.findComponent(Icon).exists()).toBe(true)
    expect(item.findComponent(Icon).props('name')).toBe('pencil')
  })

  it('renders no Icon when the icon prop is omitted', () => {
    const item = mountItem().findComponent(DropdownMenuItem)

    expect(item.findComponent(Icon).exists()).toBe(false)
  })

  it('forwards disabled to the reka item', () => {
    const rekaItem = mountItem({ disabled: true }).findComponent(RekaItem)
    expect(rekaItem.props('disabled')).toBe(true)

    const enabled = mountItem().findComponent(RekaItem)
    expect(enabled.props('disabled')).toBe(false)
  })

  it('does not re-emit select while disabled', async () => {
    const onSelect = vi.fn()
    const wrapper = mountItem({ disabled: true, onSelect })

    wrapper.findComponent(RekaItem).vm.$emit('select')
    await nextTick()

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('re-emits select when enabled', async () => {
    const onSelect = vi.fn()
    const wrapper = mountItem({ onSelect })

    wrapper.findComponent(RekaItem).vm.$emit('select')
    await nextTick()

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})

describe('DropdownMenuSeparator', () => {
  it('renders a separator with the divider styling', () => {
    const wrapper = mount(DropdownMenuSeparator)

    expect(wrapper.attributes('role')).toBe('separator')
    for (const cls of ['my-1', 'h-px', 'bg-border']) {
      expect(wrapper.classes()).toContain(cls)
    }
  })
})

describe('DropdownMenuLabel', () => {
  it('renders muted label styling around its content', () => {
    const wrapper = mount(DropdownMenuLabel, { slots: { default: 'Actions' } })

    expect(wrapper.text()).toBe('Actions')
    for (const cls of ['px-2', 'py-1.5', 'text-xs', 'font-medium', 'text-muted']) {
      expect(wrapper.classes()).toContain(cls)
    }
  })
})

describe('DropdownMenuGroup', () => {
  it('renders a labelled group around its content', () => {
    const wrapper = mount(DropdownMenuGroup, { slots: { default: 'Items' } })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.text()).toBe('Items')
  })
})
