// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import FormField from '../form-field/FormField.vue'
import Password from './Password.vue'

const context: FormFieldContext = {
  id: computed(() => 'field-1'),
  describedBy: computed(() => 'field-1-description field-1-error'),
  invalid: computed(() => true),
  required: computed(() => true),
}

/** Mounts `Password` inside a component that provides the given form-field context. */
function mountWithField(props: Record<string, unknown> = {}, ctx: FormFieldContext = context) {
  const Host = defineComponent({
    setup() {
      provide(formFieldKey, ctx)
      return () => h(Password, props)
    },
  })
  return mount(Host)
}

describe('Password', () => {
  it('defaults the input type to password', () => {
    expect(mount(Password).get('input').attributes('type')).toBe('password')
  })

  it('toggles visibility between password and text', async () => {
    const wrapper = mount(Password)
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('renders without aria attributes when there is no FormField provider', () => {
    const input = mount(Password, { props: { id: 'password' } }).get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(input.attributes('required')).toBeUndefined()
  })

  it('wires id, describedby, invalid, and required from the FormField context', () => {
    const input = mount(FormField, {
      props: { id: 'password', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Password) },
    }).get('input')

    expect(input.attributes('id')).toBe('password')
    expect(input.attributes('aria-describedby')).toBe('password-description password-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('required')).toBeDefined()
  })

  it('uses the context generated id so the label is associated', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Password' },
      slots: { default: () => h(Password) },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
  })

  it('lets an explicit id beat the context id', () => {
    const input = mount(FormField, {
      props: { id: 'context-id' },
      slots: { default: () => h(Password, { id: 'explicit-id' }) },
    }).get('input')

    expect(input.attributes('id')).toBe('explicit-id')
  })

  it('lets explicit invalid and required props beat the context', () => {
    const input = mountWithField({ invalid: false, required: false }).get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('required')).toBeUndefined()
  })

  it('lets a consumer aria-describedby attr win over the context value', () => {
    const input = mountWithField({ 'aria-describedby': 'external-help' }).get('input')
    expect(input.attributes('aria-describedby')).toBe('external-help')
  })
})
