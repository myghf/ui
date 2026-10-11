<script setup lang="ts">
import { ref } from 'vue'
import { Upload, X } from 'lucide-vue-next'
import { cn } from '../../lib/cn'
import { useFieldControl } from '../../lib/formField'
import Progress from '../progress/Progress.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: File[]
    accept?: string
    multiple?: boolean
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    id?: string
    name?: string
    /** Prompt text shown in the drop zone. */
    prompt?: string
    /** Emphasis text appended to the prompt. */
    browseLabel?: string
    /** Prefix for each file's remove button label. */
    removeLabel?: string
    /** Resolves a per-file upload progress (0–100), or `null` to hide the bar. */
    progressFor?: (file: File) => number | null
  }>(),
  {
    modelValue: () => [],
    multiple: false,
    prompt: 'Drag and drop files here, or',
    browseLabel: 'browse',
    removeLabel: 'Remove',
    // `invalid`/`required` default to `undefined` so Boolean casting does not
    // swallow them and they can fall through to the form field context.
    invalid: undefined,
    required: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  select: [files: File[]]
  remove: [file: File]
}>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})

const dragging = ref(false)

function commit(list: FileList | File[] | null) {
  const chosen = list ? Array.from(list) : []
  const next = props.multiple ? [...props.modelValue, ...chosen] : chosen.slice(0, 1)
  emit('update:modelValue', next)
  emit('select', chosen)
}

function onChange(event: Event) {
  commit((event.target as HTMLInputElement).files)
}

function onDrop(event: DragEvent) {
  dragging.value = false
  if (props.disabled) return
  const files = event.dataTransfer?.files
  if (files && files.length > 0) commit(files)
}

function onDragOver() {
  if (!props.disabled) dragging.value = true
}

function remove(file: File) {
  emit(
    'update:modelValue',
    props.modelValue.filter((current) => current !== file),
  )
  emit('remove', file)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(1)} ${units[unit]}`
}
</script>

<template>
  <div class="w-full">
    <div
      :class="
        cn(
          'relative flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-surface px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-primary-500',
          dragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : '',
          invalid ? 'border-error-500 focus-within:ring-error-500' : '',
          disabled ? 'cursor-not-allowed opacity-50' : '',
        )
      "
      @dragenter.prevent="onDragOver"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        :id="id"
        :name="name"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :required="required || undefined"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        @change="onChange"
      />
      <Upload class="size-5 text-muted" aria-hidden="true" />
      <p class="text-sm text-foreground">
        {{ prompt }} <span class="font-medium text-primary-600">{{ browseLabel }}</span>
      </p>
      <slot />
    </div>

    <ul v-if="modelValue.length" class="mt-3 grid gap-2">
      <li
        v-for="file in modelValue"
        :key="`${file.name}-${file.size}-${file.lastModified}`"
        class="rounded-md border border-border bg-surface p-2"
      >
        <div class="flex items-center gap-2">
          <span class="min-w-0 flex-1 truncate text-sm text-foreground">{{ file.name }}</span>
          <span class="shrink-0 text-xs text-muted">{{ formatSize(file.size) }}</span>
          <button
            type="button"
            :aria-label="`${removeLabel}: ${file.name}`"
            class="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-error-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="remove(file)"
          >
            <X class="size-3.5" />
          </button>
        </div>
        <Progress
          v-if="progressFor && progressFor(file) != null"
          class="mt-2"
          :model-value="progressFor(file)"
          :label="`Upload progress for ${file.name}`"
        />
      </li>
    </ul>
  </div>
</template>
