// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('exposes a polite status region', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('announces the default loading label through sr-only text', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.find('.sr-only').text()).toBe('Loading…')
  })

  it('uses a custom label when provided', () => {
    const wrapper = mount(Spinner, { props: { label: 'Saving changes' } })
    expect(wrapper.find('.sr-only').text()).toBe('Saving changes')
  })

  it('applies the tone icon colour to the root', () => {
    const wrapper = mount(Spinner, { props: { tone: 'danger' } })
    expect(wrapper.classes()).toContain('text-error-500')
    expect(wrapper.classes()).toContain('dark:text-error-300')
  })

  it('sizes the icon from the size prop', () => {
    expect(mount(Spinner).find('[data-icon]').classes()).toContain('size-5')
    expect(mount(Spinner, { props: { size: 'sm' } }).find('[data-icon]').classes()).toContain(
      'size-4',
    )
    expect(mount(Spinner, { props: { size: 'lg' } }).find('[data-icon]').classes()).toContain(
      'size-6',
    )
  })

  it('renders a spinning, decorative loader icon', () => {
    const icon = mount(Spinner).find('[data-icon]')
    expect(icon.classes()).toContain('animate-spin')
    expect(icon.classes()).toContain('lucide-loader-circle')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })
})
