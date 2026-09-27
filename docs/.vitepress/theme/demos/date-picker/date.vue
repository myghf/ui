<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@myghf/ui'

const date = ref<Date | null>(new Date(2026, 8, 27))
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-date">Appointment date</label>
      <DatePicker input-id="demo-date" v-model="date" />
    </div>

    <DatePicker :model-value="null" placeholder="Disabled" disabled />
  </div>
</template>
