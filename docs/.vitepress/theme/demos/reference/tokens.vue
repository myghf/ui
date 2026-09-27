<script setup lang="ts">
// Live swatches read the tokens at runtime, so they follow dark mode with the rest
// of the site. Nothing here is a hard-coded colour — every value resolves through
// `--myghf-*` (`rgb(var(--myghf-*))`).
const scales = [
  { name: 'primary', label: 'Primary — MYGHF Blue' },
  { name: 'secondary', label: 'Secondary — MYGHF Plum' },
  { name: 'success', label: 'Success — MYGHF Teal' },
  { name: 'warning', label: 'Warning — MYGHF Gold' },
  { name: 'error', label: 'Error — MYGHF Red' },
  { name: 'info', label: 'Info (semantic copy of primary)' },
]

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

const semantic = [
  'background',
  'foreground',
  'surface',
  'surface-muted',
  'border',
  'muted',
]

const token = (name: string) => `rgb(var(--myghf-${name}))`
</script>

<template>
  <div class="space-y-5">
    <div v-for="scale in scales" :key="scale.name">
      <p class="mb-1 text-xs font-medium text-muted">{{ scale.label }}</p>
      <div class="flex overflow-hidden rounded-md border border-border" aria-hidden="true">
        <div
          v-for="step in steps"
          :key="step"
          class="h-10 flex-1"
          :style="{ backgroundColor: token(`${scale.name}-${step}`) }"
          :title="`--myghf-${scale.name}-${step}`"
        />
      </div>
    </div>

    <div>
      <p class="mb-1 text-xs font-medium text-muted">Semantic tokens</p>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div
          v-for="name in semantic"
          :key="name"
          class="overflow-hidden rounded-md border border-border"
        >
          <div class="h-8" :style="{ backgroundColor: token(name) }" aria-hidden="true" />
          <p class="px-2 py-1 text-xs font-medium text-foreground">--myghf-{{ name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
