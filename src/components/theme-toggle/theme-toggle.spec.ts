// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeToggle from './ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('exposes an accessible toggle state', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Toggle theme')
    expect(['true', 'false']).toContain(button.attributes('aria-pressed'))
  })

  it('offsets the focus ring against the dark background', () => {
    expect(mount(ThemeToggle).get('button').classes()).toContain('dark:focus-visible:ring-offset-background')
  })
})
