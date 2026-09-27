<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@myghf/ui'

const email = ref(true)
const sms = ref(false)
</script>

<template>
  <div class="grid max-w-md gap-3">
    <label class="flex items-center gap-2 text-sm text-foreground">
      <Checkbox id="pref-email" v-model="email" />
      Email notifications
    </label>

    <label class="flex items-center gap-2 text-sm text-foreground">
      <Checkbox id="pref-sms" v-model="sms" />
      SMS notifications
    </label>

    <label class="flex items-center gap-2 text-sm text-muted">
      <Checkbox :model-value="true" disabled />
      Locked by your administrator
    </label>
  </div>
</template>
