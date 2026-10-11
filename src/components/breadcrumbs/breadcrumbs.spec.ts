// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Breadcrumbs from './Breadcrumbs.vue'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Patients', href: '/patients' },
  { label: 'Amina Farouk' },
]

describe('Breadcrumbs', () => {
  it('renders a labelled navigation landmark', () => {
    const nav = mount(Breadcrumbs, { props: { items } }).get('nav')
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders links for non-current items and marks the last as current', () => {
    const wrapper = mount(Breadcrumbs, { props: { items } })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(2)
    expect(links[0].attributes('href')).toBe('/')
    expect(links[1].text()).toBe('Patients')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Amina Farouk')
  })

  it('hides the separators from assistive technology', () => {
    expect(mount(Breadcrumbs, { props: { items } }).findAll('[aria-hidden="true"]')).toHaveLength(2)
  })

  it('accepts a custom landmark label', () => {
    const nav = mount(Breadcrumbs, { props: { items, label: 'You are here' } }).get('nav')
    expect(nav.attributes('aria-label')).toBe('You are here')
  })

  it('lets the item slot replace the default rendering', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items },
      slots: { item: ({ item }: { item: { label: string } }) => `[${item.label}]` },
    })
    expect(wrapper.text()).toContain('[Home]')
    expect(wrapper.text()).toContain('[Amina Farouk]')
  })

  it('renders no list items when there are no items', () => {
    expect(mount(Breadcrumbs).findAll('li')).toHaveLength(0)
  })
})
