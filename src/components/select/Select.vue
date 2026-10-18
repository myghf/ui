<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  type AcceptableValue,
} from 'reka-ui'
import { Check, ChevronDown, X } from '@lucide/vue'
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
    clearable?: boolean
    disabled?: boolean
    multiple?: boolean
    size?: 'sm' | 'default'
    invalid?: boolean
    id?: string
    required?: boolean
  }>(),
  // `invalid`/`required` default to `undefined` (not `false`) so Vue's Boolean
  // casting does not swallow them and they can fall through to the form field.
  { optionLabel: 'label', optionValue: 'value', placeholder: '', size: 'default', invalid: undefined, required: undefined },
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const { id, invalid, required, describedBy } = useFieldControl({
  id: () => props.id,
  invalid: () => props.invalid,
  required: () => props.required,
})

const labels = useMyGhfConfig().labels

const open = ref(false)

/** Options may be objects (optionLabel/optionValue) or primitives, as PrimeVue allowed. */
function valueOf(opt: unknown): AcceptableValue {
  if (opt && typeof opt === 'object' && props.optionValue) {
    return ((opt as Record<string, unknown>)[props.optionValue] ?? opt) as AcceptableValue
  }
  return opt as AcceptableValue
}
function labelOf(opt: unknown): string {
  if (opt && typeof opt === 'object' && props.optionLabel) {
    return String((opt as Record<string, unknown>)[props.optionLabel] ?? '')
  }
  return opt == null ? '' : String(opt)
}

const display = computed(() => {
  if (props.multiple) {
    const sel = (Array.isArray(props.modelValue) ? props.modelValue : []) as unknown[]
    return sel
      .map((v) => labelOf(props.options?.find((o) => valueOf(o) === v)))
      .filter(Boolean)
      .join(', ')
  }
  return props.modelValue == null
    ? ''
    : labelOf(props.options?.find((o) => valueOf(o) === props.modelValue))
})

const hasValue = computed(() =>
  props.multiple && Array.isArray(props.modelValue)
    ? (props.modelValue as unknown[]).length > 0
    : props.modelValue != null,
)

function onClear() {
  emit('update:modelValue', props.multiple ? [] : null)
}

const selectedOptions = computed(() =>
  props.multiple && Array.isArray(props.modelValue)
    ? (props.modelValue as unknown[]).map((v) => props.options?.find((o) => valueOf(o) === v))
    : [],
)

function remove(value: unknown) {
  emit(
    'update:modelValue',
    (Array.isArray(props.modelValue) ? props.modelValue : []).filter((v) => v !== value),
  )
}
</script>

<template>
  <SelectRoot
    v-model:open="open"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :required="required || undefined"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div
      :class="cn(
        'flex w-full flex-wrap items-center gap-1 rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-sm transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'min-h-8 text-xs' : 'min-h-9',
        invalid ? 'border-error-500 focus-within:ring-error-500' : '',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      )"
    >
      <Tag
        v-for="opt in selectedOptions"
        :key="String(valueOf(opt))"
        tone="secondary"
        removable
        @remove="remove(valueOf(opt))"
      >
        {{ labelOf(opt) }}
      </Tag>
      <SelectTrigger
        :class="cn(
          'flex-1 flex items-center border-0 bg-transparent p-0 shadow-none outline-none',
          $attrs.class as string || '',
        )"
        :id="id"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        v-bind="$attrs"
      >
        <SelectValue :placeholder="placeholder" class="flex-1 min-w-0">
          <span class="block w-full min-w-0 truncate">{{ multiple && hasValue ? '' : display || placeholder }}</span>
        </SelectValue>
      </SelectTrigger>
      <button
        v-if="clearable && hasValue"
        type="button"
        :aria-label="labels.clearSelection"
        class="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        @click.stop="onClear"
      >
        <X class="size-3.5" />
      </button>
      <button
        type="button"
        :aria-label="labels.showOptions"
        class="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        @click="open = !open"
      >
        <ChevronDown class="size-4 opacity-50" />
      </button>
    </div>
    <!-- reka-ui keeps an empty placeholder <div> in the DOM while the select is
         closed. In any `gap-*` flex container that extra zero-size item adds a
         gap, which vanishes when the popper opens — shifting sibling labels and
         controls. Rendering the content only while open drops the placeholder. -->
    <SelectPortal>
      <SelectContent
        v-if="open"
        position="popper"
        :side-offset="4"
        class="z-50 min-w-[--reka-select-trigger-width] rounded-md border border-border bg-surface p-1 shadow-popover"
      >
        <SelectItem
          v-for="opt in options"
          :key="String(valueOf(opt))"
          :value="valueOf(opt)"
          class="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 pe-8 text-sm text-foreground outline-none transition-colors focus:bg-surface-muted data-[highlighted]:bg-surface-muted data-[disabled]:opacity-50"
        >
          <SelectItemText>{{ labelOf(opt) }}</SelectItemText>
          <SelectItemIndicator class="absolute end-2 flex items-center justify-center text-primary-600">
            <Check class="size-4" />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
