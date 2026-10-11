<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  type AcceptableValue,
} from 'reka-ui'
import { Check, ChevronDown, X } from 'lucide-vue-next'
import { cn } from '../../lib/cn'
import { useMyGhfConfig } from '../../lib/config'
import { useFieldControl } from '../../lib/formField'
import Tag from '../tag/Tag.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: AcceptableValue | AcceptableValue[]
    options?: unknown[]
    optionLabel?: string
    optionValue?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyLabel?: string
    multiple?: boolean
    disabled?: boolean
    clearable?: boolean
    invalid?: boolean
    required?: boolean
    id?: string
    name?: string
    size?: 'sm' | 'default'
    /** Open on mount; useful for SSR and tests. */
    defaultOpen?: boolean
  }>(),
  // `invalid`/`required` default to `undefined` so Boolean casting does not
  // swallow them and they can fall through to the form field context.
  {
    optionLabel: 'label',
    optionValue: 'value',
    emptyLabel: 'No results',
    size: 'default',
    invalid: undefined,
    required: undefined,
    defaultOpen: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})

const labels = useMyGhfConfig().labels

const open = ref(props.defaultOpen)

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

const selectedValues = computed<unknown[]>(() =>
  props.multiple && Array.isArray(props.modelValue) ? (props.modelValue as unknown[]) : [],
)
const selectedOptions = computed(() =>
  selectedValues.value.map((value) => props.options?.find((option) => valueOf(option) === value)),
)
const hasValue = computed(() =>
  props.multiple ? selectedValues.value.length > 0 : props.modelValue != null,
)

/** Maps the model value back to a display label for the single-select input. */
function displayValue(value: unknown): string {
  return labelOf(props.options?.find((option) => valueOf(option) === value))
}

function clear() {
  emit('update:modelValue', props.multiple ? [] : null)
}
function remove(value: unknown) {
  emit(
    'update:modelValue',
    selectedValues.value.filter((current) => current !== value),
  )
}
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :name="name"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <ComboboxAnchor
      :class="
        cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary-500',
          size === 'sm' ? 'min-h-8 text-xs' : '',
          invalid ? 'border-error-500 focus-within:ring-error-500' : '',
          disabled ? 'cursor-not-allowed opacity-50' : '',
        )
      "
    >
      <Tag
        v-for="option in selectedOptions"
        :key="String(valueOf(option))"
        tone="secondary"
        removable
        @remove="remove(valueOf(option))"
      >
        {{ labelOf(option) }}
      </Tag>

      <ComboboxInput
        :id="id"
        :display-value="multiple ? undefined : displayValue"
        :placeholder="selectedOptions.length ? undefined : (searchPlaceholder ?? placeholder)"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        :aria-describedby="describedBy"
        class="min-w-16 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted"
      />

      <button
        v-if="clearable && hasValue"
        type="button"
        :aria-label="labels.clearSelection"
        class="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        @click.stop="clear"
      >
        <X class="size-3.5" />
      </button>

      <ComboboxTrigger
        :aria-label="labels.showOptions"
        class="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <ChevronDown class="size-4 opacity-70" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="4"
        class="z-50 min-w-[16rem] rounded-md border border-border bg-surface p-1 shadow-popover"
      >
        <ComboboxViewport class="max-h-64 overflow-y-auto">
          <ComboboxEmpty class="px-2 py-3 text-center text-sm text-muted">
            {{ emptyLabel }}
          </ComboboxEmpty>
          <ComboboxItem
            v-for="option in options"
            :key="String(valueOf(option))"
            :value="valueOf(option)"
            :text-value="labelOf(option)"
            class="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 pe-8 text-sm text-foreground outline-none transition-colors data-[highlighted]:bg-surface-muted data-[disabled]:opacity-50"
          >
            {{ labelOf(option) }}
            <ComboboxItemIndicator
              class="absolute end-2 flex items-center justify-center text-primary-600"
            >
              <Check class="size-4" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
