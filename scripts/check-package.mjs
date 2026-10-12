import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Asserts the *built* package is shippable: the expected files exist, the
 * tokens/preset are non-empty, and the built entry exports everything the
 * public barrel promises.
 *
 * Run after `npm run build` (e.g. `npm run build && npm run check:package`).
 */

const root = fileURLToPath(new URL('..', import.meta.url))
const problems = []

function fail(message) {
  problems.push(message)
}

const REQUIRED_FILES = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/nuxt.js',
  'dist/nuxt.d.ts',
  'dist/tokens.css',
  'dist/tailwindPreset.js',
]

for (const file of REQUIRED_FILES) {
  const path = join(root, file)
  if (!existsSync(path)) fail(`missing build artifact: ${file}`)
  else if (statSync(path).size === 0) fail(`empty build artifact: ${file}`)
}

// The built entry must export everything `src/index.spec.ts` guards.
const spec = readFileSync(join(root, 'src/index.spec.ts'), 'utf8')
const expectedBlock = spec.match(/const EXPECTED = \[([\s\S]*?)\]/)?.[1] ?? ''
const expected = [...expectedBlock.matchAll(/'([^']+)'/g)].map((match) => match[1])
if (expected.length < 50) fail(`could not read EXPECTED from src/index.spec.ts (got ${expected.length})`)

try {
  const ui = await import(pathToFileURL(join(root, 'dist/index.js')).href)
  const missing = expected.filter((name) => !(name in ui))
  if (missing.length > 0) fail(`exports missing from dist/index.js: ${missing.join(', ')}`)
  console.log(`✓ dist/index.js exports all ${expected.length} barrel names`)
} catch (error) {
  fail(`could not import dist/index.js: ${error.message}`)
}

const tokens = readFileSync(join(root, 'dist/tokens.css'), 'utf8')
if (!tokens.includes('--myghf-primary-500')) fail('dist/tokens.css is missing --myghf-primary-500')

const preset = readFileSync(join(root, 'dist/tailwindPreset.js'), 'utf8')
if (!preset.includes('myghf')) fail('dist/tailwindPreset.js does not reference the myghf tokens')

if (problems.length > 0) {
  console.error('✗ package check failed:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('✓ package check passed')
