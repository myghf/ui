// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import AppShell from '../app-shell/AppShell.vue'
import Sidebar from '../sidebar/Sidebar.vue'
import Topbar from './Topbar.vue'

describe('Topbar', () => {
  it('renders its slot content in a header', () => {
    const wrapper = mount(Topbar, { slots: { default: () => 'Title' } })
    expect(wrapper.get('header').text()).toContain('Title')
  })

  it('has no toggle when used standalone', () => {
    expect(mount(Topbar).find('button').exists()).toBe(false)
  })

  it('renders a toggle wired to the sidebar inside an AppShell', async () => {
    const wrapper = mount(AppShell, {
      slots: { topbar: () => h(Topbar), sidebar: () => h(Sidebar) },
    })
    const toggle = wrapper.get('button')
    expect(toggle.attributes('aria-label')).toBe('Toggle navigation')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-controls')).toBe(wrapper.get('nav').attributes('id'))
    await toggle.trigger('click')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
  })
})
