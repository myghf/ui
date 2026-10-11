<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@myghf/ui'

const alerts = ref(true)
const digest = ref(false)
</script>

<template>
  <div class="grid max-w-md gap-3">
    <label class="flex items-center justify-between gap-3 text-sm text-foreground">
      Enable alerts
      <Switch v-model="alerts" />
    </label>

    <label class="flex items-center justify-between gap-3 text-sm text-foreground">
      Daily digest
      <Switch v-model="digest" size="sm" />
    </label>

    <label class="flex items-center justify-between gap-3 text-sm text-muted">
      Locked by your administrator
      <Switch :model-value="true" disabled />
    </label>
  </div>
</template>
