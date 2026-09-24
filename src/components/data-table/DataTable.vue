<script setup lang="ts" generic="T extends RowData">
import { computed, ref, useSlots } from 'vue'
import { FlexRender, useTable, type ColumnDef, type RowData, type SortingState } from '@tanstack/vue-table'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-vue-next'
import { dataTableFeatures } from '../../lib/table'
import { shouldIgnoreRowToggle, toggleExpandedRow } from '../../lib/tableInteractions'
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
  }>(),
  {
    size: 'default',
    striped: false,
    sortable: true,
    emptyLabel: 'No results',
    expandable: false,
    expanded: () => ({}),
    stopRowToggleOnInteractiveCells: true,
  },
)

const emit = defineEmits<{
  'update:sorting': [value: { id: string; desc: boolean }[]]
  'update:expanded': [value: Record<string, boolean>]
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
  state: {
    get sorting() {
      return sorting.value
    },
    get expanded() {
      return props.expanded
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
})

const rows = computed(() => table.getRowModel().rows)
const columnCount = computed(() => table.getAllLeafColumns().length)

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

function onRowClick(event: MouseEvent, rowId: string) {
  emit('row-click', rows.value.find((row) => row.id === rowId)?.original)
  if (!props.expandable) return
  if (props.stopRowToggleOnInteractiveCells && shouldIgnoreRowToggle(event.target)) return
  emit('update:expanded', toggleExpandedRow(props.expanded, rowId))
}
</script>

<template>
  <div :class="maxHeight ? 'overflow-auto' : undefined" :style="maxHeight ? { maxHeight } : undefined">
    <Table :striped="striped" :size="size">
      <TableHeader>
        <TableRow>
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
        <TableEmpty v-if="rows.length === 0" :columns="columnCount">
          <slot name="empty">{{ emptyLabel }}</slot>
        </TableEmpty>
        <template v-for="row in rows" :key="row.id">
          <TableRow
            :clickable="expandable"
            :data-row-id="row.id"
            :data-state="row.getIsExpanded() ? 'expanded' : undefined"
            @click="onRowClick($event, row.id)"
          >
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
      </TableBody>
    </Table>
  </div>
</template>
