<script setup lang="ts">
import { ref } from 'vue'
import { TreeTable, type TreeTableColumn, type TreeNode } from '@myghf/ui'

interface Department {
  lead: string
  staff: number
}

const nodes: TreeNode<Department>[] = [
  {
    value: 'cardiology',
    label: 'Cardiology',
    data: { lead: 'Dr. Farouk', staff: 24 },
    children: [
      { value: 'echo', label: 'Echocardiography', data: { lead: 'Dr. Salem', staff: 8 } },
      { value: 'ecg', label: 'ECG', data: { lead: 'Dr. Nour', staff: 5 } },
    ],
  },
  { value: 'radiology', label: 'Radiology', data: { lead: 'Dr. Aziz', staff: 15 } },
  { value: 'oncology', label: 'Oncology', data: { lead: 'Dr. Hana', staff: 19 } },
]

const columns: TreeTableColumn[] = [
  { key: 'lead', header: 'Lead' },
  { key: 'staff', header: 'Staff', width: 'minmax(5rem, 0.5fr)', align: 'end' },
]

const expanded = ref<string[]>(['cardiology'])
</script>

<template>
  <TreeTable
    v-model:expanded="expanded"
    :nodes="nodes"
    :columns="columns"
    row-column-header="Department"
  >
    <template #cell-lead="{ node }">{{ node.data?.lead ?? '—' }}</template>
    <template #cell-staff="{ node }">{{ node.data?.staff ?? 0 }}</template>
  </TreeTable>
</template>
