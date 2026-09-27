<script setup lang="ts">
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@myghf/ui'

const aligns = ['start', 'center', 'end'] as const
</script>

<template>
  <ClientOnly>
    <div class="flex flex-wrap gap-2">
      <DropdownMenu v-for="a in aligns" :key="a">
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm">{{ a }}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent :align="a" :side-offset="6">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <template #fallback>
      <span class="text-sm text-muted">Loading menu…</span>
    </template>
  </ClientOnly>
</template>
