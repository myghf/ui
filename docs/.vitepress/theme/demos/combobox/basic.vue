<script setup lang="ts">
import { ref } from 'vue'
import { Combobox } from '@myghf/ui'

const unit = ref('cardio')
const units = ref(['sepsis'])

const options = [
  { label: 'Cardiology', value: 'cardio' },
  { label: 'Neurology', value: 'neuro' },
  { label: 'Oncology', value: 'onco' },
  { label: 'Paediatrics', value: 'paeds' },
  { label: 'Radiology', value: 'radio' },
]
</script>

<template>
  <div class="grid max-w-md gap-5">
    <Combobox v-model="unit" :options="options" placeholder="Search units…" clearable />
    <Combobox v-model="units" multiple :options="options" placeholder="Add a unit…" />
  </div>
</template>
