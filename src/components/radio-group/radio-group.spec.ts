// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { RadioGroupRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import RadioGroup from './RadioGroup.vue'

const options = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
]

describe('RadioGroup', () => {
  it('renders a radiogroup with one radio per option', () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 'low', options } })
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
  })

  it('marks the model value as checked', () => {
    const radios = mount(RadioGroup, { props: { modelValue: 'normal', options } }).findAll('[role="radio"]')
    expect(radios[1].attributes('aria-checked')).toBe('true')
    expect(radios[0].attributes('aria-checked')).toBe('false')
  })

  it('associates each option label with its radio', () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 'low', options } })
    const radios = wrapper.findAll('[role="radio"]')
    const labels = wrapper.findAll('label')
    for (let i = 0; i < radios.length; i++) {
      expect(labels[i].attributes('for')).toBe(radios[i].attributes('id'))
      expect(radios[i].attributes('id')).toBeTruthy()
    }
  })

  it('emits update:modelValue when the group value changes', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'low', options, 'onUpdate:modelValue': onUpdate },
    })
    wrapper.findComponent(RadioGroupRoot).vm.$emit('update:modelValue', 'high')
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('high')
  })

  it('disables a single option flagged disabled', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'low', options: [...options, { label: 'Locked', value: 'locked', disabled: true }] },
    })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[3].attributes('data-disabled')).toBeDefined()
    expect(radios[0].attributes('data-disabled')).toBeUndefined()
  })

  it('lays the options out horizontally when orientation is horizontal', () => {
    const wrapper = mount(RadioGroup, { props: { modelValue: 'low', options, orientation: 'horizontal' } })
    expect(wrapper.classes().join(' ')).toContain('flex-row')
  })

  it('renders the option slot content in place of the label', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'low', options },
      slots: { option: ({ label }: { label: string }) => `Choice: ${label}` },
    })
    expect(wrapper.text()).toContain('Choice: Low')
  })
})

describe('RadioGroup form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'priority', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(RadioGroup, { modelValue: 'low', options }) },
    })
    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('id')).toBe('priority')
    expect(group.attributes('aria-describedby')).toBe('priority-description priority-error')
    expect(group.attributes('aria-invalid')).toBe('true')
    expect(group.attributes('aria-required')).toBe('true')
  })

  it('renders without aria wiring when there is no FormField', () => {
    const group = mount(RadioGroup, { props: { modelValue: 'low', options } }).get('[role="radiogroup"]')
    expect(group.attributes('aria-invalid')).toBeUndefined()
    expect(group.attributes('aria-describedby')).toBeUndefined()
  })
})
