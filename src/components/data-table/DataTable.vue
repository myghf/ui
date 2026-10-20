<script setup lang="ts" generic="T extends RowData">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import {
  FlexRender,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from '@lucide/vue'
import { useMyGhfConfig } from '../../lib/config'
import { isBelow, useViewportWidth } from '../../lib/responsive'
import { dataTableFeatures } from '../../lib/table'
import { shouldIgnoreRowToggle, toggleExpandedRow } from '../../lib/tableInteractions'
import { virtualWindow } from '../../lib/virtual'
import Button from '../button/Button.vue'
import Checkbox from '../checkbox/Checkbox.vue'
import Input from '../input/Input.vue'
import Skeleton from '../skeleton/Skeleton.vue'
import Tag from '../tag/Tag.vue'
import Table from '../table/Table.vue'
import TableBody from '../table/TableBody.vue'
import TableCell from '../table/TableCell.vue'
import TableEmpty from '../table/TableEmpty.vue'
import TableHead from '../table/TableHead.vue'
import TableHeader from '../table/TableHeader.vue'
import TablePagination from '../table/TablePagination.vue'
import TableRow from '../table/TableRow.vue'

const props = withDefaults(
  defineProps<{
    data: T[]
    columns: ColumnDef<typeof dataTableFeatures, T>[]
    getRowId?: (row: T) => string
    striped?: boolean
    size?: 'sm' | 'default'
    emptyLabel?: string
    sortable?: boolean
    /**
     * Active sort. Uncontrolled unless bound — the table sorts itself, but
     * bind with `v-model:sorting` to own the state in the parent.
     */
    sorting?: SortingState
    expandable?: boolean
    expanded?: Record<string, boolean>
    stopRowToggleOnInteractiveCells?: boolean
    maxHeight?: string
    loading?: boolean
    loadingRows?: number
    loadingLabel?: string
    /** Render a leading checkbox column and a bulk-actions bar. */
    selectable?: boolean
    /** Selected-row map, keyed by row id. Bind with `v-model:selection`. */
    selection?: Record<string, boolean>
    selectAllLabel?: string
    selectRowLabel?: string
    /** Word after the selected count in the bulk-actions bar. */
    selectedLabel?: string
    /** Error message. Replaces the body when set (and not `loading`). */
    error?: string
    /** Accessible name for a row's expand/collapse button. */
    expandRowLabel?: string
    /** Render a global search input in the toolbar. */
    searchable?: boolean
    searchPlaceholder?: string
    searchLabel?: string
    /** Global filter term. Bind with `v-model:global-filter`. */
    globalFilter?: string
    /** Per-column filters. Bind with `v-model:filters`. */
    filters?: ColumnFiltersState
    /** Message shown when rows are filtered out. */
    noResultsLabel?: string
    clearFiltersLabel?: string
    /** Column visibility map, keyed by column id. Bind with `v-model:column-visibility`. */
    columnVisibility?: Record<string, boolean>
    /** Column order (ids). Bind with `v-model:column-order`. */
    columnOrder?: string[]
    /** Pinned columns. Bind with `v-model:column-pinning`. */
    columnPinning?: ColumnPinningState
    /** Show drag handles to resize columns. */
    resizable?: boolean
    /** Server-side mode: TanStack skips client sorting/filtering/pagination and you fetch. */
    manual?: boolean
    /** Render a pagination footer (client-side, or the server total when `manual`). */
    paginate?: boolean
    pageIndex?: number
    pageSize?: number
    /** Total row count across all pages (server-side). */
    rowCount?: number
    pageSizeOptions?: number[]
    /**
     * Window the rows: render only the visible slice (requires `maxHeight`).
     * Assumes a uniform `rowHeight`; expansion rows are not accounted for.
     */
    virtual?: boolean
    /** Assumed height of one data row, in pixels. */
    rowHeight?: number
  }>(),
  {
    size: 'default',
    striped: false,
    sortable: true,
    emptyLabel: () => useMyGhfConfig().labels.emptyResults,
    expandable: false,
    expanded: () => ({}),
    stopRowToggleOnInteractiveCells: true,
    loading: false,
    loadingRows: 5,
    loadingLabel: () => useMyGhfConfig().labels.loading,
    selectable: false,
    selection: () => ({}),
    selectAllLabel: () => useMyGhfConfig().labels.selectAllRows,
    selectRowLabel: () => useMyGhfConfig().labels.selectRow,
    selectedLabel: () => useMyGhfConfig().labels.selected,
    error: undefined,
    expandRowLabel: () => useMyGhfConfig().labels.toggleRow,
    searchable: false,
    searchPlaceholder: () => useMyGhfConfig().labels.searchPlaceholder,
    searchLabel: () => useMyGhfConfig().labels.search,
    globalFilter: '',
    filters: () => [],
    noResultsLabel: () => useMyGhfConfig().labels.noResultsMatchFilters,
    clearFiltersLabel: () => useMyGhfConfig().labels.clearFilters,
    columnVisibility: () => ({}),
    columnOrder: () => [],
    columnPinning: () => ({ start: [], end: [] }),
    resizable: false,
    manual: false,
    paginate: false,
    pageIndex: 0,
    pageSize: 10,
    rowCount: 0,
    pageSizeOptions: () => [5, 10, 20],
    virtual: false,
    rowHeight: 40,
  },
)

const emit = defineEmits<{
  'update:sorting': [value: { id: string; desc: boolean }[]]
  'update:expanded': [value: Record<string, boolean>]
  'update:selection': [value: RowSelectionState]
  'update:globalFilter': [value: string]
  'update:filters': [value: ColumnFiltersState]
  'update:columnVisibility': [value: Record<string, boolean>]
  'update:columnOrder': [value: string[]]
  'update:columnPinning': [value: ColumnPinningState]
  'update:pageIndex': [value: number]
  'update:pageSize': [value: number]
  'row-click': [row: unknown]
}>()
const slots = useSlots()

const sortingState = ref<SortingState>([])
/** The bound `sorting` prop, or the internal state when it is not bound. */
const sorting = computed(() => props.sorting ?? sortingState.value)
const getRowId = props.getRowId ? (row: T) => props.getRowId!(row) : undefined

/**
 * Reads the effective column visibility. `useTable` reads `state` while it
 * constructs (before the table instance exists), so the viewport-aware merge is
 * installed after construction — construction and any pre-table reads see the
 * raw prop.
 */
let readColumnVisibility = (): Record<string, boolean> => props.columnVisibility

const table = useTable({
  features: dataTableFeatures,
  get columns() {
    return props.columns
  },
  get data() {
    return props.data
  },
  getRowId,
  getRowCanExpand: () => props.expandable,
  enableRowSelection: () => props.selectable,
  state: {
    get sorting() {
      return sorting.value
    },
    get expanded() {
      return props.expanded
    },
    get rowSelection() {
      // Public type is a plain `Record<string, boolean>`; TanStack narrows it to `true` values.
      return props.selection as RowSelectionState
    },
    get globalFilter() {
      return props.globalFilter
    },
    get columnFilters() {
      return props.filters
    },
    get columnVisibility() {
      return readColumnVisibility()
    },
    get columnOrder() {
      return props.columnOrder
    },
    get columnPinning() {
      return props.columnPinning
    },
    get pagination() {
      // TanStack paginates at its default pageSize unless told otherwise, so
      // hand it `Infinity` when the footer is not in use — otherwise the body
      // would be silently capped at `pageSize` rows.
      if (!props.paginate && !props.manual) {
        return { pageIndex: 0, pageSize: Number.POSITIVE_INFINITY }
      }
      return { pageIndex: props.pageIndex, pageSize: props.pageSize }
    },
  },
  onSortingChange: (updater) => {
    const next = typeof updater === 'function' ? updater(sorting.value) : updater
    // Keep sorting ourselves only when the prop is not bound; a bound prop
    // means the parent owns the state and writes it back via `update:sorting`.
    if (props.sorting === undefined) sortingState.value = next
    emit(
      'update:sorting',
      next.map((s) => ({ id: s.id, desc: s.desc })),
    )
  },
  onExpandedChange: (updater) => {
    const next = typeof updater === 'function' ? updater(props.expanded) : updater
    // ExpandedState may be `true` (expand all); the suite only models per-row ids.
    emit('update:expanded', next === true ? {} : next)
  },
  onRowSelectionChange: (updater) => {
    const next =
      typeof updater === 'function' ? updater(props.selection as RowSelectionState) : updater
    emit('update:selection', next)
  },
  onGlobalFilterChange: (updater) => {
    const next = typeof updater === 'function' ? updater(props.globalFilter) : updater
    emit('update:globalFilter', next)
  },
  onColumnFiltersChange: (updater) => {
    const next = typeof updater === 'function' ? updater(props.filters) : updater
    emit('update:filters', next)
  },
  onColumnVisibilityChange: (updater) => {
    const current = readColumnVisibility()
    const next = typeof updater === 'function' ? updater(current) : current
    // The updater ran against the viewport-merged state; give the consumer back
    // their own intent for viewport-managed keys so breakpoint hiding never
    // leaks into `column-visibility`.
    if (breakpointHiddenIds.value.size === 0) {
      emit('update:columnVisibility', next)
      return
    }
    const out: Record<string, boolean> = { ...next }
    for (const id of breakpointHiddenIds.value) {
      if (id in props.columnVisibility) out[id] = props.columnVisibility[id]
      else delete out[id]
    }
    emit('update:columnVisibility', out)
  },
  onColumnOrderChange: (updater) => {
    const next = typeof updater === 'function' ? updater(props.columnOrder) : updater
    emit('update:columnOrder', next)
  },
  onColumnPinningChange: (updater) => {
    const next = typeof updater === 'function' ? updater(props.columnPinning) : updater
    emit('update:columnPinning', next)
  },
  get enableColumnResizing() {
    return props.resizable
  },
  columnResizeMode: 'onChange',
  get manualPagination() {
    return props.manual
  },
  get manualSorting() {
    return props.manual
  },
  get manualFiltering() {
    return props.manual
  },
  get rowCount() {
    return props.manual ? props.rowCount : undefined
  },
  onPaginationChange: (updater) => {
    const current = { pageIndex: props.pageIndex, pageSize: props.pageSize }
    const next = typeof updater === 'function' ? updater(current) : updater
    emit('update:pageIndex', next.pageIndex)
    emit('update:pageSize', next.pageSize)
  },
})

const width = useViewportWidth()

/** Leaf columns whose `meta.hideBelow` the current viewport hides. */
const responsiveHidden = computed(() => {
  const viewport = width.value
  if (viewport === null) return []
  return table.getAllLeafColumns().filter((column) => {
    const hideBelow = column.columnDef.meta?.hideBelow
    return hideBelow !== undefined && isBelow(hideBelow, viewport)
  })
})

/** Ids the viewport forces hidden — merged into the table, never into the prop. */
const breakpointHiddenIds = computed(() => new Set(responsiveHidden.value.map((column) => column.id)))

/** Breakpoint-hidden columns the consumer has not hidden themselves: the disclosure's content. */
const disclosureColumns = computed(() =>
  responsiveHidden.value.filter((column) => props.columnVisibility[column.id] !== false),
)

const responsiveActive = computed(() => disclosureColumns.value.length > 0)
/** The leading expander column: row expansion, or the responsive disclosure when active. */
const showExpander = computed(() => props.expandable || responsiveActive.value)

const effectiveColumnVisibility = computed<Record<string, boolean>>(() => {
  const hidden = breakpointHiddenIds.value
  // Identity when nothing is forced, so unaffected tables behave exactly as before.
  if (hidden.size === 0) return props.columnVisibility
  const merged = { ...props.columnVisibility }
  for (const id of hidden) merged[id] = false
  return merged
})
readColumnVisibility = () => effectiveColumnVisibility.value

/** Disclosure entries for one row: label + cell per column hidden at this viewport. */
function disclosureFor(row: Row<typeof dataTableFeatures, T>) {
  const cells = row.getAllCellsByColumnId()
  return disclosureColumns.value.map((column) => ({
    id: column.id,
    label: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id,
    cell: cells[column.id],
  }))
}

const rows = computed(() => table.getRowModel().rows)
const selectedRows = computed(() => table.getSelectedRowModel().rows)
/** Visible data columns plus the leading selection/expander columns. */
const columnCount = computed(
  () =>
    table.getVisibleLeafColumns().length +
    (props.selectable ? 1 : 0) +
    (showExpander.value ? 1 : 0),
)
/** Clamp to at least one placeholder row so 0/negative/fractional values still render. */
const placeholderRowCount = computed(() => Math.max(1, Math.floor(props.loadingRows)))

const hasActiveFilters = computed(
  () => props.globalFilter.trim().length > 0 || props.filters.length > 0,
)

/** Rows to paginate over: the server total when manual, else the filtered row count. */
const totalRows = computed(() =>
  props.manual ? props.rowCount : table.getFilteredRowModel().rows.length,
)

const scrollRef = ref<HTMLElement>()
const scrollTop = ref(0)
const viewportHeight = ref(0)
let resizeObserver: ResizeObserver | undefined

function onScroll(event: Event) {
  if (!props.virtual) return
  scrollTop.value = (event.target as HTMLElement).scrollTop
}

onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !scrollRef.value) return
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) viewportHeight.value = entry.contentRect.height
  })
  resizeObserver.observe(scrollRef.value)
  viewportHeight.value = scrollRef.value.clientHeight
})

