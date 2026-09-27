<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from '@myghf/ui'

const quantity = ref<number | null>(3)
</script>

<template>
  <div class="grid max-w-xs gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-quantity">Quantity</label>
      <InputNumber
        id="demo-quantity"
        v-model="quantity"
        :min="0"
        :max="10"
        show-buttons
      />
    </div>

    <InputNumber
      v-model="quantity"
      placeholder="Empty is null"
      aria-label="Quantity without stepper buttons"
    />
  </div>
</template>
