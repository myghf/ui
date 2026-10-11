<script setup lang="ts">
import FileUploadBasic from '../.vitepress/theme/demos/file-upload/basic.vue'
</script>

# FileUpload

`FileUpload` is a drop zone over a native `<input type="file">`. The input stays in the
accessibility tree and is the actual control, so clicking anywhere in the zone opens the OS
picker and keyboard users reach it as usual; dragging files onto the zone works through the
native drop target. Selected files are listed with their size, a remove button, and an optional
per-file [Progress](/components/progress) bar.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FileUpload } from '@myghf/ui'

const files = ref<File[]>([])
</script>

<template>
  <FileUpload v-model="files" accept=".pdf,.docx" multiple />
</template>
```

## Examples

### Multiple files with progress

Set `multiple` to collect several files, and pass `progressFor` to show a bar per file while
it uploads. `accept` maps to the native attribute (the OS picker filters by it).

<Demo>
  <FileUploadBasic />
</Demo>

<<< ../.vitepress/theme/demos/file-upload/basic.vue

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `File[]` | `[]` | Selected files. |
| `accept` | `string` | — | Native `accept` filter (e.g. `'.pdf,.docx'` or `'image/*'`). |
| `multiple` | `boolean` | `false` | Allow more than one file; new picks append instead of replacing. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `invalid` | `boolean` | `false` | Marks the control invalid. Falls through to the `FormField` context when omitted. |
| `required` | `boolean` | `false` | Marks the control required. Falls through to the `FormField` context when omitted. |
| `id` | `string` | — | Applied to the file input so an external `<label for>` matches. |
| `name` | `string` | — | Submitted with the owning form as a name/value pair. |
| `prompt` | `string` | `'Drag and drop files here, or'` | Drop-zone prompt text. |
| `browseLabel` | `string` | `'browse'` | Emphasised word appended to the prompt. |
| `removeLabel` | `string` | `'Remove'` | Prefix for each file's remove button label. |
| `progressFor` | `(file: File) => number \| null` | — | Per-file progress (0–100); `null` hides the bar. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `File[]` | The new file list (replace on single, append on `multiple`). |
| `select` | `File[]` | The files chosen in this interaction (before `multiple` merging). |
| `remove` | `File` | A file removed from the list. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Extra content inside the drop zone, below the prompt. |

## Exposed methods

None. `FileUpload` does not call `defineExpose`.

## Accessibility

- The `<input type="file">` is the control: it stays focusable and in the accessibility tree
  (styled `opacity-0` over the zone), so it is clickable, droppable, and keyboard reachable
  without scripting. The zone shows a `focus-within` ring when the input is focused.
- Give it an accessible name with a [`FormField`](/components/form-field) label or an
  `aria-label`; inside a `FormField` the input also picks up `id`, `aria-describedby`,
  `aria-invalid`, and `required` through the shared `useFieldControl` composable.
- Each listed file's remove button has an `aria-label` naming the file; the progress bar is a
  labelled [`Progress`](/components/progress) with `role="progressbar"`.

## Dark mode & RTL

- The zone and file rows use semantic tokens (`bg-surface`, `border-border`, `text-muted`);
  the drag highlight uses a `primary-50` tint with a `dark:bg-primary-900/20` counterpart, so
  it adapts to dark mode.
- The layout is direction-safe — logical padding and `gap`, no physical offsets — so the zone
  and file rows mirror correctly under `dir="rtl"`.
