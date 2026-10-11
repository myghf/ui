// @vitest-environment jsdom
import { mount, type VueWrapper } from '@vue/test-utils'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import { h, nextTick, type DefineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { DataTableFeatures } from '../../lib/table'
import Checkbox from '../checkbox/Checkbox.vue'
import Skeleton from '../skeleton/Skeleton.vue'
import DataTable from './DataTable.vue'

interface Referral {
  id: string
  patient: string
}

interface DataTableProps {
  data: Referral[]
  columns: ColumnDef<DataTableFeatures, Referral>[]
  getRowId?: (row: Referral) => string
  expandable?: boolean
  loading?: boolean
  loadingRows?: number
  loadingLabel?: string
  selectable?: boolean
  selection?: Record<string, boolean>
  selectAllLabel?: string
  selectRowLabel?: string
  selectedLabel?: string
  error?: string
  'onUpdate:expanded'?: (value: Record<string, boolean>) => void
  'onUpdate:sorting'?: (value: { id: string; desc: boolean }[]) => void
  'onUpdate:selection'?: (value: Record<string, boolean>) => void
}

/**
 * `DataTable` is generic; mounting it directly collapses the row type to the
 * engine's `RowData`, which makes `data`/`columns`/`getRowId` fail to typecheck.
 * Pin the render to the concrete row shape under test instead.
 */
const TestDataTable = DataTable as unknown as DefineComponent<DataTableProps>

const data: Referral[] = [
  { id: 'r1', patient: 'Amina Farouk' },
  { id: 'r2', patient: 'Youssef Kamal' },
]

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('id', { header: 'ID' }),
])
const getRowId = (row: Referral) => row.id

const bodyRows = (wrapper: VueWrapper) => wrapper.findAll('tbody tr')

describe('DataTable loading state', () => {
  it('renders one skeleton per column for each loading row, and no data rows', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, loading: true, loadingRows: 3 },
    })

    const rows = bodyRows(wrapper)
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      expect(row.findAllComponents(Skeleton)).toHaveLength(columns.length)
    }
    expect(rows.every((row) => row.attributes('data-row-id') === undefined)).toBe(true)
    expect(wrapper.find('[data-row-id="r1"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Amina Farouk')
  })

  it('marks the wrapper busy and announces the default loading label', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: [], columns, loading: true },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    const status = wrapper.get('span.sr-only')
    expect(status.text()).toBe('Loading…')
    expect(status.attributes('role')).toBe('status')
    expect(status.attributes('aria-live')).toBe('polite')
  })

  it('keeps rendering the real header while loading', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: [], columns, loading: true, loadingRows: 2 },
    })

    expect(wrapper.findAll('thead th')).toHaveLength(2)
    expect(wrapper.get('thead').text()).toContain('Patient')
    expect(wrapper.findAll('thead button').length).toBeGreaterThan(0)
  })

  it('clamps loadingRows to at least one placeholder row', () => {
    for (const loadingRows of [0, -3, 2.7]) {
      const wrapper = mount(TestDataTable, {
        props: { data: [], columns, loading: true, loadingRows },
      })
      expect(bodyRows(wrapper)).toHaveLength(Math.max(1, Math.floor(loadingRows)))
    }
  })

  it('respects a custom loading label', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: [], columns, loading: true, loadingLabel: 'Fetching referrals' },
    })

    expect(wrapper.get('span.sr-only').text()).toBe('Fetching referrals')
  })

  it('suppresses the empty state while loading and shows it once loading ends', async () => {
    const wrapper = mount(TestDataTable, {
      props: { data: [], columns, loading: true },
    })
    expect(wrapper.text()).not.toContain('No results')
    expect(bodyRows(wrapper)).toHaveLength(5)

    await wrapper.setProps({ loading: false })

    expect(bodyRows(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('No results')
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('renders real rows and emits update:expanded when an expandable row is clicked', async () => {
    const onUpdateExpanded = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        expandable: true,
        'onUpdate:expanded': onUpdateExpanded,
      },
    })

    const row = wrapper.get('[data-row-id="r1"]')
    expect(row.text()).toContain('Amina Farouk')

    await row.trigger('click')
    expect(onUpdateExpanded).toHaveBeenCalledWith({ r1: true })
  })

  it('renders a cell-<columnId> slot on the real (non-loading) path', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId },
      slots: {
        'cell-patient': (params: { value: unknown }) =>
          h('span', { class: 'cell-slot' }, String(params.value)),
      },
    })

    expect(wrapper.findAll('.cell-slot')).toHaveLength(2)
    expect(wrapper.get('.cell-slot').text()).toBe('Amina Farouk')
  })

  it('toggles sorting when a header is clicked while not loading', async () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId },
    })

    const button = wrapper.get('thead button')
    await button.trigger('click')

    const events = wrapper.emitted('update:sorting')
    expect(events).toHaveLength(1)
    expect(events![0][0]).toEqual([{ id: 'patient', desc: false }])

    await button.trigger('click')
    expect(wrapper.emitted('update:sorting')![1][0]).toEqual([{ id: 'patient', desc: true }])
  })

  it('does not emit update:expanded when a placeholder row is clicked', async () => {
    const onUpdateExpanded = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        expandable: true,
        loading: true,
        loadingRows: 2,
        'onUpdate:expanded': onUpdateExpanded,
      },
    })

    await bodyRows(wrapper)[0].trigger('click')

    expect(onUpdateExpanded).not.toHaveBeenCalled()
  })
})

