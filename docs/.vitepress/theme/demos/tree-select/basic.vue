<script setup lang="ts">
import { ref } from 'vue'
import { TreeSelect, type TreeNode } from '@myghf/ui'

const selected = ref<string[]>(['echo'])
const nodes: TreeNode[] = [
  {
    value: 'cardiology',
    label: 'Cardiology',
    children: [
      { value: 'echo', label: 'Echocardiography' },
      { value: 'ecg', label: 'ECG' },
    ],
  },
  { value: 'radiology', label: 'Radiology' },
  { value: 'mri', label: 'MRI' },
]
</script>

<template>
  <div class="max-w-sm">
    <TreeSelect v-model="selected" :nodes="nodes" placeholder="Choose services" />
    <p class="mt-3 text-sm text-muted">
      Selected leaf keys: {{ selected.join(', ') || 'none' }}
    </p>
  </div>
</template>
