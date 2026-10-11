// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import FormErrors from './FormErrors.vue'

const errors = [
  { id: 'email', message: 'Enter a valid email address', label: 'Email' },
  { id: 'phone', message: 'Required' },
]

function addField(id: string) {
  const input = document.createElement('input')
  input.id = id
  document.body.appendChild(input)
  return input
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('FormErrors', () => {
  it('renders nothing when there are no errors', () => {
    const wrapper = mount(FormErrors)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('renders an alert summary with the title and each message', () => {
    const wrapper = mount(FormErrors, { props: { errors } })
    const alert = wrapper.get('[role="alert"]')
    expect(alert.text()).toContain('Please fix the following:')
    expect(alert.text()).toContain('Enter a valid email address')
    expect(alert.text()).toContain('Required')
  })

  it('renders the optional label as a prefix', () => {
    const wrapper = mount(FormErrors, { props: { errors } })
    expect(wrapper.get('[role="alert"]').text()).toContain('Email:')
  })

  it('accepts a custom title', () => {
    const wrapper = mount(FormErrors, { props: { errors, title: 'Blocked' } })
    expect(wrapper.get('[role="alert"]').text()).toContain('Blocked')
  })

  it('focuses the linked control when an entry is activated', async () => {
    const email = addField('email')
    const wrapper = mount(FormErrors, { props: { errors } })
    await wrapper.findAll('button')[0].trigger('click')
    expect(document.activeElement).toBe(email)
  })

  it('focuses the first linked control on mount when focusFirst is set', () => {
    const email = addField('email')
    mount(FormErrors, { props: { errors, focusFirst: true } })
    expect(document.activeElement).toBe(email)
  })

  it('does not throw when a linked control is missing', async () => {
    const wrapper = mount(FormErrors, { props: { errors } })
    await wrapper.findAll('button')[0].trigger('click')
    expect(true).toBe(true)
  })
})
