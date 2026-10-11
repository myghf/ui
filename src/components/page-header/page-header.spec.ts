// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageHeader from './PageHeader.vue'

describe('PageHeader', () => {
  it('renders a heading with the title and description', () => {
    const wrapper = mount(PageHeader, { props: { title: 'Patients', description: 'All records' } })
    expect(wrapper.get('h1').text()).toBe('Patients')
    expect(wrapper.text()).toContain('All records')
  })

  it('omits the heading when there is no title', () => {
    expect(mount(PageHeader).find('h1').exists()).toBe(false)
  })

  it('renders the actions slot', () => {
    const wrapper = mount(PageHeader, { props: { title: 'X' }, slots: { actions: '<button>New</button>' } })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders the breadcrumbs slot above the title', () => {
    const wrapper = mount(PageHeader, { props: { title: 'X' }, slots: { breadcrumbs: '<nav>crumb</nav>' } })
    expect(wrapper.find('nav').exists()).toBe(true)
  })
})
