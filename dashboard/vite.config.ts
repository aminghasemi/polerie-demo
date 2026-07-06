import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://aminghasemi.github.io/polerie-demo/
const base = process.env.GITHUB_PAGES === 'true' ? '/polerie-demo/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
