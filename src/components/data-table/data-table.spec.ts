// @vitest-environment jsdom
import { mount, type VueWrapper } from '@vue/test-utils'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import type { DefineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { DataTableFeatures } from '../../lib/table'
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
  'onUpdate:expanded'?: (value: Record<string, boolean>) => void
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
    expect(wrapper.get('span.sr-only').text()).toBe('Loading…')
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
