<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'
import { areaPath, linePath } from '../../lib/chart'
import { toneClasses, type Tone } from '../../lib/tones'

const props = withDefaults(
  defineProps<{
    data: number[]
    type?: 'line' | 'area'
    width?: number
    height?: number
    tone?: Tone
    /** Accessible name. When omitted the sparkline is decorative (`aria-hidden`). */
    label?: string
  }>(),
  { type: 'line', width: 120, height: 32, tone: 'info' },
)

const path = computed(() =>
  props.type === 'area'
    ? areaPath(props.data, { width: props.width, height: props.height })
    : linePath(props.data, { width: props.width, height: props.height }),
)
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    :class="cn('overflow-visible', toneClasses[tone].icon)"
  >
    <template v-if="path">
      <path v-if="type === 'area'" :d="path" fill="currentColor" fill-opacity="0.2" stroke="none" />
      <path
        v-else
        :d="path"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>
