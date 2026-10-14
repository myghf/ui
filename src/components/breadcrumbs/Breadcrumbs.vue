<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

export interface BreadcrumbItem {
  label: string
  href?: string
}

withDefaults(
  defineProps<{
    items?: BreadcrumbItem[]
    /** Accessible name for the navigation landmark. */
    label?: string
  }>(),
  { items: () => [], label: 'Breadcrumb' },
)
</script>

<template>
  <nav :aria-label="label">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="flex items-center gap-1.5"
      >
        <slot name="item" :item="item" :index="index" :is-current="index === items.length - 1">
          <a
            v-if="item.href && index < items.length - 1"
            :href="item.href"
            class="rounded text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >{{ item.label }}</a
          >
          <span v-else-if="index === items.length - 1" aria-current="page" class="font-medium text-foreground">
            {{ item.label }}
          </span>
          <span v-else class="text-muted">{{ item.label }}</span>
        </slot>
        <ChevronRight
          v-if="index < items.length - 1"
          class="size-3.5 shrink-0 text-muted rtl:rotate-180"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
