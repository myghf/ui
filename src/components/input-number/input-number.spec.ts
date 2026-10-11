// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { NumberFieldRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import InputNumber from './InputNumber.vue'

describe('InputNumber', () => {
  it('emits null when the underlying field is cleared to an invalid value', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(InputNumber, { props: { modelValue: 5, 'onUpdate:modelValue': onUpdate } })
    wrapper.findComponent(NumberFieldRoot).vm.$emit('update:modelValue', Number.NaN)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(null)
  })

  it('exposes spinbutton semantics', () => {
    expect(mount(InputNumber, { props: { modelValue: 3 } }).get('input').attributes('role')).toBe('spinbutton')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 10, prefix: '$', suffix: 'kg' } })
    expect(wrapper.text()).toContain('$')
    expect(wrapper.text()).toContain('kg')
  })

  it('normalizes a non-positive step to 1 before forwarding it', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 0, step: 0 } })
    expect(wrapper.findComponent(NumberFieldRoot).props('step')).toBe(1)
  })

  it('normalizes a non-finite step to 1 before forwarding it', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 0, step: Number.POSITIVE_INFINITY } })
    expect(wrapper.findComponent(NumberFieldRoot).props('step')).toBe(1)
  })

  it('forwards a valid positive step unchanged', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 0, step: 5 } })
    expect(wrapper.findComponent(NumberFieldRoot).props('step')).toBe(5)
  })

  it('marks the input invalid when the invalid prop is set', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 1, invalid: true } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('exposes a locale-formatted aria-valuetext', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 1234.5, locale: 'en-US' } })
    expect(wrapper.get('input').attributes('aria-valuetext')).toContain('1,234.5')
  })

  it('omits aria-valuetext when there is no value', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: null } })
    expect(wrapper.get('input').attributes('aria-valuetext')).toBeUndefined()
  })
})

describe('InputNumber form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'amount', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(InputNumber) },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('amount')
    expect(input.attributes('aria-describedby')).toBe('amount-description amount-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('lets explicit invalid and required props beat the context', () => {
    const wrapper = mount(FormField, {
      props: { error: 'Required', required: true },
      slots: { default: () => h(InputNumber, { invalid: false, required: false }) },
    })
    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-required')).toBeUndefined()
  })
})
