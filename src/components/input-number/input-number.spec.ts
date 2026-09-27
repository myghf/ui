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
})
