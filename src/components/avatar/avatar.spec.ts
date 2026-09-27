// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders an image with src and alt when src is provided', () => {
    const wrapper = mount(Avatar, { props: { src: '/magdi.png', alt: 'Magdi Yacoub' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/magdi.png')
    expect(img.attributes('alt')).toBe('Magdi Yacoub')
    expect(img.classes()).toContain('rounded-full')
    expect(img.classes()).toContain('object-cover')
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(Avatar, { props: { src: '/broken.png', name: 'Magdi Yacoub' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('span').text()).toBe('MY')
  })

  it('rasterizes the image again once src changes after an error', async () => {
    const wrapper = mount(Avatar, { props: { src: '/broken.png', name: 'Magdi Yacoub' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({ src: '/fixed.png' })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/fixed.png')
  })

  it('derives initials from the first letter of up to two words', () => {
    const cases = [
      ['Magdi Yacoub', 'MY'],
      ['Magdi', 'M'],
      ['Magdi Yacoub Hassan', 'MY'],
      ['  magdi   yacoub  ', 'MY'],
      ['', ''],
    ] as const

    for (const [name, expected] of cases) {
      const wrapper = mount(Avatar, { props: { name } })
      expect(wrapper.find('span').text(), `name="${name}"`).toBe(expected)
    }
  })

  it('lets the initials prop override the derived value', () => {
    const wrapper = mount(Avatar, { props: { name: 'Magdi Yacoub', initials: 'zz' } })
    expect(wrapper.find('span').text()).toBe('zz')
  })

  it('exposes the fallback as an accessible image with an aria-label', () => {
    const named = mount(Avatar, { props: { name: 'Magdi Yacoub' } })
    expect(named.find('span').attributes('role')).toBe('img')
    expect(named.find('span').attributes('aria-label')).toBe('Magdi Yacoub')

    const labelled = mount(Avatar, { props: { name: 'Magdi Yacoub', alt: 'Profile photo' } })
    expect(labelled.find('span').attributes('aria-label')).toBe('Profile photo')

    const initial = mount(Avatar, { props: { initials: 'MY' } })
    expect(initial.find('span').attributes('aria-label')).toBe('MY')
  })

  it('maps each size to its utility classes', () => {
    const cases = [
      ['sm', 'size-6 text-xs'],
      ['default', 'size-8 text-sm'],
      ['lg', 'size-10 text-base'],
      ['xl', 'size-14 text-lg'],
    ] as const

    for (const [size, expected] of cases) {
      const wrapper = mount(Avatar, { props: { size } })
      const classes = wrapper.find('span').classes()
      for (const cls of expected.split(' ')) {
        expect(classes, `size="${size}"`).toContain(cls)
      }
    }

    expect(mount(Avatar).find('span').classes()).toContain('size-8')
  })

  it('uses the token-based info tint for the fallback', () => {
    const classes = mount(Avatar, { props: { name: 'Magdi' } }).find('span').classes()
    expect(classes).toContain('bg-primary-100')
    expect(classes).toContain('text-primary-800')
  })
})
