<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { useFormField } from '../../lib/formField'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    placeholder?: string
    disabled?: boolean
    rows?: number
    invalid?: boolean
    autoResize?: boolean
    maxRows?: number
    id?: string
    required?: boolean
  }>(),
  // `invalid`/`required` default to `undefined` (not `false`) so Vue's Boolean
  // casting does not swallow them and they can fall through to the form field.
  { rows: 3, invalid: undefined, required: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const el = ref<HTMLTextAreaElement>()
const field = useFormField()
const capped = ref(false)

const id = computed(() => props.id ?? field?.id.value)
const invalid = computed(() => props.invalid ?? field?.invalid.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const describedBy = computed(() => field?.describedBy.value)

/**
 * Grows the textarea to fit its content. Guarded so jsdom (where `scrollHeight`
 * is always 0) neither throws nor writes a `NaNpx` height.
 */
function resize() {
  if (!props.autoResize || !el.value) return
  const node = el.value
  node.style.height = 'auto'
  const next = node.scrollHeight
  let height = next
  capped.value = false

  if (props.maxRows && next) {
    const lineHeight = parseFloat(getComputedStyle(node).lineHeight) || 0
    const max = props.maxRows * lineHeight
    if (max > 0 && next > max) {
      height = max
      capped.value = true
    }
  }

  node.style.height = next ? `${height}px` : ''
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  resize()
}

onMounted(resize)
watch(() => props.modelValue, resize, { flush: 'post' })
</script>

<template>
  <textarea
    ref="el"
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :class="[
      'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
      invalid ? 'border-error-500 focus-visible:ring-error-500' : '',
      autoResize ? 'resize-none' : '',
      capped ? 'overflow-y-auto' : '',
    ]"
    v-bind="attrs"
    @input="onInput"
  />
</template>
