// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Stepper from './Stepper.vue'

const steps = [{ label: 'Details' }, { label: 'Payment' }, { label: 'Review' }]

describe('Stepper', () => {
  it('marks the current step', () => {
    const wrapper = mount(Stepper, { props: { modelValue: 1, steps } })
    expect(wrapper.get('[aria-current="step"]').text()).toContain('Payment')
  })

  it('renders a check for each completed step', () => {
    expect(mount(Stepper, { props: { modelValue: 2, steps } }).findAll('svg')).toHaveLength(2)
  })

  it('renders step content in the default slot', () => {
    const wrapper = mount(Stepper, { props: { modelValue: 0, steps }, slots: { default: '<p>Body</p>' } })
    expect(wrapper.text()).toContain('Body')
  })

  it('labels the step list', () => {
    expect(mount(Stepper, { props: { modelValue: 0, steps, label: 'Checkout' } }).get('ol').attributes('aria-label')).toBe('Checkout')
  })
})
