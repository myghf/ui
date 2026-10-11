<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { Button, DataTable, type DataTableFeatures } from '@myghf/ui'

const data = [
  { id: 'r1', patient: 'Amina Farouk', unit: 'Cardiology' },
  { id: 'r2', patient: 'Youssef Kamal', unit: 'Neurology' },
  { id: 'r3', patient: 'Salma Nabil', unit: 'Oncology' },
]

const columnHelper = createColumnHelper<DataTableFeatures, (typeof data)[number]>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('unit', { header: 'Unit' }),
])
const getRowId = (row: (typeof data)[number]) => row.id

const selection = ref<Record<string, boolean>>({})
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
      <Button size="sm">Archive {{ rows.length }}</Button>
    </template>
  </DataTable>
</template>
