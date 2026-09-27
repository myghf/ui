<script setup lang="ts">
import { Icon } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-end gap-4">
      <Icon name="heart" />
      <Icon name="chart-line" :size="20" />
      <Icon name="calendar" :size="24" />
      <Icon name="stethoscope" :size="32" />
    </div>
    <div class="flex items-center gap-2 text-sm text-muted">
      <Icon name="not-a-real-icon" />
      <span>Unknown names fall back to a circle, so a wrong name is visible rather than silent.</span>
    </div>
  </div>
</template>
