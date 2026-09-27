<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from '@myghf/ui'

const price = ref<number | null>(1250.5)
const ratio = ref<number | null>(0.75)
const weight = ref<number | null>(72.5)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <InputNumber v-model="price" currency="USD" locale="en-US" :min="0" aria-label="Price" />

    <InputNumber
      v-model="ratio"
      locale="en-US"
      :format-options="{ style: 'percent', maximumFractionDigits: 0 }"
      aria-label="Ratio"
    />

    <InputNumber
      v-model="weight"
      :step="0.25"
      step-snapping
      :min="0"
      suffix="kg"
      aria-label="Weight"
    />
  </div>
</template>
