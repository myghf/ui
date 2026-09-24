<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    id?: string
  }>(),
  { modelValue: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <CheckboxRoot
    :id="id"
    :model-value="modelValue"
    :disabled="disabled"
    class="peer size-4 shrink-0 rounded border border-border bg-surface shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    @update:model-value="emit('update:modelValue', $event as boolean)"
  >
    <CheckboxIndicator class="flex items-center justify-center text-white">
      <Check class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
