<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useFormField } from '../../lib/formField'
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
    type?: string
    id?: string
    name?: string
    autocomplete?: string
    required?: boolean
  }>(),
  // `invalid`/`required` default to `undefined` (not `false`) so Vue's Boolean
  // casting does not swallow them and they can fall through to the form field.
  { size: 'default', type: 'text', invalid: undefined, required: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const inputRef = ref<HTMLInputElement>()
const field = useFormField()

const id = computed(() => props.id ?? field?.id.value)
const invalid = computed(() => props.invalid ?? field?.invalid.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const describedBy = computed(() => field?.describedBy.value)

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
  <div class="relative w-full">
    <Icon v-if="leadingIcon" :name="leadingIcon" class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    <input
      ref="inputRef"
      :id="id"
      :type="type"
      :name="name"
      :autocomplete="autocomplete"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
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
