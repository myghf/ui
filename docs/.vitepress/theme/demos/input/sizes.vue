<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@myghf/ui'

const value = ref('Aswan Heart Centre')
</script>

<template>
  <div class="grid max-w-md gap-3">
    <Input v-model="value" size="sm" aria-label="Small input" />
    <Input v-model="value" aria-label="Default input" />
    <Input v-model="value" size="lg" aria-label="Large input" />
  </div>
</template>
