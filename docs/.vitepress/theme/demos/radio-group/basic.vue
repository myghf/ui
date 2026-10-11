<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup } from '@myghf/ui'

const priority = ref('normal')
const contact = ref('email')

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
]
</script>

<template>
  <div class="grid max-w-md gap-5">
    <RadioGroup v-model="priority" :options="priorityOptions" />

    <RadioGroup
      v-model="contact"
      orientation="horizontal"
      :options="[
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'SMS (unavailable)', value: 'sms', disabled: true },
      ]"
    />
  </div>
</template>
