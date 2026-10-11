<script setup lang="ts">
import { AppShell, Sidebar, Topbar } from '@myghf/ui'

const links = ['Dashboard', 'Patients', 'Appointments', 'Settings']
</script>

<template>
  <div class="h-72 overflow-hidden rounded-lg border border-border">
    <AppShell class="h-full !min-h-0">
      <template #topbar>
        <Topbar><span class="text-sm font-semibold text-foreground">MYGHF</span></Topbar>
      </template>

      <template #sidebar>
        <Sidebar>
          <ul class="grid gap-1 p-3 text-sm">
            <li v-for="link in links" :key="link">
              <a
                href="#"
                class="block rounded px-2 py-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >{{ link }}</a
              >
            </li>
          </ul>
        </Sidebar>
      </template>

      <div class="p-4 text-sm text-muted">Main content</div>
    </AppShell>
  </div>
</template>
