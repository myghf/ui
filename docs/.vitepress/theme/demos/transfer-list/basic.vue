<script setup lang="ts">
import { ref } from 'vue'
import { TransferList } from '@myghf/ui'

const ordered = ref<string[]>(['ecg'])
const options = [
  { value: 'echo', label: 'Echocardiography' },
  { value: 'ecg', label: 'ECG' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct', label: 'CT scan' },
]
</script>

<template>
  <div class="max-w-2xl">
    <TransferList
      v-model="ordered"
      :options="options"
      source-label="Available services"
      target-label="Ordered"
    />
    <p class="mt-3 text-sm text-muted">Ordered: {{ ordered.join(', ') || 'none' }}</p>
  </div>
</template>
