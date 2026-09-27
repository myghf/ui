<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable, Tag, type DataTableFeatures } from '@myghf/ui'

interface Order {
  id: string
  patient: string
  status: 'Ready' | 'Pending'
  notes: string
}

const orders: Order[] = [
  { id: 'o1', patient: 'Amina Farouk', status: 'Ready', notes: 'Consent signed; slot booked for Thursday.' },
  { id: 'o2', patient: 'Youssef Kamal', status: 'Pending', notes: 'Awaiting the radiology report.' },
  { id: 'o3', patient: 'Layla Hassan', status: 'Ready', notes: 'Pre-op bloods completed.' },
]

const columnHelper = createColumnHelper<DataTableFeatures, Order>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('status', { header: 'Status' }),
])

const getRowId = (row: Order) => row.id
const expanded = ref<Record<string, boolean>>({})
</script>

<template>
  <DataTable
    v-model:expanded="expanded"
    :data="orders"
    :columns="columns"
    :get-row-id="getRowId"
    expandable
    empty-label="No orders"
  >
    <template #cell-status="{ value }">
      <Tag :tone="value === 'Ready' ? 'success' : 'warning'">{{ value }}</Tag>
    </template>
    <template #expansion="{ row }">
      <p class="text-sm text-muted">{{ row.original.notes }}</p>
    </template>
  </DataTable>
</template>
