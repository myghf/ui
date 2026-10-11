---
'@myghf/ui': minor
---

DataTable: virtual scrolling

Set `maxHeight` and `virtual` together and `DataTable` renders only the visible slice of rows
(plus a small overscan), padding the rest with spacer rows so the DOM stays small for very large
datasets. The windowing math lives in a new pure `src/lib/virtual.ts` (`virtualWindow`). It assumes
a uniform `rowHeight` (configurable, default 40) and does not account for expansion rows.
