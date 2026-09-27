// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useFormField, type FormFieldContext } from '../../lib/formField'
import Label from '../label/Label.vue'
import FormDescription from './FormDescription.vue'
import FormField from './FormField.vue'
import FormMessage from './FormMessage.vue'

/** Reads the provided context from inside `FormField`'s default slot. */
function captureField() {
  const state: { ctx: FormFieldContext | null } = { ctx: null }
  const Probe = defineComponent({
    setup() {
      state.ctx = useFormField()
      return () => h('div')
    },
  })
  return { Probe, state }
}

describe('FormField', () => {
  it('generates an id and provides the context', () => {
    const { Probe, state } = captureField()
    mount(FormField, { slots: { default: () => h(Probe) } })

    expect(state.ctx).not.toBeNull()
    expect(state.ctx!.id.value).toBeTruthy()
    expect(state.ctx!.invalid.value).toBe(false)
    expect(state.ctx!.required.value).toBe(false)
    expect(state.ctx!.describedBy.value).toBeUndefined()
  })

  it('uses the id prop instead of the generated id', () => {
    const { Probe, state } = captureField()
    mount(FormField, { props: { id: 'email' }, slots: { default: () => h(Probe) } })
    expect(state.ctx!.id.value).toBe('email')
  })

  it('derives invalid from the error prop and exposes it', () => {
    const { Probe, state } = captureField()
    mount(FormField, {
      props: { id: 'email', error: 'Required' },
      slots: { default: () => h(Probe) },
    })
    expect(state.ctx!.invalid.value).toBe(true)
    expect(state.ctx!.describedBy.value).toBe('email-error')
  })

  it('joins description and error ids only when the content exists', () => {
    const { Probe, state } = captureField()
    mount(FormField, {
      props: { id: 'email', description: 'Help', error: 'Nope' },
      slots: { default: () => h(Probe) },
    })
    expect(state.ctx!.describedBy.value).toBe('email-description email-error')
  })

  it('lets an explicit invalid prop win over the error prop', () => {
    const { Probe, state } = captureField()
    mount(FormField, {
      props: { invalid: false, error: 'Required' },
      slots: { default: () => h(Probe) },
    })
    expect(state.ctx!.invalid.value).toBe(false)
  })

  it('marks required in the provided context', () => {
    const { Probe, state } = captureField()
    mount(FormField, { props: { required: true }, slots: { default: () => h(Probe) } })
    expect(state.ctx!.required.value).toBe(true)
  })

  it('wires a descendant Label `for` to the generated id', () => {
    const { Probe, state } = captureField()
    const wrapper = mount(FormField, {
      slots: { default: () => [h(Probe), h(Label, null, () => 'Email')] },
    })
    expect(wrapper.get('label').attributes('for')).toBe(state.ctx!.id.value)
  })

  it('renders the label from the label prop and the label slot', () => {
    const fromProp = mount(FormField, {
      props: { label: 'Email' },
      slots: { default: () => h('input') },
    })
    expect(fromProp.get('label').text()).toContain('Email')

    const fromSlot = mount(FormField, {
      slots: { default: () => h('input'), label: () => 'Custom label' },
    })
    expect(fromSlot.get('label').text()).toContain('Custom label')
  })

  it('does not render a label when none is supplied', () => {
    const wrapper = mount(FormField, { slots: { default: () => h('input') } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders description and error only when content exists', () => {
    const empty = mount(FormField, { slots: { default: () => h('input') } })
    expect(empty.find('p').exists()).toBe(false)

    const filled = mount(FormField, {
      props: { description: 'Helpful text', error: 'Required field' },
      slots: { default: () => h('input') },
    })
    const paragraphs = filled.findAll('p')
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].attributes('id')).toContain('-description')
    expect(paragraphs[0].text()).toBe('Helpful text')
    expect(paragraphs[1].attributes('role')).toBe('alert')
    expect(paragraphs[1].text()).toBe('Required field')
  })
})

describe('FormDescription', () => {
  it('renders nothing when it has no content', () => {
    expect(mount(FormDescription).find('p').exists()).toBe(false)
  })

  it('renders its slot with the given id', () => {
    const wrapper = mount(FormDescription, {
      props: { id: 'email-description' },
      slots: { default: () => 'Help' },
    })
    expect(wrapper.get('p').attributes('id')).toBe('email-description')
    expect(wrapper.text()).toBe('Help')
  })
})

describe('FormMessage', () => {
  it('renders nothing when it has no content', () => {
    expect(mount(FormMessage).find('p').exists()).toBe(false)
  })

  it('renders a role=alert slot with the given id', () => {
    const wrapper = mount(FormMessage, {
      props: { id: 'email-error' },
      slots: { default: () => 'Bad' },
    })
    expect(wrapper.get('p').attributes('role')).toBe('alert')
    expect(wrapper.get('p').attributes('id')).toBe('email-error')
    expect(wrapper.text()).toBe('Bad')
  })
})
