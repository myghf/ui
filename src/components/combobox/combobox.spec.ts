// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { ComboboxRoot } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import Combobox from './Combobox.vue'

const options = [
  { label: 'Cardiology', value: 'cardio' },
  { label: 'Neurology', value: 'neuro' },
  { label: 'Oncology', value: 'onco' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Combobox', () => {
  it('renders a combobox input', () => {
    const wrapper = mount(Combobox, { props: { options } })
    expect(wrapper.get('input').attributes('role')).toBe('combobox')
  })

  it('shows the selected label in the input (single)', () => {
    const wrapper = mount(Combobox, { props: { options, modelValue: 'neuro' } })
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Neurology')
  })

  it('renders a removable tag per selection (multiple)', () => {
    const wrapper = mount(Combobox, { props: { options, multiple: true, modelValue: ['cardio', 'onco'] } })
    expect(wrapper.text()).toContain('Cardiology')
    expect(wrapper.text()).toContain('Oncology')
  })

  it('lists the options when open', async () => {
    mount(Combobox, { props: { options, defaultOpen: true }, attachTo: document.body })
    await nextTick()
    expect(document.body.textContent).toContain('Cardiology')
    expect(document.body.textContent).toContain('Neurology')
  })

  it('shows the empty label when there are no options', async () => {
    mount(Combobox, { props: { options: [], defaultOpen: true }, attachTo: document.body })
    await nextTick()
    expect(document.body.textContent).toContain('No results')
  })

  it('emits update:modelValue when the value changes', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Combobox, { props: { options, 'onUpdate:modelValue': onUpdate } })
    wrapper.findComponent(ComboboxRoot).vm.$emit('update:modelValue', 'cardio')
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('cardio')
  })

  it('clears the selection when the clear button is clicked', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Combobox, {
      props: { options, modelValue: 'cardio', clearable: true, 'onUpdate:modelValue': onUpdate },
    })
    await wrapper.get('[aria-label="Clear selection"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(null)
  })
})

describe('Combobox form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'unit', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Combobox, { options }) },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('unit')
    expect(input.attributes('aria-describedby')).toBe('unit-description unit-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('renders without aria wiring when there is no FormField', () => {
    const input = mount(Combobox, { props: { options } }).get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })
})
