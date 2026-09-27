<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@myghf/ui'

const admission = ref<[Date, Date] | null>(null)
const appointment = ref<Date | null>(null)
</script>

<template>
  <div class="grid max-w-sm gap-4">
    <DatePicker v-model="admission" mode="range" placeholder="Admission – discharge" />

    <DatePicker
      v-model="appointment"
      mode="datetime"
      hour-format="12"
      :minute-step="15"
      locale="en-US"
      placeholder="Appointment date and time"
    />
  </div>
</template>
