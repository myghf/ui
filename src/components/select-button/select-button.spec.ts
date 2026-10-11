// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import FormField from '../form-field/FormField.vue'
import SelectButton from './SelectButton.vue'

const options = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
]

describe('SelectButton', () => {
  it('renders one radio per option and exposes the group role', () => {
    const wrapper = mount(SelectButton, { props: { modelValue: 'a', options } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(2)
  })

  it('marks the model value as checked', () => {
    const wrapper = mount(SelectButton, { props: { modelValue: 'b', options } })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].attributes('data-state')).toBe('unchecked')
    expect(radios[1].attributes('data-state')).toBe('checked')
  })

  it('emits update:modelValue when the group value changes', () => {
    const onUpdate = vi.fn()
    const wrapper = mount(SelectButton, {
      props: { modelValue: 'a', options, 'onUpdate:modelValue': onUpdate },
    })
    wrapper.findComponent({ name: 'RadioGroupRoot' }).vm.$emit('update:modelValue', 'b')
    expect(onUpdate).toHaveBeenCalledWith('b')
  })

  it('disables every option when the group is disabled', () => {
    const wrapper = mount(SelectButton, { props: { modelValue: 'a', options, disabled: true } })
    for (const radio of wrapper.findAll('[role="radio"]')) {
      expect(radio.attributes('data-disabled')).toBeDefined()
    }
  })
})

describe('SelectButton form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'density', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(SelectButton, { modelValue: 'a', options }) },
    })
    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('id')).toBe('density')
    expect(group.attributes('aria-describedby')).toBe('density-description density-error')
    expect(group.attributes('aria-invalid')).toBe('true')
    expect(group.attributes('aria-required')).toBe('true')
  })

  it('renders without aria wiring when there is no FormField', () => {
    const group = mount(SelectButton, { props: { modelValue: 'a', options } }).get('[role="radiogroup"]')
    expect(group.attributes('aria-invalid')).toBeUndefined()
    expect(group.attributes('aria-describedby')).toBeUndefined()
  })
})
