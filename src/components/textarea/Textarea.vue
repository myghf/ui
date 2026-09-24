<script setup lang="ts">
import { useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    placeholder?: string
    disabled?: boolean
    rows?: number
    invalid?: boolean
  }>(),
  { rows: 3 },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="[
      'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
      invalid ? 'border-error-500 focus-visible:ring-error-500' : '',
    ]"
    v-bind="attrs"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
