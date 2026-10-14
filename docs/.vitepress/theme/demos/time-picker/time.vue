<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from '@myghf/ui'

const appointment = ref<string | null>('09:30')
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-time">Appointment time</label>
      <TimePicker input-id="demo-time" v-model="appointment" />
    </div>

    <TimePicker :model-value="null" placeholder="Disabled" disabled />
  </div>
</template>
