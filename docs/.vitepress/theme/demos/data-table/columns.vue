<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper, type ColumnPinningState } from '@tanstack/vue-table'
import { Checkbox, DataTable, type DataTableFeatures } from '@myghf/ui'

interface Referral {
  id: string
  patient: string
  unit: string
  waiting: number
}

const data: Referral[] = [
  { id: 'r1', patient: 'Amina Farouk', unit: 'Cardiology', waiting: 3 },
  { id: 'r2', patient: 'Youssef Kamal', unit: 'Neurology', waiting: 12 },
  { id: 'r3', patient: 'Salma Nabil', unit: 'Oncology', waiting: 7 },
]

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient', size: 200 }),
  columnHelper.accessor('unit', { header: 'Unit', size: 160 }),
  columnHelper.accessor('waiting', { header: 'Waiting (days)', size: 140, meta: { align: 'end' } }),
])
const getRowId = (row: Referral) => row.id

const visibility = ref<Record<string, boolean>>({})
const pinning = ref<ColumnPinningState>({ start: [], end: [] })
</script>

<template>
  <DataTable
    v-model:column-visibility="visibility"
    v-model:column-pinning="pinning"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    resizable
  >
    <template #toolbar>
      <label class="flex items-center gap-1.5 text-xs text-muted">
        <Checkbox
          :model-value="visibility.waiting !== false"
          @update:model-value="(value) => (visibility.waiting = Boolean(value))"
        />
        Waiting column
      </label>
      <label class="flex items-center gap-1.5 text-xs text-muted">
        <Checkbox
          :model-value="pinning.start?.includes('patient') ?? false"
          @update:model-value="(value) => (pinning.start = value ? ['patient'] : [])"
        />
        Pin patient
      </label>
    </template>
  </DataTable>
</template>
