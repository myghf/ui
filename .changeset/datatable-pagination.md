---
'@myghf/ui': minor
---

DataTable: pagination and server-side mode

- New `paginate` prop renders the pagination footer over the client-side rows, bound with
  `v-model:page-index` / `v-model:page-size` and a `pageSizeOptions` list.
- New `manual` prop switches to server-side mode: TanStack skips client sorting, filtering, and
  pagination; `rowCount` supplies the server total, and the component emits `update:pageIndex` /
  `update:pageSize` (alongside the existing `update:sorting` / `update:filters`) for you to refetch.
- A `pagination` slot can replace the default footer.
- Fix: `DataTable` no longer caps the body at the default page size (10) — TanStack's paginated
  row model is now handed `pageSize: Infinity` unless `paginate`/`manual` is set.
