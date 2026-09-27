<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
        <DropdownMenuLabel>File</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem icon="file-pen" @select="choose('Rename')">Rename</DropdownMenuItem>
          <DropdownMenuItem icon="copy" @select="choose('Duplicate')">Duplicate</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem icon="trash-2" variant="destructive" @select="choose('Delete')">
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem icon="archive" disabled @select="choose('Archive')">
            Archive (unavailable)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <p class="mt-3 text-sm text-muted">Last action: {{ last }}</p>

    <template #fallback>
      <span class="text-sm text-muted">Loading menu…</span>
    </template>
  </ClientOnly>
</template>
