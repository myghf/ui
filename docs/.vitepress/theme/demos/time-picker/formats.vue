<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from '@myghf/ui'

const visit = ref<string | null>(null)
const shift = ref<string | null>('14:00')
</script>

<template>
  <div class="grid max-w-sm gap-4">
    <TimePicker v-model="visit" hour-format="12" :minute-step="15" locale="en-US" placeholder="Visit time" />

    <TimePicker v-model="shift" :minute-step="30" placeholder="Shift start (24-hour)" />
  </div>
</template>
