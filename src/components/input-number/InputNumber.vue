<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'
import { computed, useAttrs } from 'vue'
import Icon from '../icon/Icon.vue'
import { mergeFormatOptions, toNumberOrNull } from '../../lib/number'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    stepSnapping?: boolean
    integer?: boolean
    locale?: string
    formatOptions?: Intl.NumberFormatOptions
    currency?: string
    prefix?: string
    suffix?: string
    showButtons?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    size?: 'sm' | 'default' | 'lg'
    id?: string
    name?: string
  }>(),
  { step: 1, size: 'default' },
)

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()
const attrs = useAttrs()

/** Never hand reka a non-positive or non-finite step; it would loop or divide by zero. */
const safeStep = computed(() => (Number.isFinite(props.step) && props.step > 0 ? props.step : 1))

const resolvedFormatOptions = computed(() =>
  mergeFormatOptions({
    currency: props.currency,
    formatOptions: props.formatOptions,
    integer: props.integer,
  }),
)
</script>

<template>
  <div
    class="relative flex w-full items-center rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary-500"
    :class="[
      size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-10' : 'h-9',
      invalid ? 'border-error-500 focus-within:ring-error-500' : '',
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
  >
    <NumberFieldRoot
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="safeStep"
      :step-snapping="stepSnapping"
      :format-options="resolvedFormatOptions"
      :locale="locale"
      :disabled="disabled"
      :readonly="readonly"
      :id="id"
      :name="name"
      class="flex min-w-0 flex-1 items-center gap-1"
      @update:model-value="emit('update:modelValue', toNumberOrNull($event))"
    >
      <span v-if="prefix" class="shrink-0 select-none text-muted">{{ prefix }}</span>

      <NumberFieldInput
        v-bind="attrs"
        :placeholder="placeholder"
        class="min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-muted focus-visible:outline-none disabled:cursor-not-allowed"
      />

      <span v-if="suffix" class="shrink-0 select-none text-muted">{{ suffix }}</span>

      <div v-if="showButtons" class="ms-1 flex shrink-0 flex-col">
        <NumberFieldIncrement
          class="flex size-4 items-center justify-center rounded text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="chevron-up" :size="12" />
        </NumberFieldIncrement>
        <NumberFieldDecrement
          class="flex size-4 items-center justify-center rounded text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="chevron-down" :size="12" />
        </NumberFieldDecrement>
      </div>
    </NumberFieldRoot>
  </div>
</template>
