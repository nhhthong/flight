import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

const pages = ['nortiq', 'orvo', 'gravon', 'sootfox', 'hinoma']

export default defineConfig({
  // Relative base: the build works under any GitHub Pages path.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, p, 'index.html')])),
      },
    },
  },
})
