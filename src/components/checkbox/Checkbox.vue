<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { Check } from 'lucide-vue-next'
import { useFieldControl } from '../../lib/formField'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    id?: string
  }>(),
  // `invalid`/`required` default to `undefined` so Boolean casting does not
  // swallow them and they can fall through to the form field context.
  { modelValue: false, invalid: undefined, required: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})
</script>

<template>
  <CheckboxRoot
    :id="id"
    :model-value="modelValue"
    :disabled="disabled"
    :required="required || undefined"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    class="peer size-4 shrink-0 rounded border border-border bg-surface shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    :class="invalid ? 'border-error-500' : ''"
    @update:model-value="emit('update:modelValue', $event as boolean)"
  >
    <CheckboxIndicator class="flex items-center justify-center text-white">
      <Check class="size-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
