// @vitest-environment jsdom
import { mount, type VueWrapper } from '@vue/test-utils'
import { createColumnHelper, type ColumnDef, type ColumnFiltersState } from '@tanstack/vue-table'
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
  sorting?: { id: string; desc: boolean }[]
  expandable?: boolean
  expanded?: Record<string, boolean>
  loading?: boolean
  loadingRows?: number
  loadingLabel?: string
  selectable?: boolean
  selection?: Record<string, boolean>
  selectAllLabel?: string
  selectRowLabel?: string
  selectedLabel?: string
  error?: string
  expandRowLabel?: string
  searchable?: boolean
  searchPlaceholder?: string
  searchLabel?: string
  globalFilter?: string
  filters?: ColumnFiltersState
  noResultsLabel?: string
  clearFiltersLabel?: string
  columnVisibility?: Record<string, boolean>
  columnOrder?: string[]
  columnPinning?: { start?: string[]; end?: string[] }
  resizable?: boolean
  manual?: boolean
  paginate?: boolean
  pageIndex?: number
  pageSize?: number
  rowCount?: number
  pageSizeOptions?: number[]
  maxHeight?: string
  virtual?: boolean
  rowHeight?: number
  'onUpdate:expanded'?: (value: Record<string, boolean>) => void
  'onUpdate:sorting'?: (value: { id: string; desc: boolean }[]) => void
  'onUpdate:selection'?: (value: Record<string, boolean>) => void
  'onUpdate:globalFilter'?: (value: string) => void
  'onUpdate:filters'?: (value: ColumnFiltersState) => void
  'onUpdate:columnVisibility'?: (value: Record<string, boolean>) => void
  'onUpdate:columnOrder'?: (value: string[]) => void
  'onUpdate:columnPinning'?: (value: { start?: string[]; end?: string[] }) => void
  'onUpdate:pageIndex'?: (value: number) => void
  'onUpdate:pageSize'?: (value: number) => void
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

  it('exposes a keyboard-reachable expander button per row', async () => {
    const onUpdateExpanded = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, expandable: true, 'onUpdate:expanded': onUpdateExpanded },
    })

    const button = wrapper.get('[data-row-id="r1"] button')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Toggle row: 1')

    await button.trigger('click')
    expect(onUpdateExpanded).toHaveBeenCalledWith({ r1: true })
  })

  it('reflects the expanded state on the expander button', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, expandable: true, expanded: { r1: true } },
    })
    expect(wrapper.get('[data-row-id="r1"] button').attributes('aria-expanded')).toBe('true')
  })
})

describe('DataTable sorting', () => {
  // Deliberately not sorted by `patient`, so a sort is observable.
  const unsorted: Referral[] = [
    { id: 'r2', patient: 'Youssef Kamal' },
    { id: 'r1', patient: 'Amina Farouk' },
  ]
  const rowIds = (wrapper: VueWrapper) =>
    bodyRows(wrapper).map((row) => row.attributes('data-row-id'))

  it('sorts the rows itself when sorting is not bound', async () => {
    const wrapper = mount(TestDataTable, {
      props: { data: unsorted, columns, getRowId },
    })
    expect(rowIds(wrapper)).toEqual(['r2', 'r1'])

    await wrapper.get('thead button').trigger('click')
    expect(rowIds(wrapper)).toEqual(['r1', 'r2'])
    expect(wrapper.emitted('update:sorting')![0][0]).toEqual([
      { id: 'patient', desc: false },
    ])
  })

  it('sorts from the bound sorting prop', () => {
    const wrapper = mount(TestDataTable, {
      props: {
        data: unsorted,
        columns,
        getRowId,
        sorting: [{ id: 'patient', desc: true }],
      },
    })
    expect(rowIds(wrapper)).toEqual(['r2', 'r1'])
  })

  it('emits the sort but does not apply it when sorting is bound', async () => {
    const onUpdateSorting = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data: unsorted,
        columns,
        getRowId,
        sorting: [],
        'onUpdate:sorting': onUpdateSorting,
      },
    })

    await wrapper.get('thead button').trigger('click')

    expect(onUpdateSorting).toHaveBeenCalledWith([{ id: 'patient', desc: false }])
    // Controlled: the component leaves the rows alone until the parent
    // writes the prop back.
    expect(rowIds(wrapper)).toEqual(['r2', 'r1'])
  })
})

