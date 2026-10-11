<script setup lang="ts">
import { onMounted } from 'vue'
import { toneClasses } from '../../lib/tones'
import Icon from '../icon/Icon.vue'

export interface FormError {
  /** Id of the control to focus when this entry is activated. */
  id: string
  /** The error message. */
  message: string
  /** Optional field label, rendered as a prefix. */
  label?: string
}

const props = withDefaults(
  defineProps<{
    /** The errors to summarize. Nothing renders while the list is empty. */
    errors?: FormError[]
    /** Heading shown above the list. */
    title?: string
    /** Focus and scroll to the first linked control when the summary mounts. */
    focusFirst?: boolean
  }>(),
  { errors: () => [], title: 'Please fix the following:', focusFirst: false },
)

function focusField(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.focus()
  // Not implemented in jsdom; also absent in some embedded environments.
  el.scrollIntoView?.({ block: 'center' })
}

onMounted(() => {
  if (props.focusFirst && props.errors.length > 0) focusField(props.errors[0].id)
})
</script>

<template>
  <div
    v-if="errors.length > 0"
    role="alert"
    :class="['rounded-lg p-4 text-sm', toneClasses.danger.soft]"
  >
    <p class="flex items-center gap-2 font-medium">
      <Icon name="circle-alert" :class="['size-4 shrink-0', toneClasses.danger.icon]" />
      {{ title }}
    </p>
    <ul class="mt-2 grid gap-1 ps-6">
      <li v-for="error in errors" :key="error.id">
        <button
          type="button"
          class="rounded text-start underline underline-offset-2 transition-colors hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="focusField(error.id)"
        >
          <template v-if="error.label">{{ error.label }}: </template>{{ error.message }}
        </button>
      </li>
    </ul>
  </div>
</template>
