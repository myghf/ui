<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-vue-next'
import { clampTime, sortRange, toISODate, toTime } from '../../lib/date'

const props = withDefaults(
  defineProps<{
    mode?: 'date' | 'range' | 'datetime'
    modelValue?: Date | [Date, Date] | null
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    size?: 'sm' | 'default'
    /** Applied to the trigger button so an external <label for> still matches. */
    inputId?: string
  }>(),
  { mode: 'date', placeholder: 'Select date', size: 'default' },
)

const emit = defineEmits<{ 'update:modelValue': [value: Date | [Date, Date] | null] }>()

const open = ref(false)
const viewDate = ref(new Date())
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
const time = ref('09:00')

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6]

watch(
  () => props.modelValue,
  (v) => {
    if (Array.isArray(v)) {
      start.value = v[0] ?? null
      end.value = v[1] ?? null
    } else if (v instanceof Date) {
      start.value = v
      end.value = null
    } else {
      start.value = null
      end.value = null
    }
  },
  { immediate: true },
)

const grid = computed(() => {
  const first = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null)
  const days = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0).getDate()
  for (let d = 1; d <= days; d++) cells.push(new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), d))
  return cells
})

function inRange(d: Date): boolean {
  if (!start.value || !end.value) return false
  const [s, e] = sortRange(start.value, end.value)
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime()
}

function monthLabel(): string {
  return viewDate.value.toLocaleString('en', { month: 'long', year: 'numeric' })
}

function shiftMonth(n: number) {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + n, 1)
}

function hasValue(): boolean {
  return props.mode === 'range' ? Boolean(start.value && end.value) : Boolean(start.value)
}

function pick(d: Date) {
  if (props.mode === 'range') {
    if (!start.value || end.value) {
      start.value = d
      end.value = null
    } else {
      const [s, e] = sortRange(start.value, d)
      start.value = s
      end.value = e
    }
    return
  }
  start.value = d
  if (props.mode === 'datetime') return // wait for Apply
  commit()
  open.value = false
}

function commit() {
  if (!start.value) return
  if (props.mode === 'range') {
    if (!end.value) return
    emit('update:modelValue', [start.value, end.value])
  } else if (props.mode === 'datetime') {
    emit('update:modelValue', clampTime(start.value, time.value))
  } else {
    emit('update:modelValue', start.value)
  }
}

function clear() {
  start.value = null
  end.value = null
  emit('update:modelValue', null)
  open.value = false
}

const display = computed(() => {
  if (props.mode === 'range') {
    if (!start.value || !end.value) return ''
    const [s, e] = sortRange(start.value, end.value)
    return `${toISODate(s)} – ${toISODate(e)}`
  }
  if (!start.value) return ''
  const d = props.mode === 'datetime' ? clampTime(start.value, time.value) : start.value
  return `${toISODate(d)}${props.mode === 'datetime' ? ' ' + toTime(d.getHours() * 60 + d.getMinutes()) : ''}`
})
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :id="inputId"
        :disabled="disabled"
        :class="[
          'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-primary-500',
          size === 'sm' ? 'h-8 text-xs' : 'h-9',
          invalid ? 'border-error-500' : '',
        ]"
      >
        <span :class="['truncate', display ? 'text-foreground' : 'text-muted']">{{ display || placeholder }}</span>
        <CalendarIcon class="size-4 shrink-0 text-muted" />
      </button>
    </PopoverTrigger>
    <PopoverContent
      :side-offset="4"
      class="z-50 rounded-md border border-border bg-surface p-3 shadow-popover"
    >
      <div class="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          class="rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="shiftMonth(-1)"
        >
          <ChevronLeft class="size-4" />
        </button>
        <span class="text-sm font-medium">{{ monthLabel() }}</span>
        <button
          type="button"
          aria-label="Next month"
          class="rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="shiftMonth(1)"
        >
          <ChevronRight class="size-4" />
        </button>
      </div>

      <div class="mt-2 grid grid-cols-7 gap-0.5 text-center text-xs">
        <span v-for="d in WEEKDAYS" :key="d" class="py-1 font-medium text-muted">
          {{ new Date(2026, 0, 5 + d).toLocaleDateString('en', { weekday: 'short' }) }}
        </span>
        <template v-for="(cell, i) in grid" :key="i">
          <span v-if="!cell" />
          <button
            v-else
            type="button"
            :class="[
              'flex h-8 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              inRange(cell) ? 'bg-primary-100 text-primary-800' : 'hover:bg-surface-muted',
              start && start.getTime() === cell.getTime() ? 'bg-primary-500 text-white hover:bg-primary-500' : '',
              end && end.getTime() === cell.getTime() ? 'bg-primary-500 text-white hover:bg-primary-500' : '',
            ]"
            @click="pick(cell)"
          >
            {{ cell.getDate() }}
          </button>
        </template>
      </div>

      <div v-if="mode === 'datetime'" class="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <label class="flex items-center gap-2 text-xs text-muted">
          <Clock class="size-3.5" />
          <input v-model="time" type="time" class="rounded border border-border bg-surface px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" />
        </label>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="clear"
          >
            Clear
          </button>
          <button
            type="button"
            :disabled="!start"
            class="rounded bg-primary-500 px-3 py-1 text-sm text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="commit(); open = false"
          >
            Apply
          </button>
        </div>
      </div>

      <div v-else-if="hasValue()" class="mt-3 flex justify-end border-t border-border pt-3">
        <button
          type="button"
          class="rounded px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="clear"
        >
          Clear
        </button>
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