onBeforeUnmount(() => resizeObserver?.disconnect())

/** The visible row window when virtualizing (requires `maxHeight`). */
const windowRange = computed(() =>
  props.virtual && props.maxHeight
    ? virtualWindow(rows.value.length, props.rowHeight, scrollTop.value, viewportHeight.value)
    : null,
)

const visibleRows = computed(() =>
  windowRange.value ? rows.value.slice(windowRange.value.start, windowRange.value.end) : rows.value,
)

/** Human-readable chips for the active column filters, keyed by column id. */
const filterChips = computed(() =>
  props.filters.map((filter) => {
    const header = table.getColumn(filter.id)?.columnDef.header
    return {
      id: filter.id,
      label: typeof header === 'string' ? header : filter.id,
      value: Array.isArray(filter.value)
        ? filter.value.map((value) => String(value)).join(', ')
        : String(filter.value ?? ''),
    }
  }),
)

function sortDirection(columnId: string): 'ascending' | 'descending' | 'none' {
  const column = table.getColumn(columnId)
  if (!column?.getIsSorted()) return 'none'
  return column.getIsSorted() === 'desc' ? 'descending' : 'ascending'
}

const hasCellSlot = (columnId: string) => Boolean(slots[`cell-${columnId}`])

/** `size` only exists on ColumnDef when columnSizingFeature is registered, so read it structurally. */
const widthOf = (columnDef: unknown) => {
  const size = (columnDef as { size?: number }).size
  return size ? `${size}px` : undefined
}

