<script setup lang="ts">
import { computed } from 'vue'
import { toneClasses, type Tone } from '../../lib/tones'
import { cn } from '../../lib/cn'
import Icon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'default' | 'lg'
    label?: string
    tone?: Tone
  }>(),
  { size: 'default', label: 'Loading…', tone: 'info' },
)

const SIZE_CLASSES: Record<'sm' | 'default' | 'lg', string> = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-6',
}

const classes = computed(() => cn('inline-flex items-center', toneClasses[props.tone].icon))
</script>

<template>
  <span role="status" aria-live="polite" :class="classes">
    <Icon
      name="loader-circle"
      :class="cn('animate-spin', SIZE_CLASSES[size])"
      aria-hidden="true"
    />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
