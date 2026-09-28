<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { Button, DataTable, type DataTableFeatures } from '@myghf/ui'

interface Referral {
  id: string
  patient: string
  clinic: string
  waiting: number
}

const referrals: Referral[] = [
  { id: 'r1', patient: 'Amina Farouk', clinic: 'Cardiology', waiting: 3 },
  { id: 'r2', patient: 'Youssef Kamal', clinic: 'Radiology', waiting: 12 },
  { id: 'r3', patient: 'Layla Hassan', clinic: 'Oncology', waiting: 1 },
]

const columnHelper = createColumnHelper<DataTableFeatures, Referral>()
const columns = columnHelper.columns([
  columnHelper.accessor('patient', { header: 'Patient' }),
  columnHelper.accessor('clinic', { header: 'Clinic' }),
  columnHelper.accessor('waiting', { header: 'Waiting (days)' }),
])

const getRowId = (row: Referral) => row.id

const loading = ref(true)
</script>

<template>
  <div class="space-y-3">
    <DataTable
      :data="referrals"
      :columns="columns"
      :get-row-id="getRowId"
      :loading="loading"
      :loading-rows="3"
      loading-label="Loading referrals"
    />

    <Button variant="outline" size="sm" @click="loading = !loading">
      {{ loading ? 'Finish loading' : 'Reload' }}
    </Button>
  </div>
</template>
