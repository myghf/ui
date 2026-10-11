<script setup lang="ts">
import { computed, ref } from 'vue'
import { FormErrors, FormField, Input } from '@myghf/ui'

const email = ref('')
const phone = ref('')

const errors = computed(() => [
  ...(email.value ? [] : [{ id: 'demo-email', label: 'Email', message: 'Enter an email address' }]),
  ...(phone.value ? [] : [{ id: 'demo-phone', label: 'Phone', message: 'Required' }]),
])
</script>

<template>
  <div class="grid max-w-md gap-4">
    <FormErrors :errors="errors" />

    <FormField id="demo-email" label="Email" :error="email ? undefined : 'Enter an email address'">
      <Input v-model="email" type="email" />
    </FormField>

    <FormField id="demo-phone" label="Phone" :error="phone ? undefined : 'Required'">
      <Input v-model="phone" />
    </FormField>
  </div>
</template>
