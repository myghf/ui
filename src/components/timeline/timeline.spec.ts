// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Timeline from './Timeline.vue'
import TimelineItem from './TimelineItem.vue'

describe('Timeline', () => {
  it('renders a labelled list of timeline items', () => {
    const wrapper = mount(Timeline, {
      props: { label: 'Admission' },
      slots: {
        default: () => [
          h(TimelineItem, { title: 'Admitted', time: '09:15' }, { default: () => 'Triage complete' }),
          h(TimelineItem, { title: 'Discharged' }),
        ],
      },
    })
    expect(wrapper.get('ol').attributes('aria-label')).toBe('Admission')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Admitted')
    expect(wrapper.get('time').text()).toBe('09:15')
  })

  it('renders the item body slot only when present', () => {
    const empty = mount(TimelineItem, { props: { title: 'Only a title' } })
    expect(empty.text()).toBe('Only a title')
  })
})
