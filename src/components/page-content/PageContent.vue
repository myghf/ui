<script setup lang="ts">
import Container from '../container/Container.vue'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

withDefaults(defineProps<{ size?: Size }>(), { size: 'lg' })
</script>

<template>
  <Container :size="size" class="py-6">
    <slot />
  </Container>
</template>
