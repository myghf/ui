<script setup lang="ts">
import { computed, onBeforeUpdate, provide, ref, useId, useSlots } from 'vue'
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

// Slot functions are not reactive: Vue mutates the `slots` object in place
// during the parent's update, which happens just before this component's
// `onBeforeUpdate` hook. Bumping a version counter here invalidates `describedBy`
// when a slot is added or removed after mount, so consumers re-read the
// description/error ids instead of sticking to their initial value.
const slotsVersion = ref(0)
onBeforeUpdate(() => {
  slotsVersion.value++
})

// `useId()` must run once, directly in setup — never inside a computed, which
// could be evaluated in a different instance context.
const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)
const invalid = computed(() => props.invalid ?? Boolean(props.error))
const required = computed(() => props.required ?? false)

// Description/error content can come from a prop or a slot. `slotsVersion` is
// read so slot-presence changes invalidate this computed; the template checks
// `$slots` at render time for actually rendering the element.
const describedBy = computed(() => {
  void slotsVersion.value
  const ids: string[] = []
  if (props.description || slots.description) ids.push(`${fieldId.value}-description`)
  if (props.error || slots.error) ids.push(`${fieldId.value}-error`)
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

    <FormDescription v-if="description || $slots.description" :id="`${fieldId}-description`">
      <slot name="description">{{ description }}</slot>
    </FormDescription>

    <FormMessage v-if="error || $slots.error" :id="`${fieldId}-error`">
      <slot name="error">{{ error }}</slot>
    </FormMessage>
  </div>
</template>