interface PinnableColumn {
  getIsPinned: () => unknown
  getStart: (position: 'start') => number
  getAfter: (position: 'end') => number
}

/** Sticky offset for a pinned column, or `undefined` when it is not pinned. */
function pinStyle(column: PinnableColumn): Record<string, string | number> | undefined {
  const pinned = column.getIsPinned()
  // Logical insets, so a start/end pin sticks to the correct edge under RTL.
  if (pinned === 'start') {
    return { position: 'sticky', insetInlineStart: `${column.getStart('start')}px`, zIndex: 1 }
  }
  if (pinned === 'end') {
    return { position: 'sticky', insetInlineEnd: `${column.getAfter('end')}px`, zIndex: 1 }
  }
  return undefined
}

function clearSelection() {
  table.toggleAllRowsSelected(false)
}

/** Toggles one row's expansion — the keyboard-reachable path (the expander button). */
function toggleRow(rowId: string) {
  emit('update:expanded', toggleExpandedRow(props.expanded, rowId))
}

function removeFilter(columnId: string) {
  emit(
    'update:filters',
    props.filters.filter((filter) => filter.id !== columnId),
  )
}

function clearFilters() {
  if (props.filters.length > 0) emit('update:filters', [])
  if (props.globalFilter) emit('update:globalFilter', '')
}

