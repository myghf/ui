// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Tooltip from './Tooltip.vue'

describe('Tooltip', () => {
  it('renders the trigger slot and keeps the tooltip closed initially', () => {
    const wrapper = mount(Tooltip, {
      props: { text: 'Help' },
      slots: { default: () => h('button', 'Hover me') },
    })
    expect(wrapper.get('button').text()).toBe('Hover me')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('forwards its own attributes through the as-child trigger', () => {
    const wrapper = mount(Tooltip, {
      props: { text: 'Help' },
      slots: { default: () => h('button', { 'data-test': 'trigger' }, 'x') },
    })
    expect(wrapper.find('[data-test="trigger"]').exists()).toBe(true)
  })
})
