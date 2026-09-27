<script setup lang="ts">
import { Icon } from '@myghf/ui'

const icons = [
  { name: 'heart', usage: 'Brand / cardiology' },
  { name: 'chart-line', usage: 'Analytics' },
  { name: 'calendar', usage: 'Appointments' },
  { name: 'stethoscope', usage: 'Clinical' },
]
</script>

<template>
  <ul class="grid gap-3 sm:grid-cols-2">
    <li
      v-for="item in icons"
      :key="item.name"
      class="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
    >
      <Icon :name="item.name" class="size-5 text-primary-500" />
      <span class="text-sm text-foreground">
        <code class="text-xs">{{ item.name }}</code>
        <span class="block text-xs text-muted">{{ item.usage }}</span>
      </span>
    </li>
  </ul>
</template>
