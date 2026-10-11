// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import FormField from '../form-field/FormField.vue'
import TransferList from './TransferList.vue'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('TransferList', () => {
  it('renders the source and target headers', () => {
    const wrapper = mount(TransferList, { props: { options } })
    expect(wrapper.text()).toContain('Available')
    expect(wrapper.text()).toContain('Selected')
  })

  it('does not nest interactive controls inside a row', () => {
    const wrapper = mount(TransferList, { props: { options } })
    for (const li of wrapper.findAll('li')) {
      expect(li.element.querySelector('button button')).toBeNull()
    }
  })

  it('gives every option checkbox an accessible name', () => {
    const wrapper = mount(TransferList, { props: { options } })
    const boxes = wrapper.findAll('[role="checkbox"]')
    expect(boxes.map((box) => box.attributes('aria-label'))).toEqual(['Alpha', 'Beta'])
  })

  it('emits every option when move-all-to-target is clicked', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TransferList, { props: { options, 'onUpdate:modelValue': onUpdate } })
    await wrapper.get('[aria-label="Move all to target"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(['a', 'b'])
  })

  it('shows the empty placeholder when a side has no options', () => {
    const wrapper = mount(TransferList, { props: { options, modelValue: ['a', 'b'] } })
    expect(wrapper.text()).toContain('Empty')
  })
})

describe('TransferList form-field wiring', () => {
  it('wires id and describedby from a FormField on the group', () => {
    const wrapper = mount(FormField, {
      props: { id: 'roles', description: 'Help', error: 'Pick one' },
      slots: { default: () => h(TransferList, { options }) },
    })
    const group = wrapper.get('[role="group"]')
    expect(group.attributes('id')).toBe('roles')
    expect(group.attributes('aria-describedby')).toBe('roles-description roles-error')
  })

  it('applies an invalid ring from the FormField error', () => {
    const wrapper = mount(FormField, {
      props: { error: 'Pick one' },
      slots: { default: () => h(TransferList, { options }) },
    })
    expect(wrapper.get('[role="group"]').classes().join(' ')).toContain('ring-error-500')
  })
})
