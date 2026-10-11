<script setup lang="ts">
import { BarChart, Sparkline } from '@myghf/ui'

const waitTimes = [4, 6, 5, 9, 7, 11, 8, 10]

const referrals = [
  { label: 'Cardiology', value: 42 },
  { label: 'Neurology', value: 28 },
  { label: 'Oncology', value: 35 },
  { label: 'Paediatrics', value: 19 },
]
</script>

<template>
  <div class="grid gap-6">
    <div class="flex flex-wrap items-center gap-4">
      <Sparkline :data="waitTimes" label="Median wait times" />
      <Sparkline :data="waitTimes" type="area" tone="success" label="Median wait times" />
      <Sparkline :data="waitTimes" type="area" tone="danger" :width="160" :height="40" label="Median wait times" />
    </div>

    <BarChart :data="referrals" label="Referrals by unit" />
  </div>
</template>
