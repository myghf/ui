<script setup lang="ts">
import { ref } from 'vue'
import { SelectButton } from '@myghf/ui'

const size = ref('m')
const options = [
  { label: 'S', value: 's' },
  { label: 'M', value: 'm' },
  { label: 'L', value: 'l' },
  { label: 'XL', value: 'xl' },
]
</script>

<template>
  <div class="grid max-w-md gap-3">
    <div class="border border-border p-3">
      <SelectButton v-model="size" :options="options" aria-label="Fits content" />
    </div>

    <div class="border border-border p-3">
      <SelectButton v-model="size" :options="options" block aria-label="Fills container" />
    </div>

    <p class="text-sm text-muted">Size: {{ size }}</p>
  </div>
</template>
