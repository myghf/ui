// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from './DatePicker.vue'

function open(props: Record<string, unknown> = {}) {
  return mount(DatePicker, { props: { mode: 'datetime', defaultOpen: true, ...props } })
}

describe('DatePicker', () => {
  it('renders 24 hourly options in 24-hour format', () => {
    expect(open({ hourFormat: '24' }).get('[data-test="hours"]').findAll('option')).toHaveLength(24)
  })

  it('renders 12 hourly options plus a meridiem control in 12-hour format', () => {
    const wrapper = open({ hourFormat: '12' })
    expect(wrapper.get('[data-test="hours"]').findAll('option')).toHaveLength(12)
    expect(wrapper.find('[data-test="meridiem"]').exists()).toBe(true)
  })

  it('builds minute options from minuteStep', () => {
    expect(open({ minuteStep: 15 }).get('[data-test="minutes"]').findAll('option')).toHaveLength(4)
  })

  it('clamps minuteStep to 1..30', () => {
    const options = open({ minuteStep: 45 }).get('[data-test="minutes"]').findAll('option')
    expect(options).toHaveLength(2)
    expect(options.map((o) => o.element.value)).toEqual(['0', '30'])
  })

  it('localizes the month heading', () => {
    const en = open({ locale: 'en-US' })
    const fr = open({ locale: 'fr-FR' })
    expect(en.get('[data-test="month-label"]').text()).not.toBe(fr.get('[data-test="month-label"]').text())
  })

  it('honors weekStartsOn', () => {
    const wrapper = open({ weekStartsOn: 0, locale: 'en-GB' })
    expect(wrapper.get('[data-test="weekdays"]').text()).toMatch(/^Sun/i)
  })

  it('flips navigation chevrons in RTL', () => {
    expect(open().get('[aria-label="Previous month"]').html()).toContain('rtl:rotate-180')
  })

  it('renders labels from the labels prop', () => {
    const wrapper = open({ labels: { clear: 'Effacer', apply: 'Valider' } })
    expect(wrapper.text()).toContain('Effacer')
    expect(wrapper.text()).toContain('Valider')
  })

  it('still honors the legacy placeholder prop', () => {
    const wrapper = mount(DatePicker, { props: { mode: 'date', defaultOpen: true, placeholder: 'Pick a day' } })
    expect(wrapper.get('[aria-haspopup="dialog"]').text()).toContain('Pick a day')
  })

  it('prefers labels.placeholder over the legacy placeholder prop', () => {
    const wrapper = open({ placeholder: 'Pick a day', labels: { placeholder: 'Choose date' } })
    const trigger = wrapper.get('[aria-haspopup="dialog"]').text()
    expect(trigger).toContain('Choose date')
    expect(trigger).not.toContain('Pick a day')
  })

  it('lets a label slot override the resolved text', () => {
    const wrapper = mount(DatePicker, {
      props: { mode: 'datetime', defaultOpen: true },
      slots: { 'label-clear': 'Nuke' },
    })
    expect(wrapper.text()).toContain('Nuke')
  })
})
