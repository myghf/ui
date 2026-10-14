// @vitest-environment jsdom
import { DOMWrapper, enableAutoUnmount, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from '../form-field/FormField.vue'
import { createConfig, myghfConfigKey } from '../../lib/config'
import DatePicker from './DatePicker.vue'

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
  const wrapper = mount(DatePicker, {
    props: { mode: 'datetime', defaultOpen: true, ...props },
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
function panel(wrapper: VueWrapper) {
  const id = wrapper.get('[aria-haspopup="dialog"]').attributes('aria-controls')
  const el = id ? document.getElementById(id) : null
  if (!el) throw new Error('date picker panel not found')
  return new DOMWrapper(el)
}

describe('DatePicker', () => {
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

  it('localizes the month heading', async () => {
    // Mounted one at a time: each VTU mount is its own app, so reka's id
    // counter restarts and two live panels would share an id.
    const enWrapper = await open({ locale: 'en-US' })
    const en = panel(enWrapper).get('[data-test="month-label"]').text()
    enWrapper.unmount()

    const frWrapper = await open({ locale: 'fr-FR' })
    const fr = panel(frWrapper).get('[data-test="month-label"]').text()

    expect(en).not.toBe(fr)
  })

  it('localizes the month heading from the provided config locale', async () => {
    const enWrapper = await open({ locale: 'en-US' })
    const en = panel(enWrapper).get('[data-test="month-label"]').text()
    enWrapper.unmount()

    const arWrapper = await open({}, undefined, {
      provide: { [myghfConfigKey]: createConfig({ locale: 'ar' }) },
    })
    const ar = panel(arWrapper).get('[data-test="month-label"]').text()

    expect(ar).not.toBe(en)
    // The Arabic month name (e.g. أكتوبر) falls in the Arabic script range.
    expect(ar).toMatch(/[؀-ۿ]/)
  })

  it('honors weekStartsOn', async () => {
    const picker = panel(await open({ weekStartsOn: 0, locale: 'en-GB' }))
    expect(picker.get('[data-test="weekdays"]').text()).toMatch(/^Sun/i)
  })

  it('flips navigation chevrons in RTL', async () => {
    const picker = panel(await open())
    expect(picker.get('[aria-label="Previous month"]').html()).toContain('rtl:rotate-180')
  })

  it('renders labels from the labels prop', async () => {
    const picker = panel(await open({ labels: { clear: 'Effacer', apply: 'Valider' } }))
    expect(picker.text()).toContain('Effacer')
    expect(picker.text()).toContain('Valider')
  })

  it('still honors the legacy placeholder prop', async () => {
    const wrapper = await open({ mode: 'date', placeholder: 'Pick a day' })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('Pick a day')
  })

  it('prefers labels.placeholder over the legacy placeholder prop', async () => {
    const wrapper = await open({ placeholder: 'Pick a day', labels: { placeholder: 'Choose date' } })
    const trigger = wrapper.get('[aria-haspopup="dialog"]').text()
    expect(trigger).toContain('Choose date')
    expect(trigger).not.toContain('Pick a day')
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
})

describe('DatePicker Hijri calendar', () => {
  const hijri = (props: Record<string, unknown> = {}) =>
    open({ mode: 'date', calendar: 'islamic-umalqura', locale: 'en-US', ...props })

  it('labels the month in the Hijri calendar', async () => {
    expect(panel(await hijri()).get('[data-test="month-label"]').text()).toMatch(/14\d\d/)
  })

  it('numbers the day cells from the Hijri day of month', async () => {
    const cells = panel(await hijri()).findAll('[data-test="weekdays"] button')
    expect(cells.length).toBeGreaterThan(0)
    expect(cells[0].text()).toBe('1')
  })

  it('pages by Hijri month', async () => {
    const picker = panel(await hijri())
    const before = picker.get('[data-test="month-label"]').text()
    await picker.get('[aria-label="Next month"]').trigger('click')
    expect(picker.get('[data-test="month-label"]').text()).not.toBe(before)
  })

  it('stays Gregorian by default', async () => {
    const picker = panel(await open({ mode: 'date', locale: 'en-US' }))
    expect(picker.get('[data-test="month-label"]').text()).not.toMatch(/14\d\d/)
  })

  it('formats the selected date in the Hijri calendar', async () => {
    const wrapper = await hijri({ modelValue: new Date(2024, 6, 7) })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('1446')
  })
})

describe('DatePicker form-field wiring', () => {
  it('takes its id and describedby from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'dob', description: 'Help', error: 'Required' },
      slots: { default: () => h(DatePicker) },
    })
    const trigger = wrapper.get('[aria-haspopup="dialog"]')
    expect(trigger.attributes('id')).toBe('dob')
    expect(trigger.attributes('aria-describedby')).toBe('dob-description dob-error')
  })

  it('lets an explicit inputId beat the context id', () => {
    const wrapper = mount(FormField, {
      props: { id: 'context-id' },
      slots: { default: () => h(DatePicker, { inputId: 'explicit-id' }) },
    })
    expect(wrapper.get('[aria-haspopup="dialog"]').attributes('id')).toBe('explicit-id')
  })

  it('renders the field error styling when the FormField is invalid', () => {
    const wrapper = mount(FormField, {
      props: { error: 'Required' },
      slots: { default: () => h(DatePicker) },
    })
    expect(wrapper.get('[aria-haspopup="dialog"]').classes().join(' ')).toContain('border-error-500')
  })
})
