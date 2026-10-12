import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Installs the *packed* package into clean Vue and Nuxt projects and
 * builds/renders them, so a consumer gets the same bits npm ships —
 * no source, no workspace link, no manual fixes.
 *
 * Run after `npm run build` (e.g. `npm run build && npm run test:consumer`).
 */

const root = fileURLToPath(new URL('..', import.meta.url))

/** Runs a command, streaming its output, failing on a non-zero exit. */
function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
  })
}

/** Packs the library and returns the absolute tarball path. */
function packLibrary() {
  const dir = mkdtempSync(join(tmpdir(), 'myghf-pack-'))
  const name = execFileSync('npm', ['pack', '--pack-destination', dir], {
    cwd: root,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .pop()
  return { dir, tarball: join(dir, name) }
}

/**
 * Copies a fixture into a clean directory and points its
 * `@myghf/ui` dependency at the packed tarball.
 */
function prepareFixture(fixture, tarball) {
  const dir = mkdtempSync(join(tmpdir(), `myghf-${fixture}-`))
  cpSync(join(root, 'tests/consumer', fixture), dir, { recursive: true })
  const manifestPath = join(dir, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.dependencies['@myghf/ui'] = `file:${tarball}`
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  return dir
}

/** The CSS files a Nuxt build wrote, so the preset can be traced into them. */
function builtCss(dir) {
  const output = join(dir, '.output', 'public', '_nuxt')
  return readdirSync(output)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(join(output, file), 'utf8'))
}

const { dir: packDir, tarball } = packLibrary()
const failures = []

try {
  // Plain Vue: the packed entry resolves and renders server-side.
  const vueDir = prepareFixture('vue', tarball)
  try {
    run('npm', ['install', '--no-audit', '--no-fund'], vueDir)
    run(process.execPath, ['smoke.mjs'], vueDir)
  } catch {
    failures.push('vue')
  } finally {
    rmSync(vueDir, { recursive: true, force: true })
  }

  // Nuxt: the module wires the Tailwind preset into a clean build, so
  // a utility from the preset must reach the built CSS.
  const nuxtDir = prepareFixture('nuxt', tarball)
  try {
    run('npm', ['install', '--no-audit', '--no-fund'], nuxtDir)
    run(
      process.execPath,
      [join(nuxtDir, 'node_modules', 'nuxt', 'bin', 'nuxt.mjs'), 'build'],
      nuxtDir,
    )
    const css = builtCss(nuxtDir).join('\n')
    if (!css.includes('bg-primary-500')) {
      throw new Error(
        'the built CSS has no bg-primary-500, so the @myghf/ui Tailwind preset was not wired',
      )
    }
    console.log('nuxt consumer smoke passed')
  } catch {
    failures.push('nuxt')
  } finally {
    rmSync(nuxtDir, { recursive: true, force: true })
  }
} finally {
  rmSync(packDir, { recursive: true, force: true })
}

if (fixturesFailed(failures)) {
  process.exit(1)
}

function fixturesFailed(failed) {
  if (failed.length === 0) return false
  console.error(`consumer smoke failed: ${failed.join(', ')}`)
  return true
}
