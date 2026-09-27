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
})
