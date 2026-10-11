<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '../../lib/cn'
import type { Tone } from '../../lib/tones'

const props = withDefaults(
  defineProps<{
    /** Progress value. `null` (or non-finite) renders an indeterminate bar. */
    modelValue?: number | null
    max?: number
    size?: 'sm' | 'default' | 'lg'
    tone?: Tone
    /** Accessible name for the progress bar. */
    label?: string
  }>(),
  { modelValue: null, max: 100, size: 'default', tone: 'info' },
)

const SIZE_CLASSES: Record<'sm' | 'default' | 'lg', string> = {
  sm: 'h-1.5',
  default: 'h-2.5',
  lg: 'h-4',
}

const BAR_CLASSES: Record<Tone, string> = {
  info: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-error-500',
  secondary: 'bg-secondary-500',
}

/** reka needs a positive `max`; fall back to 100 rather than dividing by zero. */
const resolvedMax = computed(() => (Number.isFinite(props.max) && props.max > 0 ? props.max : 100))
const indeterminate = computed(
  () => props.modelValue == null || !Number.isFinite(props.modelValue as number),
)
const percentage = computed(() => {
  if (indeterminate.value) return 0
  const raw = (Number(props.modelValue) / resolvedMax.value) * 100
  return Math.min(100, Math.max(0, raw))
})
</script>

<template>
  <ProgressRoot
    :model-value="modelValue"
    :max="resolvedMax"
    :aria-label="label"
    :class="cn('relative w-full overflow-hidden rounded-full bg-surface-muted', SIZE_CLASSES[size])"
  >
    <ProgressIndicator
      :class="
        cn(
          'h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none',
          BAR_CLASSES[tone],
          indeterminate ? 'w-2/5 animate-pulse' : '',
        )
      "
      :style="indeterminate ? undefined : { width: `${percentage}%` }"
    />
  </ProgressRoot>
</template>
