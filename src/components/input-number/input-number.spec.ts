// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { NumberFieldRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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
})