describe('DataTable feature combinations', () => {
  const many = Array.from({ length: 50 }, (_, index) => ({
    id: `r${index + 1}`,
    patient: `Patient ${index + 1}`,
  }))

  it('expands a visible row while virtualized', async () => {
    const wrapper = mount(TestDataTable, {
      props: {
        data: many,
        columns,
        getRowId,
        expandable: true,
        expanded: {},
        virtual: true,
        maxHeight: '12rem',
        rowHeight: 40,
      },
      slots: {
        expansion: () => h('span', { class: 'expansion-body' }, 'Details'),
      },
    })

    // The parent owns the expanded map, as with every other state prop.
    await wrapper.get('[data-row-id] button').trigger('click')
    await wrapper.setProps({ expanded: { r1: true } })

    expect(wrapper.findAll('.expansion-body')).toHaveLength(1)
    // The expansion row renders inside the virtual window.
    expect(wrapper.find('[data-row-id="r1"][data-state="expanded"]').exists()).toBe(true)
  })

  it('accumulates the selection across pages', async () => {
    const onUpdateSelection = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        selectable: true,
        paginate: true,
        pageSize: 1,
        selection: {},
        'onUpdate:selection': onUpdateSelection,
      },
    })

    await wrapper
      .get('[data-row-id="r1"]')
      .findComponent(Checkbox)
      .vm.$emit('update:modelValue', true)
    expect(onUpdateSelection).toHaveBeenLastCalledWith({ r1: true })

    // Page 2: the parent's accumulated map is carried over, so the toggle
    // reports both rows rather than only the visible one.
    await wrapper.setProps({ selection: { r1: true }, pageIndex: 1 })
    await wrapper
      .get('[data-row-id="r2"]')
      .findComponent(Checkbox)
      .vm.$emit('update:modelValue', true)
    expect(onUpdateSelection).toHaveBeenLastCalledWith({ r1: true, r2: true })
  })

  it('sorts a paginated table from the bound sorting prop', async () => {
    const onUpdateSorting = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data: [
          { id: 'r2', patient: 'Youssef Kamal' },
          { id: 'r1', patient: 'Amina Farouk' },
        ],
        columns,
        getRowId,
        paginate: true,
        pageSize: 1,
        sorting: [],
        'onUpdate:sorting': onUpdateSorting,
      },
    })

    await wrapper.get('thead button').trigger('click')
    expect(onUpdateSorting).toHaveBeenCalledWith([{ id: 'patient', desc: false }])

    // The parent writes the sort back; page one now shows the new top row.
    await wrapper.setProps({ sorting: [{ id: 'patient', desc: false }] })
    expect(wrapper.get('[data-row-id]').attributes('data-row-id')).toBe('r1')
  })

  it('reports the filter and the server total together in manual mode', async () => {
    const onUpdateGlobalFilter = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        manual: true,
        paginate: true,
        searchable: true,
        rowCount: 50,
        globalFilter: '',
        'onUpdate:globalFilter': onUpdateGlobalFilter,
      },
    })

    await wrapper.get('input').setValue('amin')

    expect(onUpdateGlobalFilter).toHaveBeenCalledWith('amin')
    // Manual mode: the rows are the server's, the footer the server total.
    expect(bodyRows(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('50')
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

describe('DataTable filtering', () => {
  it('filters rows from the global filter', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, globalFilter: 'Youssef' },
    })
    expect(bodyRows(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Youssef Kamal')
    expect(wrapper.text()).not.toContain('Amina Farouk')
  })

  it('renders a search input when searchable and emits update:globalFilter', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, searchable: true, 'onUpdate:globalFilter': onUpdate },
    })
    expect(wrapper.get('input').attributes('aria-label')).toBe('Search')
    await wrapper.get('input').setValue('amin')
    expect(onUpdate).toHaveBeenCalledWith('amin')
  })

  it('renders a chip per active column filter and removes one', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        filters: [{ id: 'patient', value: 'Amina' }],
        'onUpdate:filters': onUpdate,
      },
    })
    expect(wrapper.text()).toContain('Patient: Amina')
    await wrapper.get('[aria-label="Remove Patient filter"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith([])
  })

  it('clears every filter from the clear button', async () => {
    const onUpdateFilters = vi.fn()
    const onUpdateGlobal = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        filters: [{ id: 'patient', value: 'Amina' }],
        globalFilter: 'amin',
        'onUpdate:filters': onUpdateFilters,
        'onUpdate:globalFilter': onUpdateGlobal,
      },
    })
    await wrapper.get('button.ms-auto').trigger('click')
    expect(onUpdateFilters).toHaveBeenCalledWith([])
    expect(onUpdateGlobal).toHaveBeenCalledWith('')
  })

  it('shows the no-results label only while a filter is active', () => {
    const filtered = mount(TestDataTable, {
      props: { data: [], columns, globalFilter: 'zzz' },
    })
    expect(filtered.text()).toContain('No results match your filters')

    const empty = mount(TestDataTable, { props: { data: [], columns } })
    expect(empty.text()).toContain('No results')
    expect(empty.text()).not.toContain('match your filters')
  })
})

