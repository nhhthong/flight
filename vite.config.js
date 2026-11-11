import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

const pages = ['nortiq', 'orvo', 'gravon', 'sootfox', 'hinoma', 'corsara', 'shiosai', 'sekitei', 'zenkai']

export default defineConfig({
  // Relative base: the build works under any GitHub Pages path.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // Fonts and photos are already compressed; inlining small ones as base64 only bloats the CSS.
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(pages.map((p) => [p, resolve(import.meta.dirname, p, 'index.html')])),
      },
    },
  },
})
