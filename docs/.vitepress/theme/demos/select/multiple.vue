<script setup lang="ts">
import { ref } from 'vue'
import { Select } from '@myghf/ui'

const selected = ref<string[]>(['cardiology'])
const options = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'Paediatrics', value: 'paediatrics' },
  { label: 'Neurology', value: 'neurology' },
]
</script>

<template>
  <div class="max-w-sm">
    <Select
      v-model="selected"
      :options="options"
      multiple
      clearable
      placeholder="Choose specialties"
      aria-label="Specialties"
    />
    <p class="mt-3 text-sm text-muted">
      Selected: {{ selected.join(', ') || 'none' }}
    </p>
  </div>
</template>
