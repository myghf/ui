---
'@myghf/ui': minor
---

Add controlled sorting to DataTable

`DataTable` now accepts a `sorting` prop. Unbound, it sorts itself as before;
bound with `v-model:sorting`, the component only emits `update:sorting` and
sorts when the parent writes the prop back — the shape a server-side sort
(`manual`) needs. Covers controlled and uncontrolled behaviour, plus
combination tests (virtualized expansion, cross-page selection, sorting with
pagination, manual mode with search).
