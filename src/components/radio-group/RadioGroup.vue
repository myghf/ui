<script setup lang="ts">
import { useId } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot, type AcceptableValue } from 'reka-ui'
import { useFieldControl } from '../../lib/formField'

const props = withDefaults(
  defineProps<{
    modelValue?: AcceptableValue
    options?: unknown[]
    optionLabel?: string
    optionValue?: string
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    id?: string
    name?: string
  }>(),
  // `invalid`/`required` default to `undefined` so Boolean casting does not
  // swallow them and they can fall through to the form field context.
  {
    optionLabel: 'label',
    optionValue: 'value',
    orientation: 'vertical',
    invalid: undefined,
    required: undefined,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})

/** Stable base for per-option ids so each `<label for>` targets its radio. */
const baseId = useId()
const optionId = (index: number) => `${baseId}-${index}`

/** Options may be objects (optionLabel/optionValue) or primitives. */
function valueOf(option: unknown): AcceptableValue {
  if (option && typeof option === 'object') {
    return ((option as Record<string, unknown>)[props.optionValue] ?? option) as AcceptableValue
  }
  return option as AcceptableValue
}
function labelOf(option: unknown): string {
  if (option && typeof option === 'object') {
    return String((option as Record<string, unknown>)[props.optionLabel] ?? '')
  }
  return option == null ? '' : String(option)
}
function isOptionDisabled(option: unknown): boolean {
  return Boolean(option && typeof option === 'object' && (option as Record<string, unknown>).disabled)
}
</script>

<template>
  <RadioGroupRoot
    :id="id"
    :name="name"
    :model-value="modelValue"
    :disabled="disabled"
    :orientation="orientation"
    :required="required || undefined"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :class="[
      'flex',
      orientation === 'horizontal' ? 'flex-row flex-wrap items-center gap-4' : 'flex-col gap-2.5',
    ]"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-for="(option, index) in options" :key="String(valueOf(option))" class="flex items-start gap-2">
      <RadioGroupItem
        :id="optionId(index)"
        :value="valueOf(option)"
        :disabled="disabled || isOptionDisabled(option)"
        :class="[
          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-surface shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background data-[state=checked]:border-primary-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          invalid ? 'border-error-500' : '',
        ]"
      >
        <RadioGroupIndicator class="flex items-center justify-center">
          <span class="block size-2 rounded-full bg-primary-500" />
        </RadioGroupIndicator>
      </RadioGroupItem>
      <label
        :for="optionId(index)"
        class="select-none text-sm text-foreground"
        :class="disabled || isOptionDisabled(option) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      >
        <slot name="option" :option="option" :label="labelOf(option)">{{ labelOf(option) }}</slot>
      </label>
    </div>
  </RadioGroupRoot>
</template>
