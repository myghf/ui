<script setup lang="ts">
import { ThemeToggle } from '@myghf/ui'
</script>

<template>
  <!-- ThemeToggle reads matchMedia/localStorage, so keep it client-only on an SSR site. -->
  <ClientOnly>
    <div class="flex flex-wrap items-center gap-4">
      <ThemeToggle size="sm" />
      <ThemeToggle />
      <ThemeToggle size="lg" />
    </div>
    <template #fallback>
      <span class="text-sm text-muted">Loading theme control…</span>
    </template>
  </ClientOnly>
</template>
