<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import Icon from '../icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    leadingIcon?: string
    trailingIcon?: string
    size?: 'sm' | 'default' | 'lg'
  }>(),
  { size: 'default' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const inputRef = ref<HTMLInputElement>()

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="relative w-full">
    <Icon v-if="leadingIcon" :name="leadingIcon" class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    <input
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'flex w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-10' : 'h-9',
        leadingIcon ? 'ps-9' : 'ps-3',
        trailingIcon ? 'pe-9' : 'pe-3',
        invalid ? 'border-error-500 focus-visible:ring-error-500' : '',
      ]"
      v-bind="attrs"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <Icon v-if="trailingIcon" :name="trailingIcon" class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
  </div>
</template>
