<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper, type ColumnFiltersState } from '@tanstack/vue-table'
import { DataTable, type DataTableFeatures } from '@myghf/ui'

interface Referral {
  id: string
  patient: string
  unit: string
}

const data: Referral[] = [
  { id: 'r1', patient: 'Amina Farouk', unit: 'Cardiology' },
  { id: 'r2', patient: 'Youssef Kamal', unit: 'Neurology' },
  { id: 'r3', patient: 'Salma Nabil', unit: 'Cardiology' },
  { id: 'r4', patient: 'Omar Hatem', unit: 'Oncology' },
]

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('unit', { header: 'Unit' }),
])
const getRowId = (row: Referral) => row.id

const globalFilter = ref('')
const filters = ref<ColumnFiltersState>([{ id: 'unit', value: 'Cardiology' }])
</script>

<template>
  <DataTable
    v-model:global-filter="globalFilter"
    v-model:filters="filters"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    searchable
    search-placeholder="Search patients…"
  />
</template>
