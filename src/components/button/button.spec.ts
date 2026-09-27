// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

/** The rendered lucide icon class, e.g. `lucide-plus` for `<Icon name="plus" />`. */
const iconName = (icon: { classes: () => string[] }) =>
  icon
    .classes()
    .find((name) => name.startsWith('lucide-') && !name.endsWith('-icon'))

describe('Button', () => {
  it('renders a leading icon before the label', () => {
    const wrapper = mount(Button, { props: { icon: 'plus', label: 'Add' } })

    const icon = wrapper.get('[data-icon]')
    expect(iconName(icon)).toBe('lucide-plus')
    expect(wrapper.element.firstElementChild).toBe(icon.element)
    expect(wrapper.text()).toContain('Add')
  })

  it('renders a trailing icon when iconTrailing is set', () => {
    const wrapper = mount(Button, { props: { iconTrailing: 'chevron-down', label: 'Menu' } })

    const icon = wrapper.get('[data-icon]')
    expect(iconName(icon)).toBe('lucide-chevron-down')
    expect(wrapper.element.lastElementChild).toBe(icon.element)
  })

  it('moves the icon to the end when iconPos is end', () => {
    const wrapper = mount(Button, {
      props: { icon: 'arrow-right', iconPos: 'end', label: 'Next' },
    })

    const icon = wrapper.get('[data-icon]')
    expect(iconName(icon)).toBe('lucide-arrow-right')
    const nodes = Array.from(wrapper.element.childNodes)
    expect(nodes[nodes.length - 1]).toBe(icon.element)
  })

  it('renders both icons when icon and iconTrailing are set', () => {
    const wrapper = mount(Button, {
      props: { icon: 'plus', iconTrailing: 'chevron-down', label: 'Add' },
    })

    const icons = wrapper.findAll('[data-icon]')
    expect(icons.map(iconName)).toEqual(['lucide-plus', 'lucide-chevron-down'])
  })

  it('keeps the label visible while loading and shows a spinner', () => {
    const wrapper = mount(Button, { props: { loading: true, label: 'Save' } })

    expect(wrapper.text()).toContain('Save')
    const icon = wrapper.get('[data-icon]')
    expect(iconName(icon)).toBe('lucide-loader-circle')
    expect(icon.classes()).toContain('animate-spin')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('data-loading')).toBe('true')
  })

  it('replaces the leading icon with the spinner while loading', () => {
    const wrapper = mount(Button, { props: { loading: true, icon: 'plus', label: 'Save' } })

    const icons = wrapper.findAll('[data-icon]')
    expect(icons.map(iconName)).toEqual(['lucide-loader-circle'])
  })

  it('still renders a trailing icon while loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true, iconTrailing: 'chevron-down', label: 'Save' },
    })

    const icons = wrapper.findAll('[data-icon]')
    expect(icons.map(iconName)).toEqual(['lucide-loader-circle', 'lucide-chevron-down'])
  })

  it('does not set aria-busy or data-loading when idle', () => {
    const wrapper = mount(Button, { props: { label: 'Save' } })

    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.attributes('data-loading')).toBeUndefined()
  })

  it('disables the button when disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables the button when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does not disable an idle button', () => {
    const wrapper = mount(Button)

    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('forwards aria-label for an icon-only button', () => {
    const wrapper = mount(Button, {
      props: { size: 'icon', icon: 'settings' },
      attrs: { 'aria-label': 'Settings' },
    })

    expect(wrapper.attributes('aria-label')).toBe('Settings')
    expect(iconName(wrapper.get('[data-icon]'))).toBe('lucide-settings')
    expect(wrapper.classes()).toContain('size-9')
  })
})
