<script setup lang="ts">
import { computed } from 'vue'
import { useFormField } from '../../lib/formField'

const props = defineProps<{
  /** The id of the control this label belongs to. Falls back to the field context. */
  for?: string
  /** Renders an accessible-hidden required marker. */
  required?: boolean
}>()

const field = useFormField()
const forId = computed(() => props.for ?? field?.id.value)
</script>

<template>
  <label :for="forId" class="text-sm font-medium text-foreground text-start">
    <slot />
    <span v-if="required" class="text-error-600" aria-hidden="true">*</span>
  </label>
</template>