describe('DataTable selection', () => {
  it('renders a header checkbox plus one per row when selectable', () => {
    const wrapper = mount(TestDataTable, { props: { data, columns, getRowId, selectable: true } })
    expect(wrapper.findAll('[role="checkbox"]')).toHaveLength(data.length + 1)
  })

  it('emits update:selection when a row checkbox changes', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, selectable: true, 'onUpdate:selection': onUpdate },
    })
    wrapper.get('[data-row-id="r1"]').findComponent(Checkbox).vm.$emit('update:modelValue', true)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith({ r1: true })
  })

  it('selects every row from the header checkbox', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, selectable: true, 'onUpdate:selection': onUpdate },
    })
    wrapper.get('thead').findComponent(Checkbox).vm.$emit('update:modelValue', true)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith({ r1: true, r2: true })
  })

  it('shows the bulk-actions bar with the selected count only when rows are selected', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, selectable: true, selection: { r1: true } },
      slots: { 'bulk-actions': () => h('button', { class: 'bulk' }, 'Archive') },
    })
    expect(wrapper.text()).toContain('selected')
    expect(wrapper.find('.bulk').exists()).toBe(true)

    const none = mount(TestDataTable, { props: { data, columns, getRowId, selectable: true } })
    expect(none.text()).not.toContain('selected')
    expect(none.find('.bulk').exists()).toBe(false)
  })

  it('marks selected rows with data-selected', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, selectable: true, selection: { r1: true } },
    })
    expect(wrapper.get('[data-row-id="r1"]').attributes('data-selected')).toBe('true')
    expect(wrapper.get('[data-row-id="r2"]').attributes('data-selected')).toBeUndefined()
  })

  it('counts the selection column in the empty-state colspan', () => {
    const wrapper = mount(TestDataTable, { props: { data: [], columns, selectable: true } })
    expect(wrapper.get('tbody td').attributes('colspan')).toBe('3')
  })
})

describe('DataTable error state', () => {
  it('replaces the body with the error message', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, error: 'Could not load referrals' },
    })
    expect(wrapper.text()).toContain('Could not load referrals')
    expect(wrapper.text()).not.toContain('Amina Farouk')
  })

  it('renders an error slot when provided', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, error: 'x' },
      slots: { error: () => h('span', { class: 'err' }, 'Try again') },
    })
    expect(wrapper.get('.err').text()).toBe('Try again')
  })

  it('shows the loading placeholders instead of the error while loading', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: [], columns, loading: true, error: 'nope' },
    })
    expect(wrapper.text()).not.toContain('nope')
  })
})
