// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Sidebar from '../sidebar/Sidebar.vue'
import Topbar from '../topbar/Topbar.vue'
import AppShell from './AppShell.vue'

function shell() {
  return mount(AppShell, {
    slots: {
      topbar: () => h(Topbar),
      sidebar: () => h(Sidebar, null, { default: () => 'Items' }),
      default: () => h('p', 'Body'),
    },
  })
}

describe('AppShell', () => {
  it('renders the topbar, sidebar, and main slots', () => {
    const wrapper = mount(AppShell, {
      slots: { topbar: '<header>T</header>', sidebar: '<nav>S</nav>', default: '<p>Body</p>' },
    })
    expect(wrapper.find('header').text()).toBe('T')
    expect(wrapper.find('nav').text()).toBe('S')
    expect(wrapper.get('main').text()).toBe('Body')
  })

  it('shows a backdrop only once the sidebar is toggled open', async () => {
    const wrapper = shell()
    expect(wrapper.find('[data-app-shell-backdrop]').exists()).toBe(false)
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('[data-app-shell-backdrop]').exists()).toBe(true)
  })

  it('closes when the backdrop is clicked', async () => {
    const wrapper = shell()
    await wrapper.get('button').trigger('click')
    await wrapper.get('[data-app-shell-backdrop]').trigger('click')
    expect(wrapper.find('[data-app-shell-backdrop]').exists()).toBe(false)
  })

  it('closes on Escape', async () => {
    const wrapper = shell()
    await wrapper.get('button').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  })
})
