<script setup lang="ts" generic="T extends RowData">
import { computed, ref, useSlots } from 'vue'
import {
  FlexRender,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from 'lucide-vue-next'
import { dataTableFeatures } from '../../lib/table'
import { shouldIgnoreRowToggle, toggleExpandedRow } from '../../lib/tableInteractions'
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
  }>(),
  {
    size: 'default',
    striped: false,
    sortable: true,
    emptyLabel: 'No results',
    expandable: false,
    expanded: () => ({}),
    stopRowToggleOnInteractiveCells: true,
    loading: false,
    loadingRows: 5,
    loadingLabel: 'Loading…',
    selectable: false,
    selection: () => ({}),
    selectAllLabel: 'Select all rows',
    selectRowLabel: 'Select row',
    selectedLabel: 'selected',
    error: undefined,
    expandRowLabel: 'Toggle row',
    searchable: false,
    searchPlaceholder: 'Search…',
    searchLabel: 'Search',
    globalFilter: '',
    filters: () => [],
    noResultsLabel: 'No results match your filters',
    clearFiltersLabel: 'Clear filters',
  },
)

const emit = defineEmits<{
  'update:sorting': [value: { id: string; desc: boolean }[]]
  'update:expanded': [value: Record<string, boolean>]
  'update:selection': [value: RowSelectionState]
  'update:globalFilter': [value: string]
  'update:filters': [value: ColumnFiltersState]
  'row-click': [row: unknown]
}>()
const slots = useSlots()

const sorting = ref<SortingState>([])
const getRowId = props.getRowId ? (row: T) => props.getRowId!(row) : undefined

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
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit(
      'update:sorting',
      sorting.value.map((s) => ({ id: s.id, desc: s.desc })),
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
})

const rows = computed(() => table.getRowModel().rows)
const selectedRows = computed(() => table.getSelectedRowModel().rows)
/** Includes the leading selection/expander columns. */
const columnCount = computed(
  () =>
    table.getAllLeafColumns().length +
    (props.selectable ? 1 : 0) +
    (props.expandable ? 1 : 0),
)
/** Clamp to at least one placeholder row so 0/negative/fractional values still render. */
const placeholderRowCount = computed(() => Math.max(1, Math.floor(props.loadingRows)))

const hasActiveFilters = computed(
  () => props.globalFilter.trim().length > 0 || props.filters.length > 0,
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
  if (!props.expandable) return
  if (props.stopRowToggleOnInteractiveCells && shouldIgnoreRowToggle(event.target)) return
  emit('update:expanded', toggleExpandedRow(props.expanded, rowId))
}
</script>

<template>
  <div
    :class="maxHeight ? 'overflow-auto' : undefined"
    :style="maxHeight ? { maxHeight } : undefined"
    :aria-busy="loading || undefined"
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
          <TableHead v-if="expandable" class="w-10">
            <span class="sr-only">{{ expandRowLabel }}</span>
          </TableHead>
          <TableHead
            v-for="header in table.getHeaderGroups()[0]?.headers ?? []"
            :key="header.id"
            :width="widthOf(header.column.columnDef)"
            :sort-direction="header.column.getCanSort() ? sortDirection(header.column.id) : undefined"
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
          <template v-for="row in rows" :key="row.id">
            <TableRow
              :clickable="expandable"
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
              <TableCell v-if="expandable" class="w-10">
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
              <TableCell v-for="cell in row.getAllCells()" :key="cell.id">
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
            <TableRow v-if="row.getIsExpanded()" class="bg-surface-muted/30">
              <TableCell :colspan="columnCount">
                <slot name="expansion" :row="row" />
              </TableCell>
            </TableRow>
          </template>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
