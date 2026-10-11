// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FormField from '../form-field/FormField.vue'
import Tag from '../tag/Tag.vue'
import TreeSelect from './TreeSelect.vue'

const nodes = [
  { value: 'cardio', label: 'Cardiology', children: [{ value: 'echo', label: 'Echo' }] },
  { value: 'neuro', label: 'Neurology' },
]

describe('TreeSelect', () => {
  it('renders the placeholder when nothing is selected', () => {
    const wrapper = mount(TreeSelect, {
      props: { nodes, placeholder: 'Pick a unit' },
      attrs: { 'aria-label': 'Unit' },
    })
    expect(wrapper.get('button').text()).toContain('Pick a unit')
  })

  it('renders a Tag per selected value', () => {
    const wrapper = mount(TreeSelect, {
      props: { nodes, modelValue: ['echo'] },
      attrs: { 'aria-label': 'Unit' },
    })
    expect(wrapper.findAllComponents(Tag).length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Echo')
  })
})

describe('TreeSelect form-field wiring', () => {
  it('wires id and describedby from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'unit', description: 'Help', error: 'Required' },
      slots: { default: () => h(TreeSelect, { nodes }) },
    })
    const trigger = wrapper.get('button')
    expect(trigger.attributes('id')).toBe('unit')
    expect(trigger.attributes('aria-describedby')).toBe('unit-description unit-error')
  })

  it('applies invalid styling from the FormField error', () => {
    const wrapper = mount(FormField, {
      props: { error: 'Required' },
      slots: { default: () => h(TreeSelect, { nodes }) },
    })
    expect(wrapper.get('button').classes().join(' ')).toContain('border-error-500')
  })
})
