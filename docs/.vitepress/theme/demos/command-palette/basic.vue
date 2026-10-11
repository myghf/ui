<script setup lang="ts">
import { ref } from 'vue'
import { Button, CommandPalette, type CommandItem } from '@myghf/ui'

const open = ref(false)
const selected = ref('')

const items: CommandItem[] = [
  { id: 'new-patient', label: 'New patient', description: 'Register an admission', group: 'Patients', icon: 'plus' },
  { id: 'new-appointment', label: 'New appointment', description: 'Schedule a visit', group: 'Patients', icon: 'calendar' },
  { id: 'settings', label: 'Settings', group: 'App', icon: 'settings' },
]

function onSelect(item: CommandItem) {
  selected.value = item.label
}
</script>

<template>
  <div class="grid gap-2">
    <div>
      <Button size="sm" @click="open = true">Open command palette</Button>
    </div>
    <p class="text-sm text-muted">
      {{ selected ? `Last command: ${selected}` : 'No command run yet' }}
    </p>
    <CommandPalette v-model:open="open" :items="items" @select="onSelect" />
  </div>
</template>
