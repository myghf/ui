// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { SwitchRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import Switch from './Switch.vue'

/**
 * Mirrors the Checkbox spec: jsdom cannot synthesise the pointer events reka
 * relies on, so the re-emit is asserted by emitting from the reka root directly,
 * and a listener spy is used instead of `wrapper.emitted()`.
 */
describe('Switch', () => {
  it('exposes the switch role', () => {
    expect(mount(Switch).get('button').attributes('role')).toBe('switch')
  })

  it('reflects the model value it is given', () => {
    expect(mount(Switch, { props: { modelValue: true } }).get('button').attributes('aria-checked')).toBe('true')
    expect(mount(Switch, { props: { modelValue: false } }).get('button').attributes('aria-checked')).toBe('false')
  })

  it('updates when the parent changes the model value', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('button').attributes('aria-checked')).toBe('true')
  })

  it('re-emits update:modelValue for the event name reka uses', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Switch, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate },
    })
    wrapper.findComponent(SwitchRoot).vm.$emit('update:modelValue', true)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(true)
  })

  it('forwards an aria-label to the control', () => {
    const wrapper = mount(Switch, { attrs: { 'aria-label': 'Dark mode' } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Dark mode')
  })

  it('applies the size variant', () => {
    expect(mount(Switch, { props: { size: 'sm' } }).get('button').classes().join(' ')).toContain('w-7')
  })
})

describe('Switch form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'dark', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Switch) },
    })
    const button = wrapper.get('button')
    expect(button.attributes('id')).toBe('dark')
    expect(button.attributes('aria-describedby')).toBe('dark-description dark-error')
    expect(button.attributes('aria-invalid')).toBe('true')
    expect(button.attributes('aria-required')).toBe('true')
  })

  it('renders without aria wiring when there is no FormField', () => {
    const button = mount(Switch).get('button')
    expect(button.attributes('aria-invalid')).toBeUndefined()
    expect(button.attributes('aria-describedby')).toBeUndefined()
  })
})
