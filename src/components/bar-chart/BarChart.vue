<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'
import { barRects } from '../../lib/chart'
import { toneClasses, type Tone } from '../../lib/tones'

const props = withDefaults(
  defineProps<{
    data: { label: string; value: number }[]
    width?: number
    height?: number
    tone?: Tone
    /** Accessible name for the chart. */
    label: string
  }>(),
  { width: 320, height: 160, tone: 'info' },
)

const bars = computed(() =>
  barRects(
    props.data.map((item) => item.value),
    { width: props.width, height: props.height },
  ),
)
</script>

<template>
  <div :class="cn('inline-block', toneClasses[tone].icon)">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="label"
      class="overflow-visible"
    >
      <rect
        v-for="(bar, index) in bars"
        :key="index"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="bar.height"
        rx="2"
        fill="currentColor"
      />
    </svg>

    <!-- A screen-reader alternative to the visual bars. -->
    <table class="sr-only">
      <thead>
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.label">
          <th scope="row">{{ item.label }}</th>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
