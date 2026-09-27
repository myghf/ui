import preset from '../src/tailwindPreset.js'

export default {
  presets: [preset],
  // `relative: true` resolves the globs below from this file's directory
  // (`docs/`), not from the process cwd (the repo root).
  content: {
    relative: true,
    files: ['./**/*.md', './.vitepress/**/*.{vue,ts}', '../src/**/*.{vue,ts}'],
  },
}
