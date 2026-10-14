<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem as RekaAccordionItem,
  AccordionTrigger,
} from 'reka-ui'
import { computed } from 'vue'
import { ChevronDown } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    value: string
    /** Header text. Falls back to the `title` slot. */
    title?: string
    /**
     * Heading level for the trigger, so the accordion fits the page outline.
     * reka defaults to `h3`, which trips `heading-order` when there is no
     * intervening `h2`.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6
  }>(),
  { headingLevel: 3 },
)

const headingTag = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <RekaAccordionItem :value="value" class="px-4">
    <AccordionHeader :as="headingTag">
      <AccordionTrigger
        class="group flex w-full items-center justify-between gap-2 py-3 text-start text-sm font-medium text-foreground transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 data-[state=open]:text-primary-600"
      >
        <slot name="title">{{ title }}</slot>
        <ChevronDown
          class="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent class="pb-3 text-sm text-muted data-[state=closed]:hidden">
      <slot />
    </AccordionContent>
  </RekaAccordionItem>
</template>
