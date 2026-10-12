import preset from '../../src/tailwindPreset.js'

export default {
  presets: [preset],
  content: {
    relative: true,
    files: ['./index.html', './main.ts', './Harness.vue', '../../src/**/*.{vue,ts}'],
  },
}
