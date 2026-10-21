<script setup lang="ts">
import { cn } from '../../lib/cn'
import { toneClasses, type Tone } from '../../lib/tones'

withDefaults(
  defineProps<{
    title?: string
    /** Timestamp shown next to the title. */
    time?: string
    tone?: Tone
  }>(),
  { tone: 'info' },
)
</script>

<template>
  <li
    class="relative !m-0 flex gap-3 after:absolute after:start-[4.5px] after:top-3.5 after:-bottom-5 after:w-px after:bg-border after:content-[''] last:after:hidden"
  >
    <span :class="cn('mt-1 block size-2.5 shrink-0 rounded-full bg-current', toneClasses[tone].icon)" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-baseline gap-x-2">
        <span class="text-sm font-medium text-foreground">
          <slot name="title">{{ title }}</slot>
        </span>
        <time v-if="time" class="text-xs text-muted">{{ time }}</time>
      </div>
      <div v-if="$slots.default" class="mt-0.5 text-sm text-muted">
        <slot />
      </div>
    </div>
  </li>
</template>
