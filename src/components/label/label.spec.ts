// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import Label from './Label.vue'

const context: FormFieldContext = {
  id: computed(() => 'field-1'),
  describedBy: computed(() => undefined),
  invalid: computed(() => false),
  required: computed(() => true),
}

describe('Label', () => {
  it('renders its content as a label', () => {
    const wrapper = mount(Label, { slots: { default: () => 'Email' } })
    expect(wrapper.get('label').text()).toContain('Email')
  })

  it('applies the shared label typography tokens', () => {
    const wrapper = mount(Label, { slots: { default: () => 'Email' } })
    expect(wrapper.get('label').classes()).toContain('text-sm')
    expect(wrapper.get('label').classes()).toContain('font-medium')
    expect(wrapper.get('label').classes()).toContain('text-foreground')
    expect(wrapper.get('label').classes()).toContain('text-start')
  })

  it('uses the for prop', () => {
    const wrapper = mount(Label, {
      props: { for: 'email' },
      slots: { default: () => 'Email' },
    })
    expect(wrapper.get('label').attributes('for')).toBe('email')
  })

  it('falls back to the FormField context id for `for`', () => {
    const Host = defineComponent({
      setup() {
        provide(formFieldKey, context)
        return () => h(Label, null, () => 'Email')
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.get('label').attributes('for')).toBe('field-1')
  })

  it('lets the for prop win over the context id', () => {
    const Host = defineComponent({
      setup() {
        provide(formFieldKey, context)
        return () => h(Label, { for: 'explicit' }, () => 'Email')
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.get('label').attributes('for')).toBe('explicit')
  })

  it('renders an aria-hidden required marker', () => {
    const wrapper = mount(Label, {
      props: { required: true },
      slots: { default: () => 'Email' },
    })
    const marker = wrapper.get('[aria-hidden="true"]')
    expect(marker.text()).toBe('*')
  })

  it('does not render the marker when not required', () => {
    const wrapper = mount(Label, { slots: { default: () => 'Email' } })
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(false)
  })
})
