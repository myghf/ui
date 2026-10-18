// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import FormField from '../form-field/FormField.vue'
import Select from './Select.vue'
import type { AcceptableValue } from 'reka-ui'

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
    expect(trigger.attributes('aria-required')).toBeUndefined()
  })

  it('wires id, describedby, invalid, and required from the FormField context', () => {
    const trigger = mount(FormField, {
      props: { id: 'country', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Select) },
    }).get('button')

    expect(trigger.attributes('id')).toBe('country')
    expect(trigger.attributes('aria-describedby')).toBe('country-description country-error')
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.attributes('required')).not.toBe('false')
    expect(trigger.attributes('aria-required')).toBe('true')
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
    expect(trigger.attributes('aria-required')).toBeUndefined()
  })

  it('exposes aria-required to assistive tech when the field is required', () => {
    const trigger = mountWithField().get('button')
    expect(trigger.attributes('aria-required')).toBe('true')
  })

  it('omits aria-required when no field is provided', () => {
    expect(mount(Select).get('button').attributes('aria-required')).toBeUndefined()
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

  it('portals the listbox into the body so an ancestor overflow cannot clip it', async () => {
    // jsdom cannot synthesise the pointer events reka turns into opening, but
    // the keyboard path works.
    const wrapper = mount(Select, {
      props: {
        options: [
          { label: 'Room A', value: 'a' },
          { label: 'Room B', value: 'b' },
        ],
        optionLabel: 'label',
        optionValue: 'value',
      },
    })
    await wrapper.get('button').trigger('keydown', { key: 'Enter' })

    // Rendered in place, the listbox is a descendant of whatever contains the
    // trigger — inside a Dialog that is an `overflow-hidden` scroller, which
    // clipped it. Portalled, it escapes that subtree entirely.
    const listbox = document.body.querySelector('[role="listbox"]')
    expect(listbox).not.toBeNull()
    expect(wrapper.element.contains(listbox)).toBe(false)

    wrapper.unmount()
  })

  const clearableProps = () => ({
    clearable: true,
    modelValue: 'a',
    options: [{ label: 'AAAA', value: 'a' }],
    optionLabel: 'label',
    optionValue: 'value',
  })

  it('places the clear button as a sibling of the trigger, not inside it', () => {
    // reka-ui's SelectTrigger toggles open on `pointerdown`. A clear button nested
    // inside that trigger button routes its pointer-down to the trigger and opens
    // the select instead of clearing — so it must be a sibling, like Combobox.
    const wrapper = mount(Select, { props: clearableProps() })
    const trigger = wrapper.find('button[role="combobox"]')
    const clearBtn = wrapper.find('button[aria-label="Clear selection"]')
    expect(clearBtn.exists()).toBe(true)
    expect(trigger.element.contains(clearBtn.element)).toBe(false)
    expect(clearBtn.element.parentElement).toBe(trigger.element.parentElement)
  })

  it('does not open the select when the clear button is pressed', async () => {
    const wrapper = mount(Select, { props: clearableProps() })
    const trigger = wrapper.find('button[role="combobox"]')
    const clearBtn = wrapper.find('button[aria-label="Clear selection"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await clearBtn.trigger('pointerdown')
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.body.querySelector('[role="listbox"]')).toBeNull()
  })

  it('clears the value when the clear button is clicked', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref<unknown>('a')
        return () =>
          h(Select, {
            modelValue: value.value as AcceptableValue,
            clearable: true,
            options: [{ label: 'AAAA', value: 'a' }],
            optionLabel: 'label',
            optionValue: 'value',
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v
            },
          })
      },
    })
    const wrapper = mount(Host)
    const clearBtn = () => wrapper.find('button[aria-label="Clear selection"]')
    expect(clearBtn().exists()).toBe(true)
    expect(wrapper.find('button[role="combobox"]').attributes('aria-expanded')).toBe('false')

    await clearBtn().trigger('pointerdown')
    await clearBtn().trigger('click')
    await nextTick()

    // Pointer-down must not reach the trigger, so the select stays closed ...
    expect(wrapper.find('button[role="combobox"]').attributes('aria-expanded')).toBe('false')
    // ... and the click clears the value via v-model.
    expect(clearBtn().exists()).toBe(false)
  })

  it('opens the select when the chevron is clicked', async () => {
    const wrapper = mount(Select, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        optionLabel: 'label',
        optionValue: 'value',
      },
    })
    const chevron = wrapper.find('button[aria-label="Show options"]')
    expect(chevron.exists()).toBe(true)
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await chevron.trigger('click')
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('renders selected options as removable tags when multiple', () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        modelValue: ['a', 'b'],
        options: [
          { label: 'AAAA', value: 'a' },
          { label: 'BBBB', value: 'b' },
        ],
        optionLabel: 'label',
        optionValue: 'value',
      },
    })

    expect(wrapper.findAll('button[aria-label="Remove"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('AAAA')
    expect(wrapper.text()).toContain('BBBB')
    // Tags replace the comma-joined display, so the trigger itself stays empty.
    expect(wrapper.find('button[role="combobox"]').text()).not.toContain(',')
  })

  it('removes a single value when its tag is removed', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref<AcceptableValue[]>(['a', 'b'])
        return () =>
          h(Select, {
            multiple: true,
            modelValue: value.value,
            options: [
              { label: 'AAAA', value: 'a' },
              { label: 'BBBB', value: 'b' },
            ],
            optionLabel: 'label',
            optionValue: 'value',
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v as AcceptableValue[]
            },
          })
      },
    })
    const wrapper = mount(Host)

    expect(wrapper.findAll('button[aria-label="Remove"]')).toHaveLength(2)

    await wrapper.findAll('button[aria-label="Remove"]')[0].trigger('click')
    await nextTick()

    const removeButtons = wrapper.findAll('button[aria-label="Remove"]')
    expect(removeButtons).toHaveLength(1)
    expect(wrapper.text()).toContain('BBBB')
    expect(wrapper.text()).not.toContain('AAAA')
  })
})
