<script setup lang="ts">
import { ref } from 'vue'
import { Select } from '@myghf/ui'

const department = ref<string | null>('cardiology')
const options = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'Paediatrics', value: 'paediatrics' },
]
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <Select
      v-model="department"
      :options="options"
      placeholder="Choose a department"
      clearable
      aria-label="Department"
    />

    <Select
      :model-value="null"
      :options="options"
      placeholder="Disabled"
      disabled
      aria-label="Disabled department"
    />
  </div>
</template>
