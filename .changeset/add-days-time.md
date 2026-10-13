---
'@myghf/ui': patch
---

Fix `addDays` dropping the time of day

`addDays` built its result with `new Date(year, month, day)`, which
zeroes the time — so any `Date` carrying a time came back at
midnight, contradicting the DST-safety the helper documents. It now
uses `setDate`, which preserves the wall-clock time and still rolls
month and year boundaries over.
