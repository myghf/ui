<script setup lang="ts">
import { computed, ref, useSlots, watch, type VNode } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-vue-next'
import { useFieldControl } from '../../lib/formField'
import {
  buildHourOptions,
  buildMinuteOptions,
  clampTime,
  from12Hour,
  sortRange,
  to12Hour,
  toTime,
} from '../../lib/date'
import {
  formatLocalizedDate,
  formatLocalizedTime,
  getFirstDayOfWeek,
  getMonthLabel,
  getWeekdayLabels,
} from '../../lib/locale'
import {
  addDays,
  formatHijriDate,
  hijriMonthLabel,
  hijriMonthLength,
  hijriParts,
  startOfHijriMonth,
  type CalendarSystem,
} from '../../lib/hijri'

export interface DatePickerLabels {
  placeholder: string
  previousMonth: string
  nextMonth: string
  clear: string
  apply: string
  today: string
  time: string
  hour: string
  minute: string
  am: string
  pm: string
}

const LABELS: Record<string, DatePickerLabels> = {
  en: {
    placeholder: 'Select date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    clear: 'Clear',
    apply: 'Apply',
    today: 'Today',
    time: 'Time',
    hour: 'Hour',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  fr: {
    placeholder: 'Choisir une date',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    clear: 'Effacer',
    apply: 'Appliquer',
    today: "Aujourd'hui",
    time: 'Heure',
    hour: 'Heure',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  es: {
    placeholder: 'Seleccionar fecha',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    clear: 'Borrar',
    apply: 'Aplicar',
    today: 'Hoy',
    time: 'Hora',
    hour: 'Hora',
    minute: 'Minuto',
    am: 'AM',
    pm: 'PM',
  },
  de: {
    placeholder: 'Datum wählen',
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    clear: 'Löschen',
    apply: 'Übernehmen',
    today: 'Heute',
    time: 'Uhrzeit',
    hour: 'Stunde',
    minute: 'Minute',
    am: 'AM',
    pm: 'PM',
  },
  ar: {
    placeholder: 'اختر التاريخ',
    previousMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
    clear: 'مسح',
    apply: 'تطبيق',
    today: 'اليوم',
    time: 'الوقت',
    hour: 'الساعة',
    minute: 'الدقيقة',
    am: 'ص',
    pm: 'م',
  },
}

function defaultLabels(locale: string): DatePickerLabels {
  const lang = locale.toLowerCase().split(/[-_]/)[0]
  return LABELS[lang] ?? LABELS.en
}

const props = withDefaults(
  defineProps<{
    mode?: 'date' | 'range' | 'datetime'
    modelValue?: Date | [Date, Date] | null
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
    labels?: Partial<DatePickerLabels>
    weekStartsOn?: number
    defaultOpen?: boolean
    /** Calendar system for the grid and display. Gregorian is the default. */
    calendar?: CalendarSystem
  }>(),
  {
    mode: 'date',
    size: 'default',
    hourFormat: '24',
    minuteStep: 1,
    calendar: 'gregory',
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

const emit = defineEmits<{ 'update:modelValue': [value: Date | [Date, Date] | null] }>()

const slots = useSlots()

const { id, invalid, describedBy } = useFieldControl({
  id: () => props.inputId,
  invalid: () => props.invalid,
})

const open = ref(props.defaultOpen ?? false)
const viewDate = ref(new Date())
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
const time = ref('09:00')

const effectiveLocale = computed(() => props.locale || 'en')

const resolvedLabels = computed<DatePickerLabels>(() => ({
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
function labelFor(key: keyof DatePickerLabels): string {
  const slot = slots[`label-${key}`]
  if (slot) {
    const text = slot().map(flatten).join('').trim()
    if (text) return text
  }
  return resolvedLabels.value[key]
}

const weekStartsOn = computed(() => props.weekStartsOn ?? getFirstDayOfWeek(effectiveLocale.value))
const weekdayLabels = computed(() => getWeekdayLabels(effectiveLocale.value, weekStartsOn.value))
const isHijri = computed(() => props.calendar === 'islamic-umalqura')
const monthLabel = computed(() =>
  isHijri.value
    ? hijriMonthLabel(viewDate.value, effectiveLocale.value)
    : getMonthLabel(viewDate.value, effectiveLocale.value),
)

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

/** First day and length of the month currently shown, in the active calendar. */
const monthBounds = computed(() => {
  if (isHijri.value) {
    const first = startOfHijriMonth(viewDate.value, effectiveLocale.value)
    return { first, length: hijriMonthLength(first, effectiveLocale.value) }
  }
  const first = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const length = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0).getDate()
  return { first, length }
})

const grid = computed(() => {
  const { first, length } = monthBounds.value
  const lead = (first.getDay() - weekStartsOn.value + 7) % 7
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null)
  for (let i = 0; i < length; i++) cells.push(addDays(first, i))
  return cells
})

/** Day number shown in a cell, in the active calendar. */
function dayLabel(date: Date): number {
  return isHijri.value ? hijriParts(date, effectiveLocale.value).day : date.getDate()
}

function inRange(d: Date): boolean {
  if (!start.value || !end.value) return false
  const [s, e] = sortRange(start.value, end.value)
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime()
}

function shiftMonth(n: number) {
  if (isHijri.value) {
    const { first, length } = monthBounds.value
    // Move by one Hijri month: back to the day before day 1, or forward a month's length.
    viewDate.value =
      n < 0 ? startOfHijriMonth(addDays(first, -1), effectiveLocale.value) : addDays(first, length)
    return
  }
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
  const formatDate = (date: Date) =>
    isHijri.value
      ? formatHijriDate(date, effectiveLocale.value)
      : formatLocalizedDate(date, effectiveLocale.value)
  if (props.mode === 'range') {
    if (!start.value || !end.value) return ''
    const [s, e] = sortRange(start.value, end.value)
    return `${formatDate(s)} – ${formatDate(e)}`
  }
  if (!start.value) return ''
  const d = props.mode === 'datetime' ? clampTime(start.value, time.value) : start.value
  if (props.mode === 'datetime') {
    return `${formatDate(d)} ${formatLocalizedTime(d, effectiveLocale.value, props.hourFormat)}`
  }
  return formatDate(d)
})
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
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
        <CalendarIcon class="size-4 shrink-0 text-muted" />
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        class="z-50 rounded-md border border-border bg-surface p-3 shadow-popover"
      >
        <div class="flex items-center justify-between">
          <button
            type="button"
            :aria-label="labelFor('previousMonth')"
            class="rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="shiftMonth(-1)"
          >
            <ChevronLeft class="size-4 rtl:rotate-180" />
          </button>
          <span data-test="month-label" class="text-sm font-medium">{{ monthLabel }}</span>
          <button
            type="button"
            :aria-label="labelFor('nextMonth')"
            class="rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="shiftMonth(1)"
          >
            <ChevronRight class="size-4 rtl:rotate-180" />
          </button>
        </div>

        <div data-test="weekdays" class="mt-2 grid grid-cols-7 gap-0.5 text-center text-xs">
          <span v-for="(d, i) in weekdayLabels" :key="i" class="py-1 font-medium text-muted">
            {{ d }}
          </span>
          <template v-for="(cell, i) in grid" :key="i">
            <span v-if="!cell" />
            <button
              v-else
              type="button"
              :class="[
                'flex h-8 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                inRange(cell) ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200' : 'hover:bg-surface-muted',
                start && start.getTime() === cell.getTime() ? 'bg-primary-500 text-white hover:bg-primary-500' : '',
                end && end.getTime() === cell.getTime() ? 'bg-primary-500 text-white hover:bg-primary-500' : '',
              ]"
              @click="pick(cell)"
            >
              {{ dayLabel(cell) }}
            </button>
          </template>
        </div>

        <div v-if="mode === 'datetime'" class="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div role="group" :aria-label="labelFor('time')" class="flex items-center gap-1.5 text-xs text-muted">
            <Clock class="size-3.5" />
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
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              @click="clear"
            >
              {{ labelFor('clear') }}
            </button>
            <button
              type="button"
              :disabled="!start"
              class="rounded bg-primary-500 px-3 py-1 text-sm text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              @click="commit(); open = false"
            >
              {{ labelFor('apply') }}
            </button>
          </div>
        </div>

        <div v-else-if="hasValue()" class="mt-3 flex justify-end border-t border-border pt-3">
          <button
            type="button"
            class="rounded px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            @click="clear"
          >
            {{ labelFor('clear') }}
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
