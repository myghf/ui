<script setup lang="ts">
import { AccordionRoot } from 'reka-ui'

withDefaults(
  defineProps<{
    /** Open item value(s). Bind with `v-model`. */
    modelValue?: string | string[]
    type?: 'single' | 'multiple'
    /** When `single`, allow closing the open item. */
    collapsible?: boolean
    disabled?: boolean
  }>(),
  { type: 'single', collapsible: true, disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()
</script>

<template>
  <AccordionRoot
    :type="type"
    :collapsible="collapsible"
    :disabled="disabled"
    :model-value="modelValue"
    class="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface"
    @update:model-value="emit('update:modelValue', $event as string | string[])"
  >
    <slot />
  </AccordionRoot>
</template>
