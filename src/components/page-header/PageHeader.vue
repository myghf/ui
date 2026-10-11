<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <header class="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
    <div class="min-w-0">
      <slot name="breadcrumbs" />
      <h1 v-if="title || $slots.title" class="truncate text-xl font-semibold text-foreground">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="description || $slots.description" class="mt-1 text-sm text-muted">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
