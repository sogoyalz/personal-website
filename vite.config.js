import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/personal-website/' : '/',
  plugins: [react()],
  // three.js is loaded as its own lazy chunk; it is large by nature.
  build: { chunkSizeWarningLimit: 900 },
})
