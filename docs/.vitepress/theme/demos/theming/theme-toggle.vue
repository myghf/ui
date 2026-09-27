<script setup lang="ts">
import { ThemeToggle } from '@myghf/ui'
</script>

<template>
  <!-- ThemeToggle reads matchMedia/localStorage, so keep it client-only on an SSR site. -->
  <ClientOnly>
    <div class="flex flex-wrap items-center gap-4">
      <ThemeToggle />
      <span class="text-sm text-muted">
        Writes both <code>.dark</code> and <code>data-theme="dark"</code> on
        <code>&lt;html&gt;</code>.
      </span>
    </div>
  </ClientOnly>
</template>
