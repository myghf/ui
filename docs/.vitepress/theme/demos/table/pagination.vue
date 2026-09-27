<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@myghf/ui'

const rows = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  ref: `MYG-${String(index + 1).padStart(3, '0')}`,
  clinic: ['Cardiology', 'Radiology', 'Oncology'][index % 3],
}))

const pageIndex = ref(0)
const pageSize = ref(5)

const visible = computed(() =>
  rows.slice(pageIndex.value * pageSize.value, (pageIndex.value + 1) * pageSize.value),
)
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Reference</TableHead>
        <TableHead>Clinic</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in visible" :key="row.id">
        <TableCell>{{ row.ref }}</TableCell>
        <TableCell class="text-muted">{{ row.clinic }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <TablePagination
    v-model:page-index="pageIndex"
    v-model:page-size="pageSize"
    :total="rows.length"
    :page-size-options="[5, 10, 20]"
  />
</template>
