---
'@myghf/ui': patch
---

Ship type declarations that resolve under `node16`/`nodenext`

The build emitted one declaration file per source file, leaving extensionless relative imports
(`./lib/date`) in `dist/index.d.ts`. Those do not resolve under
`moduleResolution: node16`/`nodenext`, so consumers on those settings got broken types (bundler
resolution was unaffected). Declarations are now rolled up into a single `index.d.ts` (and
`nuxt.d.ts`) per entry, which resolves under every mode.

Also adds a `check:package` script (artifact assertions + `publint` + `attw`) and runs it, with the
build, in CI.
