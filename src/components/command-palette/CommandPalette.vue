<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { useMyGhfConfig } from '../../lib/config'
import Icon from '../icon/Icon.vue'
import Input from '../input/Input.vue'

export interface CommandItem {
  id: string
  label: string
  description?: string
  /** Short trailing label, e.g. a section name. */
  group?: string
  /** Extra terms to match against, beyond the label and description. */
  keywords?: string[]
  /** Lucide icon name. */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    open?: boolean
    items?: CommandItem[]
    placeholder?: string
    emptyLabel?: string
    /** Accessible name for the search input. */
    searchLabel?: string
    /** Screen-reader-only dialog title. */
    title?: string
    /** Screen-reader-only dialog description. */
    description?: string
  }>(),
  {
    open: false,
    items: () => [],
    placeholder: () => useMyGhfConfig().labels.typeACommand,
    emptyLabel: () => useMyGhfConfig().labels.emptyResults,
    searchLabel: () => useMyGhfConfig().labels.searchCommands,
    title: () => useMyGhfConfig().labels.commandPalette,
    description: () => useMyGhfConfig().labels.commandPaletteDescription,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [item: CommandItem]
}>()

const query = ref('')
const activeIndex = ref(-1)
const inputRef = ref<InstanceType<typeof Input>>()
const listRef = ref<HTMLUListElement>()

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return props.items
  return props.items.filter((item) =>
    `${item.label} ${item.description ?? ''} ${(item.keywords ?? []).join(' ')}`
      .toLowerCase()
      .includes(needle),
  )
})

function focusItem(index: number) {
  activeIndex.value = index
  void nextTick(() => {
    listRef.value?.querySelectorAll('button')[index]?.focus()
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  // The listener is bound to both the input wrapper and the inner <input> (attrs
  // fall through to both), so stop the duplicate run. Escape is left to bubble to
  // the dialog's dismiss handling.
  event.stopPropagation()
  focusItem(
    event.key === 'ArrowDown'
      ? Math.min(filtered.value.length - 1, activeIndex.value + 1)
      : Math.max(0, activeIndex.value - 1),
  )
}

function select(item: CommandItem) {
  emit('select', item)
  emit('update:open', false)
}

async function reset() {
  query.value = ''
  activeIndex.value = -1
  await nextTick()
  inputRef.value?.focus()
}

watch(
  () => props.open,
  (open) => {
    if (open) void reset()
  },
)

onMounted(() => {
  if (props.open) void reset()
})
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 dark:bg-black/70"
        @click="emit('update:open', false)"
      />
      <DialogContent
        v-if="open"
        class="fixed inset-x-0 top-24 z-50 mx-auto w-[min(32rem,calc(100%-2rem))] overflow-hidden rounded-lg border border-border bg-surface shadow-dialog focus-visible:outline-none"
        @open-auto-focus="(event: Event) => event.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>{{ description }}</DialogDescription>
        </VisuallyHidden>

        <div class="border-b border-border p-3">
          <Input
            ref="inputRef"
            v-model="query"
            :placeholder="placeholder"
            :aria-label="searchLabel"
            leading-icon="search"
            @keydown="onKeydown"
          />
        </div>

        <ul ref="listRef" class="max-h-80 overflow-y-auto p-1">
          <li v-if="filtered.length === 0" class="px-3 py-6 text-center text-sm text-muted">
            {{ emptyLabel }}
          </li>
          <li v-for="(item, index) in filtered" :key="item.id">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded px-2 py-2 text-start text-sm transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none"
              @click="select(item)"
              @mouseenter="activeIndex = index"
            >
              <Icon v-if="item.icon" :name="item.icon" class="size-4 shrink-0 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-foreground">{{ item.label }}</span>
                <span v-if="item.description" class="block truncate text-xs text-muted">
                  {{ item.description }}
                </span>
              </span>
              <span v-if="item.group" class="shrink-0 text-xs text-muted">{{ item.group }}</span>
            </button>
          </li>
        </ul>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
