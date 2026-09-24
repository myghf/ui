<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    feedback?: boolean
    /** Applied to the inner input so an external <label for> still matches. */
    id?: string
  }>(),
  { feedback: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const visible = ref(false)
const inputType = computed(() => (visible.value ? 'text' : 'password'))

const strength = computed(() => {
  const v = props.modelValue ?? ''
  if (v.length === 0) return 0
  let score = 0
  if (v.length >= 8) score++
  if (v.length >= 12) score++
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++
  if (/\d/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return Math.max(1, Math.min(4, Math.ceil((score / 5) * 4)))
})
</script>

<template>
  <div class="w-full">
    <div class="relative w-full">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
          invalid ? 'border-error-500 focus-visible:ring-error-500' : '',
          'pe-10',
        ]"
        v-bind="attrs"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        :disabled="disabled"
        aria-label="Toggle password visibility"
        class="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        @click="visible = !visible"
      >
        <EyeOff v-if="visible" class="size-4" />
        <Eye v-else class="size-4" />
      </button>
    </div>
    <div v-if="feedback && modelValue" class="mt-1.5 flex items-center gap-1.5" aria-hidden="true">
      <span
        v-for="i in 4"
        :key="i"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="i <= strength ? 'bg-success-500' : 'bg-surface-muted'"
      />
    </div>
  </div>
</template>
