<script setup lang="ts">
import { ref } from 'vue'
import { FormField } from '@myghf/ui'

const name = ref('')
const email = ref('')
</script>

<template>
  <div class="grid max-w-sm gap-6">
    <FormField
      id="fd-name"
      label="Full name"
      required
      description="As it appears on your record."
    >
      <input
        id="fd-name"
        v-model="name"
        type="text"
        placeholder="Ada Lovelace"
        class="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      />
    </FormField>

    <FormField id="fd-email" label="Email" error="Enter a valid email address.">
      <input
        id="fd-email"
        v-model="email"
        type="email"
        placeholder="you@example.com"
        aria-invalid="true"
        aria-describedby="fd-email-error"
        class="h-9 w-full rounded-md border border-error-500 bg-surface px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500"
      />
    </FormField>
  </div>
</template>
