<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, AccordionItem } from '@myghf/ui'

const open = ref('clinical')
</script>

<template>
  <Accordion v-model="open" class="max-w-md">
    <AccordionItem value="clinical" title="Clinical notes">
      Progress notes for the admission.
    </AccordionItem>
    <AccordionItem value="labs" title="Lab results">
      Latest bloods and imaging.
    </AccordionItem>
  </Accordion>
</template>
