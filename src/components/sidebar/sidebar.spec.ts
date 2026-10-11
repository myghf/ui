// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import AppShell from '../app-shell/AppShell.vue'
import Sidebar from './Sidebar.vue'

describe('Sidebar', () => {
  it('renders a labelled nav with its content', () => {
    const wrapper = mount(Sidebar, { slots: { default: () => 'Items' } })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Sidebar')
    expect(wrapper.text()).toContain('Items')
  })

  it('accepts a custom landmark label', () => {
    expect(mount(Sidebar, { props: { label: 'Sections' } }).get('nav').attributes('aria-label')).toBe('Sections')
  })

  it('uses the docked width when used standalone', () => {
    const nav = mount(Sidebar, { props: { width: '20rem' } }).get('nav')
    expect(nav.attributes('style')).toContain('20rem')
  })

  it('is off-canvas and linked to the toggle inside a collapsible AppShell', () => {
    const wrapper = mount(AppShell, { slots: { sidebar: () => h(Sidebar) } })
    const nav = wrapper.get('nav')
    expect(nav.attributes('id')).toBeTruthy()
    expect(nav.classes().join(' ')).toContain('-translate-x-full')
  })
})
