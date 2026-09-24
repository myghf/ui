<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '../button/Button.vue'
import { pageRange, pageWindow, totalPages } from '../../lib/pagination'

const props = withDefaults(
  defineProps<{
    pageIndex: number
    pageSize: number
    total: number
    pageSizeOptions?: number[]
    rowsPerPageLabel?: string
    ofLabel?: string
    previousLabel?: string
    nextLabel?: string
  }>(),
  {
    pageSizeOptions: () => [5, 10, 20],
    rowsPerPageLabel: 'Rows per page',
    ofLabel: 'of',
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
  },
)

const emit = defineEmits<{
  'update:pageIndex': [value: number]
  'update:pageSize': [value: number]
}>()

const pageCount = computed(() => totalPages(props.total, props.pageSize))
const range = computed(() => pageRange(props.pageIndex, props.pageSize, props.total))
const pages = computed(() => pageWindow(props.pageIndex, pageCount.value))

function goTo(index: number) {
  emit('update:pageIndex', Math.max(0, Math.min(index, pageCount.value - 1)))
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 px-3 py-2 text-sm text-muted">
    <div class="flex items-center gap-2">
      <span>{{ rowsPerPageLabel }}</span>
      <select
        :value="pageSize"
        class="rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <span>{{ range.from }}–{{ range.to }} {{ ofLabel }} {{ range.total }}</span>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" :disabled="pageIndex <= 0" :aria-label="previousLabel" @click="goTo(pageIndex - 1)">
          <ChevronLeft class="size-4 rtl:rotate-180" />
        </Button>
        <Button
          v-for="page in pages"
          :key="page"
          :variant="page - 1 === pageIndex ? 'default' : 'ghost'"
          size="icon-sm"
          :aria-current="page - 1 === pageIndex ? 'page' : undefined"
          @click="goTo(page - 1)"
        >
          {{ page }}
        </Button>
        <Button variant="ghost" size="icon-sm" :disabled="pageIndex >= pageCount - 1" :aria-label="nextLabel" @click="goTo(pageIndex + 1)">
          <ChevronRight class="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  </div>
</template>