function onRowClick(event: MouseEvent, rowId: string) {
  emit('row-click', rows.value.find((row) => row.id === rowId)?.original)
  if (!props.expandable && !responsiveActive.value) return
  if (props.stopRowToggleOnInteractiveCells && shouldIgnoreRowToggle(event.target)) return
  emit('update:expanded', toggleExpandedRow(props.expanded, rowId))
}
</script>

<template>
  <div
    ref="scrollRef"
    :class="maxHeight ? 'overflow-auto' : undefined"
    :style="maxHeight ? { maxHeight } : undefined"
    :aria-busy="loading || undefined"
    @scroll="onScroll"
  >
    <span v-if="loading" class="sr-only" role="status" aria-live="polite">{{ loadingLabel }}</span>

    <div
      v-if="searchable || hasActiveFilters || $slots.toolbar"
      class="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2"
    >
      <Input
        v-if="searchable"
        :model-value="globalFilter"
        :placeholder="searchPlaceholder"
        :aria-label="searchLabel"
        leading-icon="search"
        size="sm"
        class="max-w-xs"
        @update:model-value="emit('update:globalFilter', String($event))"
      />
      <ul v-if="filterChips.length > 0" class="flex flex-wrap items-center gap-1">
        <li v-for="chip in filterChips" :key="chip.id">
          <Tag
            tone="secondary"
            removable
            :remove-label="`Remove ${chip.label} filter`"
            @remove="removeFilter(chip.id)"
          >
            {{ chip.label }}: {{ chip.value }}
          </Tag>
        </li>
      </ul>
      <slot name="toolbar" />
      <Button
        v-if="hasActiveFilters"
        variant="ghost"
        size="sm"
        class="ms-auto"
        @click="clearFilters"
      >
        {{ clearFiltersLabel }}
      </Button>
    </div>

    <div
      v-if="selectable && selectedRows.length > 0"
      class="flex flex-wrap items-center gap-2 border-b border-border bg-surface-muted/50 px-3 py-2 text-sm"
    >
      <span class="font-medium text-foreground">{{ selectedRows.length }}</span>
      <span class="text-muted">{{ selectedLabel }}</span>
      <div class="ms-auto flex items-center gap-2">
        <slot name="bulk-actions" :rows="selectedRows" :clear="clearSelection" />
      </div>
    </div>

    <Table :striped="striped" :size="size">
      <TableHeader>
        <TableRow>
          <TableHead v-if="selectable" class="w-10">
            <Checkbox
              :model-value="table.getIsAllRowsSelected()"
              :aria-label="selectAllLabel"
              @update:model-value="table.toggleAllRowsSelected($event)"
            />
          </TableHead>
          <TableHead v-if="showExpander" class="w-10">
            <span class="sr-only">{{ expandRowLabel }}</span>
          </TableHead>
          <TableHead
            v-for="header in table.getHeaderGroups()[0]?.headers ?? []"
            :key="header.id"
            :width="widthOf(header.column.columnDef)"
            :sort-direction="header.column.getCanSort() ? sortDirection(header.column.id) : undefined"
            :class="[resizable ? 'relative' : '', header.column.getIsPinned() ? 'bg-surface' : '']"
            :style="pinStyle(header.column)"
          >
            <button
              v-if="sortable && header.column.getCanSort()"
              type="button"
              class="inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              @click="header.column.toggleSorting()"
            >
              <FlexRender :header="header" />
              <ChevronDown v-if="sortDirection(header.column.id) === 'descending'" class="size-3.5" />
              <ChevronUp v-else-if="sortDirection(header.column.id) === 'ascending'" class="size-3.5" />
              <ChevronsUpDown v-else class="size-3.5 opacity-40" />
            </button>
            <FlexRender v-else :header="header" />
            <span
              v-if="resizable && header.column.getCanResize()"
              :class="[
                'absolute end-0 top-0 h-full w-1 touch-none select-none bg-border',
                header.column.getIsResizing() ? 'bg-primary-500' : '',
              ]"
              aria-hidden="true"
              @dblclick="header.column.resetSize()"
              @mousedown="header.getResizeHandler()($event)"
              @touchstart="header.getResizeHandler()($event)"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty v-if="!loading && !error && rows.length === 0" :columns="columnCount">
          <slot name="empty">{{ hasActiveFilters ? noResultsLabel : emptyLabel }}</slot>
        </TableEmpty>
        <template v-if="loading">
          <TableRow v-for="n in placeholderRowCount" :key="'loading-' + n">
            <TableCell v-for="c in columnCount" :key="c">
              <Skeleton height="1rem" rounded="sm" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else-if="error">
          <TableCell :colspan="columnCount" class="text-center text-error-600">
            <slot name="error">{{ error }}</slot>
          </TableCell>
        </TableRow>
        <template v-else>
          <TableRow v-if="windowRange && windowRange.paddingTop > 0" class="border-0" aria-hidden="true">
            <TableCell
              :colspan="columnCount"
              :style="{ height: `${windowRange.paddingTop}px`, padding: '0' }"
            />
          </TableRow>
          <template v-for="row in visibleRows" :key="row.id">
            <TableRow
              :clickable="showExpander"
              :data-row-id="row.id"
              :data-selected="row.getIsSelected() || undefined"
              :data-state="row.getIsExpanded() ? 'expanded' : undefined"
              @click="onRowClick($event, row.id)"
            >
              <TableCell v-if="selectable" class="w-10">
                <Checkbox
                  :model-value="row.getIsSelected()"
                  :aria-label="`${selectRowLabel} ${row.index + 1}`"
                  @update:model-value="row.toggleSelected($event)"
                />
              </TableCell>
              <TableCell v-if="showExpander" class="w-10">
                <button
                  type="button"
                  :aria-expanded="row.getIsExpanded()"
                  :aria-label="`${expandRowLabel}: ${row.index + 1}`"
                  class="rounded p-0.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  @click.stop="toggleRow(row.id)"
                >
                  <ChevronRight
                    class="size-4 transition-transform rtl:rotate-180"
                    :class="row.getIsExpanded() ? 'rotate-90' : ''"
                    aria-hidden="true"
                  />
                </button>
              </TableCell>
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="cell.column.getIsPinned() ? 'bg-surface' : ''"
                :style="pinStyle(cell.column)"
              >
                <slot
                  v-if="hasCellSlot(cell.column.id)"
                  :name="`cell-${cell.column.id}`"
                  :row="row"
                  :cell="cell"
                  :value="cell.getValue()"
                />
                <FlexRender v-else :cell="cell" />
              </TableCell>
            </TableRow>
            <TableRow
              v-if="row.getIsExpanded() && (expandable || responsiveActive)"
              class="bg-surface-muted/30"
            >
              <TableCell :colspan="columnCount">
                <dl v-if="disclosureColumns.length > 0" class="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  <template v-for="entry in disclosureFor(row)" :key="entry.id">
                    <dt class="text-sm font-medium text-muted">{{ entry.label }}</dt>
                    <dd class="text-sm text-foreground">
                      <slot
                        v-if="hasCellSlot(entry.id)"
                        :name="`cell-${entry.id}`"
                        :row="row"
                        :cell="entry.cell"
                        :value="entry.cell?.getValue()"
                      />
                      <FlexRender v-else-if="entry.cell" :cell="entry.cell" />
                    </dd>
                  </template>
                </dl>
                <slot name="expansion" :row="row" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow
            v-if="windowRange && windowRange.paddingBottom > 0"
            class="border-0"
            aria-hidden="true"
          >
            <TableCell
              :colspan="columnCount"
              :style="{ height: `${windowRange.paddingBottom}px`, padding: '0' }"
            />
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <div v-if="paginate || manual" class="border-t border-border">
      <slot name="pagination" :page-index="pageIndex" :page-size="pageSize" :total="totalRows">
        <TablePagination
          :page-index="pageIndex"
          :page-size="pageSize"
          :total="totalRows"
          :page-size-options="pageSizeOptions"
          @update:page-index="emit('update:pageIndex', $event)"
          @update:page-size="emit('update:pageSize', $event)"
        />
      </slot>
    </div>
  </div>
</template>
