<script setup lang="ts">
import { ref } from 'vue'
import { SelectButton } from '@myghf/ui'

const view = ref('day')
const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]
</script>

<template>
  <div class="grid max-w-md gap-3">
    <SelectButton v-model="view" :options="options" aria-label="Calendar view" />

    <SelectButton
      :model-value="'week'"
      :options="options"
      disabled
      aria-label="Disabled calendar view"
    />

    <p class="text-sm text-muted">View: {{ view }}</p>
  </div>
</template>
