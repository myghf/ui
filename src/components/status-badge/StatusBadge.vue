<script setup lang="ts">
import { cn } from '../../lib/cn'
import { toneClasses, type Tone } from '../../lib/tones'

withDefaults(
  defineProps<{
    tone?: Tone
    /** Label text. Falls back to the default slot. */
    label?: string
    /** Animate the dot for a live/active status. */
    pulse?: boolean
  }>(),
  { tone: 'info', pulse: false },
)
</script>

<template>
  <span
    :class="cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium', toneClasses[tone].soft)"
  >
    <span :class="cn('relative flex size-1.5 shrink-0', toneClasses[tone].icon)">
      <span
        v-if="pulse"
        class="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60"
        aria-hidden="true"
      />
      <span class="relative inline-flex size-1.5 rounded-full bg-current" aria-hidden="true" />
    </span>
    <slot>{{ label }}</slot>
  </span>
</template>
