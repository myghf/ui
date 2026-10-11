<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable, type DataTableFeatures } from '@myghf/ui'

interface Referral {
  id: string
  patient: string
  unit: string
}

const units = ['Cardiology', 'Neurology', 'Oncology', 'Paediatrics']
const data: Referral[] = Array.from({ length: 12 }, (_, index) => ({
  id: `r${index + 1}`,
  patient: `Patient ${index + 1}`,
  unit: units[index % units.length],
}))

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('unit', { header: 'Unit' }),
])
const getRowId = (row: Referral) => row.id

const pageIndex = ref(0)
const pageSize = ref(5)
</script>

<template>
  <DataTable
    v-model:page-index="pageIndex"
    v-model:page-size="pageSize"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    paginate
  />
</template>
