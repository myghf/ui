<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { useFieldControl } from '../../lib/formField'

const switchVariants = tv({
  base: 'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-surface-muted',
  variants: {
    size: {
      default: 'h-5 w-9',
      sm: 'h-4 w-7',
    },
  },
  defaultVariants: { size: 'default' },
})

const thumbVariants = tv({
  base: 'pointer-events-none block rounded-full bg-surface shadow-sm transition-transform data-[state=unchecked]:translate-x-0',
  variants: {
    size: {
      default: 'size-4 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4',
      sm: 'size-3 data-[state=checked]:translate-x-3 rtl:data-[state=checked]:-translate-x-3',
    },
  },
  defaultVariants: { size: 'default' },
})

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    id?: string
    name?: string
    size?: VariantProps<typeof switchVariants>['size']
  }>(),
  // `invalid`/`required` default to `undefined` so Boolean casting does not
  // swallow them and they can fall through to the form field context.
  { modelValue: false, invalid: undefined, required: undefined, size: 'default' },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})
</script>

<template>
  <SwitchRoot
    :id="id"
    :name="name"
    :model-value="modelValue"
    :disabled="disabled"
    :required="required || undefined"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :class="[switchVariants({ size }), invalid ? 'border-error-500' : '']"
    @update:model-value="emit('update:modelValue', $event as boolean)"
  >
    <SwitchThumb :class="thumbVariants({ size })" />
  </SwitchRoot>
</template>
