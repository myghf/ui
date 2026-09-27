<script setup lang="ts">
import { Avatar } from '@myghf/ui'

const sizes = ['sm', 'default', 'lg', 'xl'] as const
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <Avatar v-for="size in sizes" :key="size" :size="size" name="Magdi Yacoub" />
    </div>

    <div class="flex items-center gap-4">
      <Avatar src="/logo.png" alt="MYGHF logo" size="xl" />
      <Avatar name="Magdi Yacoub" size="xl" />
      <Avatar name="Magdi" size="xl" />
      <Avatar initials="UI" size="xl" />
    </div>
  </div>
</template>
