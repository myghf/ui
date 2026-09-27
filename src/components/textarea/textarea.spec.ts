// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue'
import { formFieldKey, type FormFieldContext } from '../../lib/formField'
import FormField from '../form-field/FormField.vue'
import Textarea from './Textarea.vue'

const context: FormFieldContext = {
  id: computed(() => 'field-1'),
  describedBy: computed(() => 'field-1-description field-1-error'),
  invalid: computed(() => true),
  required: computed(() => true),
}

/** Mounts `Textarea` inside a component that provides the given form-field context. */
function mountWithField(props: Record<string, unknown> = {}, ctx: FormFieldContext = context) {
  const Host = defineComponent({
    setup() {
      provide(formFieldKey, ctx)
      return () => h(Textarea, props)
    },
  })
  return mount(Host)
}

/** jsdom has no layout engine, so `scrollHeight` is always 0. Fake a measurement. */
function setScrollHeight(el: Element, value: number) {
  Object.defineProperty(el, 'scrollHeight', { value, configurable: true })
}

function stubLineHeight(value: string) {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ lineHeight: value } as unknown as CSSStyleDeclaration)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Textarea', () => {
  it('does not auto-resize by default', async () => {
    const wrapper = mount(Textarea)
    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    setScrollHeight(el, 120)

    await wrapper.get('textarea').trigger('input')

    expect(el.style.height).toBe('')
    expect(wrapper.get('textarea').classes()).not.toContain('resize-none')
  })

  it('adds resize-none and sizes from scrollHeight on mount when autoResize is set', () => {
    vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(120)

    const wrapper = mount(Textarea, { props: { autoResize: true } })

    expect(wrapper.get('textarea').classes()).toContain('resize-none')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).style.height).toBe('120px')
  })

  it('updates the height on input', async () => {
    const wrapper = mount(Textarea, { props: { autoResize: true } })
    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    setScrollHeight(el, 120)

    await wrapper.get('textarea').trigger('input')

    expect(el.style.height).toBe('120px')
  })

  it('updates the height when modelValue changes', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(Textarea, {
            autoResize: true,
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
          })
      },
    })
    const wrapper = mount(Host)
    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    setScrollHeight(el, 150)

    value.value = 'grow'
    await nextTick()

    expect(el.style.height).toBe('150px')
  })

  it('caps the height at maxRows and adds overflow-y-auto', async () => {
    const wrapper = mount(Textarea, { props: { autoResize: true, maxRows: 3 } })
    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    setScrollHeight(el, 200)
    stubLineHeight('20px')

    await wrapper.get('textarea').trigger('input')

    expect(el.style.height).toBe('60px')
    expect(wrapper.get('textarea').classes()).toContain('overflow-y-auto')
  })

  it('does not cap or scroll when the content is within maxRows', async () => {
    const wrapper = mount(Textarea, { props: { autoResize: true, maxRows: 3 } })
    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    setScrollHeight(el, 40)
    stubLineHeight('20px')

    await wrapper.get('textarea').trigger('input')

    expect(el.style.height).toBe('40px')
    expect(wrapper.get('textarea').classes()).not.toContain('overflow-y-auto')
  })

  it('does not throw or set a NaN height when scrollHeight is 0', async () => {
    const wrapper = mount(Textarea, { props: { autoResize: true } })
    const el = wrapper.get('textarea').element as HTMLTextAreaElement

    await wrapper.get('textarea').trigger('input')

    expect(el.style.height).toBe('')
  })

  it('renders without aria attributes when there is no FormField provider', () => {
    const el = mount(Textarea, { props: { id: 'notes' } }).get('textarea')

    expect(el.attributes('id')).toBe('notes')
    expect(el.attributes('aria-invalid')).toBeUndefined()
    expect(el.attributes('aria-describedby')).toBeUndefined()
    expect(el.attributes('required')).toBeUndefined()
  })

  it('wires id, describedby, invalid, and required from the FormField context', () => {
    const el = mount(FormField, {
      props: { id: 'notes', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(Textarea) },
    }).get('textarea')

    expect(el.attributes('id')).toBe('notes')
    expect(el.attributes('aria-describedby')).toBe('notes-description notes-error')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(el.attributes('required')).toBeDefined()
  })

  it('lets an explicit id beat the context id', () => {
    const el = mount(FormField, {
      props: { id: 'context-id' },
      slots: { default: () => h(Textarea, { id: 'explicit-id' }) },
    }).get('textarea')

    expect(el.attributes('id')).toBe('explicit-id')
  })

  it('lets explicit invalid and required props beat the context', () => {
    const el = mountWithField({ invalid: false, required: false }).get('textarea')

    expect(el.attributes('aria-invalid')).toBeUndefined()
    expect(el.attributes('required')).toBeUndefined()
  })

  it('lets a consumer aria-describedby attr win over the context value', () => {
    const el = mountWithField({ 'aria-describedby': 'external-help' }).get('textarea')

    expect(el.attributes('aria-describedby')).toBe('external-help')
  })

  it('omits aria-describedby when the FormField has no description or error', () => {
    const el = mount(FormField, { props: { id: 'notes' }, slots: { default: () => h(Textarea) } }).get('textarea')

    expect(el.attributes('aria-describedby')).toBeUndefined()
  })
})
