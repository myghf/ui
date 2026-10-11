// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BarChart from './BarChart.vue'

const data = [
  { label: 'Cardiology', value: 12 },
  { label: 'Neurology', value: 7 },
]

describe('BarChart', () => {
  it('renders one bar per datum', () => {
    expect(mount(BarChart, { props: { data, label: 'Referrals by unit' } }).findAll('rect')).toHaveLength(2)
  })

  it('exposes the chart as a named image', () => {
    const svg = mount(BarChart, { props: { data, label: 'Referrals by unit' } }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Referrals by unit')
  })

  it('provides a screen-reader table of the values', () => {
    const rows = mount(BarChart, { props: { data, label: 'Referrals by unit' } }).findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Cardiology')
    expect(rows[0].text()).toContain('12')
  })
})
