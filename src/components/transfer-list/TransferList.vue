<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import Button from '../button/Button.vue'
import Checkbox from '../checkbox/Checkbox.vue'

const props = withDefaults(
  defineProps<{
    options: { value: string; label: string }[]
    modelValue?: string[]
    sourceLabel?: string
    targetLabel?: string
    disabled?: boolean
  }>(),
  { sourceLabel: 'Available', targetLabel: 'Selected', disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const selected = ref(new Set<string>(props.modelValue ?? []))
const sourceSel = ref(new Set<string>())
const targetSel = ref(new Set<string>())

const left = computed(() => props.options.filter((o) => !selected.value.has(o.value)))
const right = computed(() => props.options.filter((o) => selected.value.has(o.value)))

function sync() {
  emit('update:modelValue', right.value.map((o) => o.value))
}

function toggle(set: Set<string>, value: string) {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  set.clear()
  for (const v of next) set.add(v)
}

function moveToTarget() {
  for (const v of sourceSel.value) selected.value.add(v)
  sourceSel.value.clear()
  sync()
}
function moveToSource() {
  for (const v of targetSel.value) selected.value.delete(v)
  targetSel.value.clear()
  sync()
}
function moveAllTarget() {
  for (const o of props.options) selected.value.add(o.value)
  sourceSel.value.clear()
  sync()
}
function moveAllSource() {
  selected.value.clear()
  targetSel.value.clear()
  sync()
}
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
    <div :class="['flex min-h-40 flex-1 flex-col rounded-md border border-border bg-surface', disabled && 'opacity-50']">
      <div class="border-b border-border px-3 py-2 text-xs font-medium text-muted">
        <slot name="source-header">{{ sourceLabel }}</slot>
      </div>
      <ul class="max-h-64 flex-1 overflow-y-auto p-1">
        <li v-for="o in left" :key="o.value">
          <button
            type="button"
            :disabled="disabled"
            class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed"
            @click="toggle(sourceSel, o.value)"
          >
            <Checkbox :model-value="sourceSel.has(o.value)" :disabled="disabled" @click.stop @update:model-value="toggle(sourceSel, o.value)" />
            <slot name="item" :option="o">
              <span class="truncate">{{ o.label }}</span>
            </slot>
          </button>
        </li>
        <li v-if="left.length === 0" class="px-2 py-1.5 text-sm text-muted">Empty</li>
      </ul>
    </div>

    <div class="flex flex-row items-center justify-center gap-1 sm:flex-col">
      <Button variant="outline" size="icon-sm" :disabled="disabled || sourceSel.size === 0" aria-label="Move selected to target" @click="moveToTarget">
        <ChevronRight class="size-4" />
      </Button>
      <Button variant="outline" size="icon-sm" :disabled="disabled || targetSel.size === 0" aria-label="Move selected to source" @click="moveToSource">
        <ChevronLeft class="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" :disabled="disabled" aria-label="Move all to target" @click="moveAllTarget">
        <ChevronsRight class="size-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" :disabled="disabled" aria-label="Move all to source" @click="moveAllSource">
        <ChevronsLeft class="size-4" />
      </Button>
    </div>

    <div :class="['flex min-h-40 flex-1 flex-col rounded-md border border-border bg-surface', disabled && 'opacity-50']">
      <div class="border-b border-border px-3 py-2 text-xs font-medium text-muted">
        <slot name="target-header">{{ targetLabel }}</slot>
      </div>
      <ul class="max-h-64 flex-1 overflow-y-auto p-1">
        <li v-for="o in right" :key="o.value">
          <button
            type="button"
            :disabled="disabled"
            class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed"
            @click="toggle(targetSel, o.value)"
          >
            <Checkbox :model-value="targetSel.has(o.value)" :disabled="disabled" @click.stop @update:model-value="toggle(targetSel, o.value)" />
            <slot name="item" :option="o">
              <span class="truncate">{{ o.label }}</span>
            </slot>
          </button>
        </li>
        <li v-if="right.length === 0" class="px-2 py-1.5 text-sm text-muted">Empty</li>
      </ul>
    </div>
  </div>
</template>
