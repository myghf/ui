<script setup lang="ts" generic="T extends RowData">
import { computed, ref, useSlots } from 'vue'
import {
  FlexRender,
  useTable,
  type ColumnDef,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from 'lucide-vue-next'
import { dataTableFeatures } from '../../lib/table'
import { shouldIgnoreRowToggle, toggleExpandedRow } from '../../lib/tableInteractions'
import Checkbox from '../checkbox/Checkbox.vue'
import Skeleton from '../skeleton/Skeleton.vue'
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
  },
)

const emit = defineEmits<{
  'update:sorting': [value: { id: string; desc: boolean }[]]
  'update:expanded': [value: Record<string, boolean>]
  'update:selection': [value: RowSelectionState]
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
          <slot name="empty">{{ emptyLabel }}</slot>
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
