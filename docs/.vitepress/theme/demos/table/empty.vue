<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@myghf/ui'

const showEmpty = ref(false)
const rows = [
  { id: 1, ref: 'MYG-001', clinic: 'Cardiology' },
  { id: 2, ref: 'MYG-002', clinic: 'Radiology' },
]
</script>

<template>
  <div class="space-y-3">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Clinic</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="showEmpty">
          <TableEmpty :columns="2" label="No referrals yet" />
        </template>
        <TableRow v-for="row in rows" v-else :key="row.id">
          <TableCell>{{ row.ref }}</TableCell>
          <TableCell class="text-muted">{{ row.clinic }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="outline" size="sm" @click="showEmpty = !showEmpty">
      {{ showEmpty ? 'Show rows' : 'Show empty state' }}
    </Button>
  </div>
</template>
