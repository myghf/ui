<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot, type AcceptableValue } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    modelValue?: AcceptableValue
    options?: Record<string, unknown>[]
    optionLabel?: string
    optionValue?: string
    disabled?: boolean
  }>(),
  { optionLabel: 'label', optionValue: 'value' },
)

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const rootEl = ref<InstanceType<typeof RadioGroupRoot> | null>(null)
const indicator = ref({ left: 0, top: 0, width: 0, height: 0, ready: false })
let frame = 0

function valueOf(opt: Record<string, unknown> | undefined): AcceptableValue {
  return (opt?.[props.optionValue as string] ?? opt) as AcceptableValue
}
function labelOf(opt: Record<string, unknown> | undefined): string {
  return String(opt?.[props.optionLabel as string] ?? opt ?? '')
}

function measure() {
  const root = rootEl.value?.$el as HTMLElement | undefined
  const checked = root?.querySelector<HTMLElement>('[role="radio"][data-state="checked"]')
  if (!checked) {
    indicator.value.ready = false
    return
  }
  indicator.value = {
    left: checked.offsetLeft,
    top: checked.offsetTop,
    width: checked.offsetWidth,
    height: checked.offsetHeight,
    ready: true,
  }
}

function scheduleMeasure() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(measure)
}

let observer: ResizeObserver | undefined

onMounted(() => {
  scheduleMeasure()
  if (typeof ResizeObserver !== 'undefined' && rootEl.value?.$el) {
    observer = new ResizeObserver(scheduleMeasure)
    observer.observe(rootEl.value.$el as HTMLElement)
  }
  window.addEventListener('resize', scheduleMeasure)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  window.removeEventListener('resize', scheduleMeasure)
})

watch(() => props.modelValue, scheduleMeasure)
watch(() => props.options, scheduleMeasure, { deep: true })
</script>

<template>
  <RadioGroupRoot
    ref="rootEl"
    :model-value="modelValue"
    :disabled="disabled"
    class="relative inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-surface p-1"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <span
      v-show="indicator.ready"
      aria-hidden="true"
      class="pointer-events-none absolute rounded bg-primary-500 transition-all duration-200 ease-out motion-reduce:transition-none"
      :style="{
        left: `${indicator.left}px`,
        top: `${indicator.top}px`,
        width: `${indicator.width}px`,
        height: `${indicator.height}px`,
      }"
    />
    <RadioGroupItem
      v-for="opt in options"
      :key="String(valueOf(opt))"
      :value="valueOf(opt)"
      :disabled="disabled"
      class="relative inline-flex items-center justify-center rounded px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 data-[state=checked]:text-white data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    >
      <RadioGroupIndicator class="hidden" />
      {{ labelOf(opt) }}
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
