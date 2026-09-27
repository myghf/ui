// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import FormField from '../form-field/FormField.vue'
import Select from './Select.vue'

const context: FormFieldContext = {
  id: computed(() => 'field-1'),
  describedBy: computed(() => 'field-1-description field-1-error'),
  invalid: computed(() => true),
  required: computed(() => true),
}

/** Mounts `Select` inside a component that provides the given form-field context. */
function mountWithField(props: Record<string, unknown> = {}, ctx: FormFieldContext = context) {
  const Host = defineComponent({
    setup() {
      provide(formFieldKey, ctx)
      return () => h(Select, props)
    },
  })
  return mount(Host)
}

describe('Select', () => {
  it('renders without aria attributes when there is no FormField provider', () => {
    const trigger = mount(Select, { props: { id: 'country' } }).get('button')

    expect(trigger.attributes('id')).toBe('country')
    expect(trigger.attributes('aria-invalid')).toBeUndefined()
    expect(trigger.attributes('aria-describedby')).toBeUndefined()
    expect(trigger.attributes('required')).toBeUndefined()
  })

  it('wires id, describedby, invalid, and required from the FormField context', () => {
    const trigger = mount(FormField, {
      props: { id: 'country', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Select) },
    }).get('button')

    expect(trigger.attributes('id')).toBe('country')
    expect(trigger.attributes('aria-describedby')).toBe('country-description country-error')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.attributes('required')).toBeDefined()
  })

  it('uses the context generated id when no explicit id is given', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Country' },
      slots: { default: () => h(Select) },
    })
    const trigger = wrapper.get('button')
    expect(trigger.attributes('id')).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(trigger.attributes('id'))
  })

  it('lets an explicit id beat the context id', () => {
    const trigger = mountWithField({ id: 'explicit-id' }).get('button')
    expect(trigger.attributes('id')).toBe('explicit-id')
  })

  it('lets explicit invalid and required props beat the context', () => {
    const trigger = mountWithField({ invalid: false, required: false }).get('button')
    expect(trigger.attributes('aria-invalid')).toBeUndefined()
    expect(trigger.attributes('required')).toBeUndefined()
  })

  it('lets a consumer aria-describedby attr win over the context value', () => {
    const trigger = mountWithField({ 'aria-describedby': 'external-help' }).get('button')
    expect(trigger.attributes('aria-describedby')).toBe('external-help')
  })

  it('omits aria-describedby when the FormField has no description or error', () => {
    const trigger = mount(FormField, {
      props: { id: 'country' },
      slots: { default: () => h(Select) },
    }).get('button')
    expect(trigger.attributes('aria-describedby')).toBeUndefined()
  })
})
