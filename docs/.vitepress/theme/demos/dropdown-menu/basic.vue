<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@myghf/ui'

const last = ref('none')

function choose(label: string) {
  last.value = label
}
</script>

<template>
  <ClientOnly>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem @select="choose('Edit')">Edit</DropdownMenuItem>
        <DropdownMenuItem @select="choose('Duplicate')">Duplicate</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" @select="choose('Delete')">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <p class="mt-3 text-sm text-muted">Last action: {{ last }}</p>

    <template #fallback>
      <span class="text-sm text-muted">Loading menu…</span>
    </template>
  </ClientOnly>
</template>
