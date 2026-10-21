<script setup lang="ts">
import { ref } from 'vue'
import { StatCard, StatusBadge, Stepper } from '@myghf/ui'

const step = ref(1)
const steps = [{ label: 'Details' }, { label: 'Payment' }, { label: 'Review' }]
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard label="Admissions" :value="128" hint="This month" :trend="12" />
      <StatCard label="Avg. wait" value="3.4 d" :trend="-5" />
      <StatCard label="Occupancy" value="86%" />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <StatusBadge tone="success" label="Stable" />
      <StatusBadge tone="warning" label="Under review" />
      <StatusBadge tone="danger" label="Critical" pulse />
    </div>

    <Stepper :model-value="step" :steps="steps" label="Checkout" />
  </div>
</template>
