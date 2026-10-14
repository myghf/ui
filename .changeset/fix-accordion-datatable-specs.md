---

---

test: fix Accordion and DataTable specs — assert emits via `onUpdate:*` listener spies and reach row child components from `TableRow` VueWrappers, since `wrapper.emitted()` and `DOMWrapper.findComponent` record nothing under this Vue/VTU pair
