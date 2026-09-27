<script setup lang="ts">
import RtlBlock from '../.vitepress/theme/demos/rtl/rtl-block.vue'
import LogicalSpacing from '../.vitepress/theme/demos/rtl/logical-spacing.vue'
</script>

# RTL & bilingual

English and Arabic are both first-class. Arabic is RTL, and the library ships the logical
utilities, `rtl:` variants, and per-component fixes needed to render both directions
without forking styles.

## Direction and fonts

Set `dir="rtl"` at the edge of the RTL subtree and switch to the Arabic font stack:

```vue
<div dir="rtl" class="font-ar">
  <!-- Arabic content -->
</div>
```

`font-ar` resolves to `GE SS Two`, then `Adobe Arabic`, then system fallbacks. The package
ships no `@font-face` rules — supply the brand fonts yourself. Add `lang="ar"` next to
`dir` so screen readers and spellcheckers pick the right language:

```vue
<section dir="rtl" lang="ar" class="font-ar">…</section>
```

You can also set direction once on `<html>`; components inherit it. Never mix scripts inside
a single lockup or sentence.

<Demo>
  <RtlBlock />
</Demo>

<<< ../.vitepress/theme/demos/rtl/rtl-block.vue

## Prefer logical utilities

Physical utilities assume left-to-right. Logical ones follow the writing direction, so the
same markup mirrors under RTL:

| Physical (avoid) | Logical (prefer) |
| --- | --- |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l-*` / `border-r-*` | `border-s-*` / `border-e-*` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |

Both blocks below use the identical classes — `ps-4 pe-2` — and only the `dir` attribute
differs:

<Demo background="muted">
  <LogicalSpacing />
</Demo>

<<< ../.vitepress/theme/demos/rtl/logical-spacing.vue

## `rtl:` variants

For the handful of truly directional cases, use Tailwind's `rtl:` variant:

```html
<ChevronLeft class="size-4 rtl:rotate-180" />
<ChevronRight class="size-4 rtl:rotate-180" />
```

`rtl:` triggers on a `[dir="rtl"]` ancestor, so it works no matter where direction is set.

## Per-component notes

These components already handle direction:

- **`Drawer`** — exposes logical `start`/`end` positions that mirror `left`/`right` and flip
  their slide transform under RTL; the close button uses `ms-auto`.
- **`Toaster`** — each viewport is placed with logical `start-*`/`end-*`, so the four
  corner positions (`top-start`, `top-end`, `bottom-start`, `bottom-end`) mirror
  automatically. The center positions (`top-center`, `bottom-center`) use
  `inset-x-0 mx-auto` and are direction-neutral.
- **`DatePicker`** — month navigation chevrons use `rtl:rotate-180`, and labels are
  locale-formatted and overridable through the `labels` prop and `label-*` slots.
- **`Input`** — leading and trailing icons are positioned with `start-3`/`end-3`, and the
  field padding uses `ps-*`/`pe-*`.
- **`Password`** — the visibility toggle sits at `end-2`, and the field reserves `pe-10`.
- **`InputNumber`** — `prefix`, the input, and `suffix` sit in a flex container with `gap-1`,
  so their spacing is direction-safe; the stepper-buttons container adds `ms-1`.
- **`TablePagination`** — previous/next chevrons use `rtl:rotate-180`.
- **`Tag`** — the remove button uses `ms-0.5`/`-me-0.5`.
- **`DropdownMenu`** and **`Select`** — overlay positioning comes from Reka UI's popper
  primitives, which resolve the document direction and pass it to the positioner.

> **Known gap:** `TransferList` uses a physical `text-left` on its row buttons, so labels
> stay left-aligned under RTL instead of following the direction. Direction-aware fixes are
> otherwise in place.
>
> There is **no automated RTL visual test**. Correctness is reviewed against the
> logical-utility rule above and verified by inspection, not by CI.
