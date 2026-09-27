<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@myghf/ui'

const email = ref('')
</script>

<template>
  <form class="flex max-w-md flex-col gap-3" @submit.prevent>
    <label class="text-sm font-medium text-foreground" for="myghf-email">Email</label>
    <Input id="myghf-email" v-model="email" type="email" placeholder="you@example.com" />
    <Button type="submit" class="self-start">Continue</Button>
  </form>
</template>
