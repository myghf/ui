<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  type AcceptableValue,
} from 'reka-ui'
import { Check, ChevronDown, X } from 'lucide-vue-next'
import { cn } from '../../lib/cn'

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
  }>(),
  { optionLabel: 'label', optionValue: 'value', placeholder: '', size: 'default' },
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

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
</script>

<template>
  <SelectRoot
    v-model:open="open"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SelectTrigger
      :class="cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-8 text-xs' : 'h-9',
        invalid ? 'border-error-500 focus-visible:ring-error-500' : '',
        $attrs.class as string || '',
      )"
      v-bind="$attrs"
    >
      <SelectValue :placeholder="placeholder">
        <span class="truncate">{{ display || placeholder }}</span>
      </SelectValue>
      <span class="ms-auto flex shrink-0 items-center gap-1">
        <button
          v-if="clearable && hasValue"
          type="button"
          aria-label="Clear selection"
          class="rounded p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click.stop="onClear"
        >
          <X class="size-3.5" />
        </button>
        <ChevronDown class="size-4 opacity-50" />
      </span>
    </SelectTrigger>
    <!-- reka-ui keeps an empty placeholder <div> in the DOM while the select is
         closed. In any `gap-*` flex container that extra zero-size item adds a
         gap, which vanishes when the popper opens — shifting sibling labels and
         controls. Rendering the content only while open drops the placeholder. -->
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
        class="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 pr-8 text-sm text-foreground outline-none transition-colors focus:bg-surface-muted data-[highlighted]:bg-surface-muted data-[disabled]:opacity-50"
      >
        <SelectItemText>{{ labelOf(opt) }}</SelectItemText>
        <SelectItemIndicator class="absolute end-2 flex items-center justify-center text-primary-600">
          <Check class="size-4" />
        </SelectItemIndicator>
      </SelectItem>
    </SelectContent>
  </SelectRoot>
</template>