describe('DataTable columns', () => {
  it('hides a column listed as not visible', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, columnVisibility: { patient: false } },
    })
    expect(wrapper.get('thead').text()).not.toContain('Patient')
    expect(wrapper.get('thead').text()).toContain('ID')
  })

  it('reorders columns from the order state', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, columnOrder: ['id', 'patient'] },
    })
    const headers = wrapper.findAll('thead th').map((th) => th.text())
    expect(headers[0]).toContain('ID')
    expect(headers[1]).toContain('Patient')
  })

  it('pins a column to the start with a sticky logical inset', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, columnPinning: { start: ['patient'], end: [] } },
    })
    const style = wrapper.findAll('thead th')[0].attributes('style') ?? ''
    expect(style).toContain('sticky')
    expect(style).toContain('inset-inline-start')
  })

  it('renders a resize handle per column when resizable', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, resizable: true },
    })
    expect(wrapper.findAll('thead th span[aria-hidden="true"]')).toHaveLength(2)

    const plain = mount(TestDataTable, { props: { data, columns, getRowId } })
    expect(plain.findAll('thead th span[aria-hidden="true"]')).toHaveLength(0)
  })
})

describe('DataTable pagination', () => {
  it('paginates client-side and emits update:pageIndex', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(TestDataTable, {
      props: {
        data,
        columns,
        getRowId,
        paginate: true,
        pageSize: 1,
        'onUpdate:pageIndex': onUpdate,
      },
    })
    expect(bodyRows(wrapper)).toHaveLength(1)
    await wrapper.get('[aria-label="Next page"]').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(1)
  })

  it('renders all received rows and the server total in manual mode', () => {
    const wrapper = mount(TestDataTable, {
      props: { data, columns, getRowId, manual: true, paginate: true, rowCount: 50, pageSize: 10 },
    })
    expect(bodyRows(wrapper)).toHaveLength(2)
    expect(wrapper.text()).toContain('50')
  })

  it('renders no pagination footer by default', () => {
    const wrapper = mount(TestDataTable, { props: { data, columns, getRowId } })
    expect(wrapper.find('[aria-label="Next page"]').exists()).toBe(false)
  })
})

describe('DataTable virtualization', () => {
  const many = Array.from({ length: 50 }, (_, index) => ({
    id: `r${index + 1}`,
    patient: `Patient ${index + 1}`,
  }))

  it('renders only the window plus overscan, with a spacer for the rest', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: many, columns, getRowId, virtual: true, maxHeight: '12rem', rowHeight: 40 },
    })
    const rendered = wrapper.findAll('[data-row-id]')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(many.length)
    expect(wrapper.findAll('tbody tr[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it('renders every row when not virtual', () => {
    const wrapper = mount(TestDataTable, {
      props: { data: many, columns, getRowId, maxHeight: '12rem' },
    })
    expect(wrapper.findAll('[data-row-id]')).toHaveLength(many.length)
  })
})
