<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'
import { cn } from '../../lib/cn'
import { toneClasses, type Tone } from '../../lib/tones'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    /** Small text under the value. */
    hint?: string
    /** Percentage change; sign picks the tone. */
    trend?: number
    tone?: Tone
  }>(),
  { tone: 'info' },
)

const trendTone = computed<Tone>(() =>
  props.trend === undefined ? props.tone : props.trend >= 0 ? 'success' : 'danger',
)
const up = computed(() => (props.trend ?? 0) >= 0)
</script>

<template>
  <div class="rounded-lg border border-border bg-surface p-4">
    <p class="text-sm text-muted">{{ label }}</p>
    <div class="mt-1 flex items-baseline gap-2">
      <span class="text-2xl font-semibold text-foreground"><slot name="value">{{ value }}</slot></span>
      <span
        v-if="trend !== undefined"
        :class="cn('inline-flex items-center gap-0.5 text-xs font-medium', toneClasses[trendTone].icon)"
      >
        <component :is="up ? ArrowUpRight : ArrowDownRight" class="size-3.5" aria-hidden="true" />
        <span aria-hidden="true">{{ Math.abs(trend) }}%</span>
        <span class="sr-only">{{ up ? 'up' : 'down' }} {{ Math.abs(trend) }} percent</span>
      </span>
    </div>
    <p v-if="hint || $slots.hint" class="mt-1 text-xs text-muted">
      <slot name="hint">{{ hint }}</slot>
    </p>
    <slot />
  </div>
</template>
