<script setup lang="ts">
import { Button, useTheme } from '@myghf/ui'

// The shared singleton: every caller and ThemeToggle reads the same state.
const { mode, resolved, isDark, setMode, toggle, reset } = useTheme()
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span class="flex items-center gap-2">
          <span class="text-muted">mode</span>
          <code class="rounded bg-surface-muted px-1.5 py-0.5 text-foreground">{{ mode }}</code>
        </span>
        <span class="flex items-center gap-2">
          <span class="text-muted">resolved</span>
          <code class="rounded bg-surface-muted px-1.5 py-0.5 text-foreground">{{ resolved }}</code>
        </span>
        <span class="flex items-center gap-2">
          <span class="text-muted">isDark</span>
          <code class="rounded bg-surface-muted px-1.5 py-0.5 text-foreground">{{ isDark }}</code>
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" @click="toggle()">toggle()</Button>
        <Button size="sm" variant="outline" @click="setMode('light')">setMode('light')</Button>
        <Button size="sm" variant="outline" @click="setMode('dark')">setMode('dark')</Button>
        <Button size="sm" variant="outline" @click="setMode('system')">setMode('system')</Button>
        <Button size="sm" variant="ghost" @click="reset()">reset()</Button>
      </div>
    </div>

    <template #fallback>
      <span class="text-sm text-muted">Loading theme control…</span>
    </template>
  </ClientOnly>
</template>
