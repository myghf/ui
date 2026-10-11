<script setup lang="ts">
import { computed, ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { Button, DataTable, downloadCsv, toCsv, type DataTableFeatures } from '@myghf/ui'

interface Referral {
  id: string
  patient: string
  unit: string
}

const data: Referral[] = [
  { id: 'r1', patient: 'Amina Farouk', unit: 'Cardiology' },
  { id: 'r2', patient: 'Youssef Kamal', unit: 'Neurology' },
  { id: 'r3', patient: 'Salma Nabil', unit: 'Oncology' },
]

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('unit', { header: 'Unit' }),
])
const getRowId = (row: Referral) => row.id

const selection = ref<Record<string, boolean>>({})
const selectedRecords = computed(() => data.filter((row) => selection.value[row.id]))

function exportSelection() {
  const csv = toCsv<Referral>(
    [
      { id: 'patient', header: 'Patient' },
      { id: 'unit', header: 'Unit' },
    ],
    selectedRecords.value,
  )
  downloadCsv('referrals.csv', csv)
}
</script>

<template>
  <DataTable
    v-model:selection="selection"
    :data="data"
    :columns="columns"
    :get-row-id="getRowId"
    selectable
  >
    <template #bulk-actions="{ rows, clear }">
      <Button size="sm" variant="outline" @click="clear">Clear</Button>
      <Button size="sm" variant="outline" @click="exportSelection">Export</Button>
      <Button size="sm">Archive {{ rows.length }}</Button>
    </template>
  </DataTable>
</template>
