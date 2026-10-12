import { createApp, h } from 'vue'
import '../../src/tokens.css'
import './app.css'
import Harness from './Harness.vue'

// Direction and theme come from the query string so one harness covers the
// light/dark × LTR/RTL matrix.
const params = new URLSearchParams(window.location.search)
const dir = params.get('dir') === 'rtl' ? 'rtl' : 'ltr'
const theme = params.get('theme') === 'dark' ? 'dark' : 'light'

document.documentElement.setAttribute('dir', dir)
document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en')
document.documentElement.classList.toggle('dark', theme === 'dark')
document.documentElement.setAttribute('data-theme', theme)
document.body.className = dir === 'rtl' ? 'font-ar' : 'font-sans'

createApp({ render: () => h(Harness) }).mount('#app')
