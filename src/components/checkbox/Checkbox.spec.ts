// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { CheckboxRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Checkbox from './Checkbox.vue'

/**
 * Regression guard for a real bug: the wrapper used to pass reka-ui `checked` /
 * `update:checked`, names reka 2.x does not use, so the control ran uncontrolled
 * — it never reflected a prop change and never emitted. That silently broke the
 * notification preferences and the permission matrix.
 *
 * Both halves of that bug are covered: prop reflection, and the re-emit wiring.
 * The wiring is asserted by emitting from the reka root directly, because jsdom
 * cannot synthesise the pointer events reka relies on — click-to-emit itself
 * stays browser-verified.
 *
 * Assert on a listener spy, not `wrapper.emitted()`: under this Vue/VTU pair
 * `emitted()` records nothing, even for a bare component that emits.
 */
describe('Checkbox', () => {
  it('reflects the model value it is given', () => {
    const checked = mount(Checkbox, { props: { modelValue: true } })
    expect(checked.get('button').attributes('aria-checked')).toBe('true')

    const unchecked = mount(Checkbox, { props: { modelValue: false } })
    expect(unchecked.get('button').attributes('aria-checked')).toBe('false')
  })

  it('updates when the parent changes the model value', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    expect(wrapper.get('button').attributes('aria-checked')).toBe('false')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.get('button').attributes('aria-checked')).toBe('true')
  })

  it('re-emits update:modelValue for the event name reka actually uses', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate },
    })

    wrapper.findComponent(CheckboxRoot).vm.$emit('update:modelValue', true)
    await nextTick()

    expect(onUpdate).toHaveBeenCalledWith(true)
  })

  it('forwards an aria-label to the control', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
      attrs: { 'aria-label': 'Email' },
    })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Email')
  })
})
