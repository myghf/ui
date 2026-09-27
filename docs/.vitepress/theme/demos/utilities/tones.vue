<script setup lang="ts">
import { Icon, toneClasses, type Tone } from '@myghf/ui'

const tones: Tone[] = ['info', 'success', 'warning', 'danger', 'secondary']

const icons: Record<Tone, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-alert',
  secondary: 'info',
}
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <div
      v-for="tone in tones"
      :key="tone"
      :class="['flex items-start gap-3 rounded-lg p-3', toneClasses[tone].soft]"
    >
      <Icon :name="icons[tone]" :class="toneClasses[tone].icon" />
      <div class="text-sm">
        <p class="font-medium capitalize">{{ tone }}</p>
        <p class="text-xs">
          role: <code>{{ toneClasses[tone].role }}</code>
        </p>
      </div>
    </div>
  </div>
</template>
