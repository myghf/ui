<script setup lang="ts">
import { computed, provide, useId, useSlots } from 'vue'
import { formFieldKey } from '../../lib/formField'
import Label from '../label/Label.vue'
import FormDescription from './FormDescription.vue'
import FormMessage from './FormMessage.vue'

const props = withDefaults(
  defineProps<{
    /** Label text; can also be supplied through the `label` slot. */
    label?: string
    /** Description text; rendered below the control when present. */
    description?: string
    /** Error text; marks the field invalid and renders an alert below the control. */
    error?: string
    /** Marks the field required (adds the label marker and context flag). */
    required?: boolean
    /** Overrides the invalid state. Defaults to `Boolean(error)`. */
    invalid?: boolean
    /** Explicit control id. Defaults to a stable generated id. */
    id?: string
  }>(),
  // An explicit `undefined` keeps Vue's Boolean casting from turning an absent
  // `invalid` into `false`, so `invalid` can fall through to `Boolean(error)`.
  { invalid: undefined },
)

const slots = useSlots()

// `useId()` must run once, directly in setup — never inside a computed, which
// could be evaluated in a different instance context.
const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)
const hasDescription = computed(() => Boolean(props.description) || Boolean(slots.description))
const hasError = computed(() => Boolean(props.error) || Boolean(slots.error))
const invalid = computed(() => props.invalid ?? Boolean(props.error))
const required = computed(() => props.required ?? false)

const describedBy = computed(() => {
  const ids: string[] = []
  if (hasDescription.value) ids.push(`${fieldId.value}-description`)
  if (hasError.value) ids.push(`${fieldId.value}-error`)
  return ids.length > 0 ? ids.join(' ') : undefined
})

provide(formFieldKey, { id: fieldId, describedBy, invalid, required })
</script>

<template>
  <div class="grid gap-2">
    <Label v-if="label || $slots.label" :for="fieldId" :required="required">
      <slot name="label">{{ label }}</slot>
    </Label>

    <slot />

    <FormDescription v-if="hasDescription" :id="`${fieldId}-description`">
      <slot name="description">{{ description }}</slot>
    </FormDescription>

    <FormMessage v-if="hasError" :id="`${fieldId}-error`">
      <slot name="error">{{ error }}</slot>
    </FormMessage>
  </div>
</template>
