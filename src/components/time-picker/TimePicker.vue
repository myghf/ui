<script setup lang="ts">
import { computed, ref, useSlots, watch, type VNode } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { Clock } from '@lucide/vue'
import { useFieldControl } from '../../lib/formField'
import {
  buildHourOptions,
  buildMinuteOptions,
  from12Hour,
  to12Hour,
  toTime,
} from '../../lib/date'
import { formatLocalizedTime } from '../../lib/locale'

export interface TimeLabels {
  placeholder: string
  clear: string
  apply: string
  time: string
  hour: string
  minute: string
  am: string
  pm: string
}

const LABELS: Record<string, TimeLabels> = {
  en: {
    placeholder: 'Select time',
    clear: 'Clear',
    apply: 'Apply',
    time: 'Time',
    hour: 'Hour',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  fr: {
    placeholder: "Choisir l'heure",
    clear: 'Effacer',
    apply: 'Appliquer',
    time: 'Heure',
    hour: 'Heure',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  es: {
    placeholder: 'Seleccionar hora',
    clear: 'Borrar',
    apply: 'Aplicar',
    time: 'Hora',
    hour: 'Hora',
    minute: 'Minuto',
    am: 'AM',
    pm: 'PM',
  },
  de: {
    placeholder: 'Uhrzeit wählen',
    clear: 'Löschen',
    apply: 'Übernehmen',
    time: 'Uhrzeit',
    hour: 'Stunde',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  ar: {
    placeholder: 'اختر الوقت',
    clear: 'مسح',
    apply: 'تطبيق',
    time: 'الوقت',
    hour: 'الساعة',
    minute: 'الدقيقة',
    am: 'ص',
    pm: 'م',
  },
}

function defaultLabels(locale: string): TimeLabels {
  const lang = locale.toLowerCase().split(/[-_]/)[0]
  return LABELS[lang] ?? LABELS.en
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    /** @deprecated Prefer `labels.placeholder`; kept for the existing trigger API. */
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    size?: 'sm' | 'default'
    /** Applied to the trigger button so an external <label for> still matches. */
    inputId?: string
    hourFormat?: '12' | '24'
    minuteStep?: number
    locale?: string
    labels?: Partial<TimeLabels>
    defaultOpen?: boolean
  }>(),
  {
    size: 'default',
    hourFormat: '24',
    minuteStep: 1,
    // `invalid` defaults to `undefined` so Boolean casting does not swallow it
    // and it can fall through to the form field context.
    invalid: undefined,
    // Runtime locale, best-effort, falling back to English. Inlined because
    // `withDefaults` is hoisted and cannot reference local declarations.
    locale: () => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().locale || 'en'
      } catch {
        return 'en'
      }
    },
    defaultOpen: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const slots = useSlots()

const { id, invalid, describedBy } = useFieldControl({
  id: () => props.inputId,
  invalid: () => props.invalid,
})

const triggerRef = ref<HTMLButtonElement>()

const open = ref(props.defaultOpen ?? false)
const time = ref('09:00')

const effectiveLocale = computed(() => props.locale || 'en')

const resolvedLabels = computed<TimeLabels>(() => ({
  ...defaultLabels(effectiveLocale.value),
  // The legacy `placeholder` prop fills in only when the new labels API has no
  // value; `labels.placeholder` is spread last so it wins over both.
  ...(props.placeholder !== undefined ? { placeholder: props.placeholder } : {}),
  ...props.labels,
}))

function flatten(node: unknown): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flatten).join('')
  const vnode = node as VNode
  if (typeof vnode.children === 'string') return vnode.children
  if (Array.isArray(vnode.children)) return vnode.children.map(flatten).join('')
  return ''
}

/** `label-<key>` slot text when supplied, otherwise the resolved label. */
function labelFor(key: keyof TimeLabels): string {
  const slot = slots[`label-${key}`]
  if (slot) {
    const text = slot().map(flatten).join('').trim()
    if (text) return text
  }
  return resolvedLabels.value[key]
}

/** Accepts `H:MM`–`HH:MM` and returns a normalized `HH:MM`, or `null`. */
function parseTime(value: string): string | null {
  const [h, m] = value.split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  const hour = Math.trunc(h)
  const minute = Math.trunc(m)
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return toTime(hour * 60 + minute)
}

watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'string') {
      const parsed = parseTime(v)
      if (parsed) time.value = parsed
    }
  },
  { immediate: true },
)

const parsedTime = computed(() => {
  const [h, m] = time.value.split(':').map(Number)
  return {
    hour24: Number.isFinite(h) ? ((Math.trunc(h) % 24) + 24) % 24 : 0,
    minute: Number.isFinite(m) ? ((Math.trunc(m) % 60) + 60) % 60 : 0,
  }
})

const hourOptions = computed(() => buildHourOptions(props.hourFormat))
const minuteOptions = computed(() =>
  buildMinuteOptions(Math.min(30, Math.max(1, props.minuteStep ?? 1))),
)

const selectedHour = computed<number>({
  get: () =>
    props.hourFormat === '12' ? to12Hour(parsedTime.value.hour24).hour : parsedTime.value.hour24,
  set: (value) => {
    const { hour24, minute } = parsedTime.value
    const next =
      props.hourFormat === '12' ? from12Hour(value, to12Hour(hour24).meridiem) : value
    time.value = toTime(next * 60 + minute)
  },
})

const selectedMinute = computed<number>({
  get: () => parsedTime.value.minute,
  set: (value) => {
    time.value = toTime(parsedTime.value.hour24 * 60 + value)
  },
})

const selectedMeridiem = computed<'am' | 'pm'>({
  get: () => to12Hour(parsedTime.value.hour24).meridiem,
  set: (value) => {
    const { hour } = to12Hour(parsedTime.value.hour24)
    time.value = toTime(from12Hour(hour, value) * 60 + parsedTime.value.minute)
  },
})

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const display = computed(() => {
  if (props.modelValue == null) return ''
  const parsed = parseTime(props.modelValue)
  if (!parsed) return ''
  const [h, m] = parsed.split(':').map(Number)
  return formatLocalizedTime(new Date(2026, 0, 1, h, m), effectiveLocale.value, props.hourFormat)
})

function commit() {
  emit('update:modelValue', time.value)
}

function clear() {
  emit('update:modelValue', null)
  open.value = false
}

defineExpose({ focus: () => triggerRef.value?.focus() })
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        ref="triggerRef"
        type="button"
        :id="id"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :class="[
          'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-foreground shadow-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-primary-500',
          size === 'sm' ? 'h-8 text-xs' : 'h-9',
          invalid ? 'border-error-500' : '',
        ]"
      >
        <span :class="['truncate', display ? 'text-foreground' : 'text-muted']">{{ display || labelFor('placeholder') }}</span>
        <Clock class="size-4 shrink-0 text-muted" />
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        class="z-50 rounded-md border border-border bg-surface p-3 shadow-popover"
      >
        <div role="group" :aria-label="labelFor('time')" class="flex items-center gap-1.5 text-xs text-muted">
          <select
            v-model.number="selectedHour"
            data-test="hours"
            :aria-label="labelFor('hour')"
            class="rounded border border-border bg-surface px-1.5 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option v-for="h in hourOptions" :key="h" :value="h">
              {{ hourFormat === '12' ? h : pad(h) }}
            </option>
          </select>
          <span aria-hidden="true">:</span>
          <select
            v-model.number="selectedMinute"
            data-test="minutes"
            :aria-label="labelFor('minute')"
            class="rounded border border-border bg-surface px-1.5 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option v-for="m in minuteOptions" :key="m" :value="m">{{ pad(m) }}</option>
          </select>
          <select
            v-if="hourFormat === '12'"
            v-model="selectedMeridiem"
            data-test="meridiem"
            :aria-label="labelFor('time')"
            class="rounded border border-border bg-surface px-1.5 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option value="am">{{ labelFor('am') }}</option>
            <option value="pm">{{ labelFor('pm') }}</option>
          </select>
        </div>

        <div class="mt-3 flex justify-end border-t border-border pt-3">
          <button
            type="button"
            data-test="clear"
            class="rounded px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="clear"
          >
            {{ labelFor('clear') }}
          </button>
          <button
            type="button"
            data-test="apply"
            class="rounded bg-primary-700 px-3 py-1 text-sm text-white transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="commit(); open = false"
          >
            {{ labelFor('apply') }}
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
