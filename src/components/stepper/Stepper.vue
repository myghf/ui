<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { cn } from '../../lib/cn'

export interface Step {
  label: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    /** Zero-based index of the current step. */
    modelValue?: number
    steps?: Step[]
    /** Accessible name for the step list. */
    label?: string
  }>(),
  { modelValue: 0, steps: () => [], label: 'Progress' },
)

function state(index: number): 'complete' | 'current' | 'upcoming' {
  if (index < props.modelValue) return 'complete'
  return index === props.modelValue ? 'current' : 'upcoming'
}
</script>

<template>
  <div>
    <ol :aria-label="label" class="flex flex-wrap items-center gap-x-2 gap-y-3">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center gap-2"
        :aria-current="index === modelValue ? 'step' : undefined"
      >
        <span
          :class="
            cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
              state(index) === 'complete'
                ? 'bg-primary-500 text-white'
                : state(index) === 'current'
                  ? 'border-2 border-primary-500 text-primary-600'
                  : 'border border-border text-muted',
            )
          "
        >
          <Check v-if="state(index) === 'complete'" class="size-3.5" aria-hidden="true" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span
          class="text-sm"
          :class="state(index) === 'upcoming' ? 'text-muted' : 'font-medium text-foreground'"
        >
          <slot name="step" :step="step" :index="index">{{ step.label }}</slot>
        </span>
        <span
          v-if="index < steps.length - 1"
          class="hidden h-px w-6 bg-border sm:block"
          aria-hidden="true"
        />
      </li>
    </ol>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>
