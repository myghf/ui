<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@myghf/ui'

const email = ref('')
const search = ref('')
const invalidValue = ref('not-an-email')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-input-email">Email</label>
      <Input id="demo-input-email" v-model="email" type="email" placeholder="you@example.com" />
    </div>

    <Input v-model="search" leading-icon="search" placeholder="Search patients" />

    <Input
      v-model="invalidValue"
      invalid
      leading-icon="circle-alert"
      aria-label="Invalid field"
    />
  </div>
</template>
