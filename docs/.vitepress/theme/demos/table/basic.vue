<script setup lang="ts">
import { ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@myghf/ui'

const patients = [
  { id: 1, name: 'Amina Farouk', clinic: 'Cardiology', visits: 12 },
  { id: 2, name: 'Youssef Kamal', clinic: 'Radiology', visits: 4 },
  { id: 3, name: 'Layla Hassan', clinic: 'Oncology', visits: 9 },
]

const selected = ref<number | null>(null)
</script>

<template>
  <div class="space-y-3">
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Clinic</TableHead>
          <TableHead align="end">Visits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="patient in patients"
          :key="patient.id"
          clickable
          @click="selected = patient.id"
        >
          <TableCell>{{ patient.name }}</TableCell>
          <TableCell class="text-muted">{{ patient.clinic }}</TableCell>
          <TableCell align="end">{{ patient.visits }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p class="text-sm text-muted">
      {{ selected ? `Selected row #${selected}` : 'Click a row to select it.' }}
    </p>
  </div>
</template>
