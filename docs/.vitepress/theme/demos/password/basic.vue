<script setup lang="ts">
import { ref } from 'vue'
import { Password } from '@myghf/ui'

const password = ref('AswanHeart2026!')
const weak = ref('abc')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-password">Password</label>
      <Password
        id="demo-password"
        v-model="password"
        feedback
        placeholder="Enter a password"
      />
    </div>

    <Password v-model="weak" feedback aria-label="A weak password" />
  </div>
</template>
