// @vitest-environment jsdom
import { DOMWrapper, enableAutoUnmount, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import { createConfig, myghfConfigKey } from '../../lib/config'
import TimePicker from './TimePicker.vue'

// The panel is portalled into `document.body`, outside the wrapper tree, so
// unmounting it is what keeps one test's panel out of the next test's queries.
enableAutoUnmount(afterEach)

/**
 * Mounts an open picker and flushes the tick the portal mounts on, so the panel
 * is present in the document by the time the test queries it.
 */
async function open(
  props: Record<string, unknown> = {},
  slots?: Record<string, string>,
  global?: Record<string, unknown>,
) {
  const wrapper = mount(TimePicker, {
    props: { defaultOpen: true, ...props },
    slots,
    global,
  })
  await nextTick()
  return wrapper
}

/**
 * The panel is portalled into `document.body`, so it is not inside the wrapper.
 * The trigger's `aria-controls` points at it — which also picks the right panel
 * when a single test mounts more than one picker.
 */
function panel(wrapper: VueWrapper): DOMWrapper<Element> {
  const id = wrapper.get('[aria-haspopup="dialog"]').attributes('aria-controls')
  const el = id ? document.getElementById(id) : null
  if (!el) throw new Error('time panel not found')
  return new DOMWrapper(el)
}

describe('TimePicker', () => {
  it('renders 24 hourly options in 24-hour format', async () => {
    const picker = panel(await open({ hourFormat: '24' }))
    expect(picker.get('[data-test="hours"]').findAll('option')).toHaveLength(24)
  })

  it('renders 12 hourly options plus a meridiem control in 12-hour format', async () => {
    const picker = panel(await open({ hourFormat: '12' }))
    expect(picker.get('[data-test="hours"]').findAll('option')).toHaveLength(12)
    expect(picker.find('[data-test="meridiem"]').exists()).toBe(true)
  })

  it('builds minute options from minuteStep', async () => {
    const picker = panel(await open({ minuteStep: 15 }))
    expect(picker.get('[data-test="minutes"]').findAll('option')).toHaveLength(4)
  })

  it('clamps minuteStep to 1..30', async () => {
    const options = panel(await open({ minuteStep: 45 })).get('[data-test="minutes"]').findAll('option')
    expect(options).toHaveLength(2)
    expect(options.map((o) => o.element.value)).toEqual(['0', '30'])
  })

  it('initializes the panel from the modelValue', async () => {
    const picker = panel(await open({ modelValue: '14:30' }))
    expect((picker.get('[data-test="hours"]').element as HTMLSelectElement).value).toBe('14')
    expect((picker.get('[data-test="minutes"]').element as HTMLSelectElement).value).toBe('30')
  })

  it('accepts an un-padded modelValue', async () => {
    const picker = panel(await open({ modelValue: '9:5' }))
    expect((picker.get('[data-test="hours"]').element as HTMLSelectElement).value).toBe('9')
    expect((picker.get('[data-test="minutes"]').element as HTMLSelectElement).value).toBe('5')
  })

  it('falls back to the default time for an unparseable modelValue', async () => {
    const picker = panel(await open({ modelValue: '99:99' }))
    expect((picker.get('[data-test="hours"]').element as HTMLSelectElement).value).toBe('9')
  })

  it('shows the placeholder while empty', async () => {
    const wrapper = await open({ modelValue: null })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('Select time')
  })

  it('formats the value in the trigger', async () => {
    const wrapper = await open({ modelValue: '14:30', locale: 'en-US' })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('14:30')
  })

  it('formats the trigger in 12-hour mode', async () => {
    const wrapper = await open({ modelValue: '14:30', hourFormat: '12', locale: 'en-US' })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('2:30 PM')
  })

  it('renders the meridiem matching the value', async () => {
    const picker = panel(await open({ modelValue: '14:30', hourFormat: '12' }))
    expect((picker.get('[data-test="meridiem"]').element as HTMLSelectElement).value).toBe('pm')
  })

  it('emits the edited time on apply', async () => {
    const onUpdate = vi.fn()
    const wrapper = await open({ modelValue: '09:00', 'onUpdate:modelValue': onUpdate })
    await panel(wrapper).get('[data-test="hours"]').setValue('14')
    await panel(wrapper).get('[data-test="minutes"]').setValue('45')
    await panel(wrapper).get('[data-test="apply"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith('14:45')
  })

  it('emits a 24-hour value when meridiem changes in 12-hour mode', async () => {
    const onUpdate = vi.fn()
    const wrapper = await open({ modelValue: '02:00', hourFormat: '12', 'onUpdate:modelValue': onUpdate })
    await panel(wrapper).get('[data-test="meridiem"]').setValue('pm')
    await panel(wrapper).get('[data-test="apply"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith('14:00')
  })

  it('emits null on clear', async () => {
    const onUpdate = vi.fn()
    const wrapper = await open({ modelValue: '09:00', 'onUpdate:modelValue': onUpdate })
    await panel(wrapper).get('[data-test="clear"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(null)
  })

  it('closes the popover after apply', async () => {
    const wrapper = await open({ modelValue: '09:00' })
    await panel(wrapper).get('[data-test="apply"]').trigger('click')
    expect(wrapper.get('[aria-haspopup="dialog"]').attributes('aria-expanded')).toBe('false')
  })

  it('syncs the panel when the modelValue changes externally', async () => {
    const wrapper = await open({ modelValue: '09:00' })
    await wrapper.setProps({ modelValue: '23:15' })
    const picker = panel(wrapper)
    expect((picker.get('[data-test="hours"]').element as HTMLSelectElement).value).toBe('23')
    expect((picker.get('[data-test="minutes"]').element as HTMLSelectElement).value).toBe('15')
  })

  it('localizes the placeholder from the locale', async () => {
    const enWrapper = await open({ locale: 'en-US' })
    const en = enWrapper.get('[aria-haspopup="dialog"]').text()
    enWrapper.unmount()

    const frWrapper = await open({ locale: 'fr-FR' })
    const fr = frWrapper.get('[aria-haspopup="dialog"]').text()

    expect(en).toContain('Select time')
    expect(fr).toContain("Choisir l'heure")
  })

  it('localizes the placeholder from the provided config locale', async () => {
    const enWrapper = await open({ locale: 'en-US' })
    const en = enWrapper.get('[aria-haspopup="dialog"]').text()
    enWrapper.unmount()

    const arWrapper = await open({}, undefined, {
      provide: { [myghfConfigKey]: createConfig({ locale: 'ar' }) },
    })
    const ar = arWrapper.get('[aria-haspopup="dialog"]').text()

    expect(ar).toContain('اختر الوقت')
    expect(ar).not.toBe(en)
  })

  it('renders labels from the labels prop', async () => {
    const picker = panel(await open({ labels: { clear: 'Effacer', apply: 'Valider' } }))
    expect(picker.text()).toContain('Effacer')
    expect(picker.text()).toContain('Valider')
  })

  it('still honors the legacy placeholder prop', async () => {
    const wrapper = await open({ placeholder: 'Pick a time' })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('Pick a time')
  })

  it('prefers labels.placeholder over the legacy placeholder prop', async () => {
    const wrapper = await open({ placeholder: 'Pick a time', labels: { placeholder: 'Choose time' } })
    const trigger = wrapper.get('[aria-haspopup="dialog"]').text()
    expect(trigger).toContain('Choose time')
    expect(trigger).not.toContain('Pick a time')
  })

  it('lets a label slot override the resolved text', async () => {
    const picker = panel(await open({}, { 'label-clear': 'Nuke' }))
    expect(picker.text()).toContain('Nuke')
  })

  it('portals the popover into the body so an ancestor overflow cannot clip it', async () => {
    const wrapper = await open()
    const content = document.body.querySelector('[data-test="hours"]')

    // Rendered in place, the panel is a descendant of whatever contains the
    // trigger — inside a Dialog that is an `overflow-hidden` scroller, which
    // clipped it. Portalled, it escapes that subtree entirely.
    expect(content).not.toBeNull()
    expect(wrapper.element.contains(content)).toBe(false)
  })

  it('exposes focus on the trigger', async () => {
    const wrapper = await open()
    const trigger = wrapper.get('[aria-haspopup="dialog"]').element as HTMLButtonElement
    trigger.focus = vi.fn()
    ;(wrapper.vm as unknown as { focus: () => void }).focus()
    expect(trigger.focus).toHaveBeenCalled()
  })
})

describe('TimePicker form-field wiring', () => {
  it('takes its id and describedby from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'appt', description: 'Help', error: 'Required' },
      slots: { default: () => h(TimePicker) },
    })
    const trigger = wrapper.get('[aria-haspopup="dialog"]')
    expect(trigger.attributes('id')).toBe('appt')
    expect(trigger.attributes('aria-describedby')).toBe('appt-description appt-error')
  })

  it('lets an explicit inputId beat the context id', () => {
    const wrapper = mount(FormField, {
      props: { id: 'context-id' },
      slots: { default: () => h(TimePicker, { inputId: 'explicit-id' }) },
    })
    expect(wrapper.get('[aria-haspopup="dialog"]').attributes('id')).toBe('explicit-id')
  })

  it('renders the field error styling when the FormField is invalid', () => {
    const wrapper = mount(FormField, {
      props: { error: 'Required' },
      slots: { default: () => h(TimePicker) },
    })
    expect(wrapper.get('[aria-haspopup="dialog"]').classes().join(' ')).toContain('border-error-500')
  })
})
