<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable, type DataTableFeatures } from '@myghf/ui'

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
  columnHelper.accessor('unit', {
    header: 'Unit',
    size: 160,
    meta: { hideBelow: 'sm' },
  }),
  columnHelper.accessor('waiting', {
    header: 'Waiting (days)',
    size: 140,
    meta: { hideBelow: 'md' },
  }),
])
const getRowId = (row: Referral) => row.id
</script>

<template>
  <DataTable :data="data" :columns="columns" :get-row-id="getRowId" />
</template>
