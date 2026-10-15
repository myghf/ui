// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TablePagination from './TablePagination.vue'
import { createConfig, myghfConfigKey } from '../../lib/config'

const base = { pageIndex: 0, pageSize: 10, total: 100 }

/** The chevron buttons carry the previous/next labels as aria-labels. */
function buttonLabels(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('button').map((b) => b.attributes('aria-label'))
}

describe('TablePagination labels', () => {
  it('defaults to the English labels', () => {
    const wrapper = mount(TablePagination, { props: base })
    expect(wrapper.text()).toContain('Rows per page')
    expect(wrapper.text()).toContain('of')
    expect(buttonLabels(wrapper)).toContain('Previous page')
    expect(buttonLabels(wrapper)).toContain('Next page')
  })

  it('uses the provided config locale', () => {
    const wrapper = mount(TablePagination, {
      props: base,
      global: {
        provide: { [myghfConfigKey]: createConfig({ locale: 'ar' }) },
      },
    })
    expect(wrapper.text()).toContain('صفوف لكل صفحة')
    expect(wrapper.text()).toContain('من')
    expect(buttonLabels(wrapper)).toContain('الصفحة السابقة')
    expect(buttonLabels(wrapper)).toContain('الصفحة التالية')
  })

  it('lets a prop override the config label', () => {
    const wrapper = mount(TablePagination, {
      props: { ...base, previousLabel: 'Vorherige Seite' },
      global: {
        provide: { [myghfConfigKey]: createConfig({ locale: 'ar' }) },
      },
    })
    expect(buttonLabels(wrapper)).toContain('Vorherige Seite')
    expect(buttonLabels(wrapper)).toContain('الصفحة التالية')
  })
})
