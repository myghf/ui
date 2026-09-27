<script setup lang="ts">
import { ref } from 'vue'
import { FormField, Input } from '@myghf/ui'

const name = ref('')
const email = ref('not-an-email')
</script>

<template>
  <div class="grid max-w-sm gap-6">
    <FormField id="ff-demo-name" label="Full name" required description="As it appears on your record.">
      <Input v-model="name" autocomplete="name" placeholder="Ada Lovelace" />
    </FormField>

    <FormField id="ff-demo-email" label="Email" error="Enter a valid email address.">
      <Input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" />
    </FormField>
  </div>
</template>
