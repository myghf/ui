// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import FormField from '../form-field/FormField.vue'
import Input from './Input.vue'

const context: FormFieldContext = {
  id: computed(() => 'field-1'),
  describedBy: computed(() => 'field-1-description field-1-error'),
  invalid: computed(() => true),
  required: computed(() => true),
}

/** Mounts `Input` inside a component that provides the given form-field context. */
function mountWithField(props: Record<string, unknown> = {}, ctx: FormFieldContext = context) {
  const Host = defineComponent({
    setup() {
      provide(formFieldKey, ctx)
      return () => h(Input, props)
    },
  })
  return mount(Host)
}

describe('Input', () => {
  it('defaults the type to text', () => {
    expect(mount(Input).get('input').attributes('type')).toBe('text')
  })

  it('applies an explicit type', () => {
    expect(mount(Input, { props: { type: 'email' } }).get('input').attributes('type')).toBe('email')
  })

  it('forwards id, name, and autocomplete to the input', () => {
    const input = mount(Input, {
      props: { id: 'email', name: 'email', autocomplete: 'email' },
    }).get('input')

    expect(input.attributes('id')).toBe('email')
    expect(input.attributes('name')).toBe('email')
    expect(input.attributes('autocomplete')).toBe('email')
  })

  it('reflects the required prop as the required attribute', () => {
    expect(mount(Input, { props: { required: true } }).get('input').attributes('required')).toBeDefined()
    expect(mount(Input).get('input').attributes('required')).toBeUndefined()
  })

  it('renders without aria attributes when there is no FormField provider', () => {
    const input = mount(Input, { props: { id: 'email' } }).get('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
    expect(input.attributes('required')).toBeUndefined()
  })

  it('wires id, describedby, invalid, and required from the FormField context', () => {
    const input = mount(FormField, {
      props: { id: 'email', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Input) },
    }).get('input')

    expect(input.attributes('id')).toBe('email')
    expect(input.attributes('aria-describedby')).toBe('email-description email-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('required')).toBeDefined()
  })

  it('uses the context generated id when no explicit id is given', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Email' },
      slots: { default: () => h(Input) },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
  })

  it('lets an explicit id beat the context id', () => {
    const input = mount(FormField, {
      props: { id: 'context-id' },
      slots: { default: () => h(Input, { id: 'explicit-id' }) },
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

  it('omits aria-describedby when the FormField has no description or error', () => {
    const input = mount(FormField, {
      props: { id: 'email' },
      slots: { default: () => h(Input) },
    }).get('input')
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })
})
