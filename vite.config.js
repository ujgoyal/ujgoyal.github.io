import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // `ujgoyal.github.io` is a USER site served at the domain ROOT, so base MUST be '/'.
  // (For a PROJECT repo served at ujgoyal.github.io/<repo>, set base: '/<repo>/'.)
  base: '/',
  build: { outDir: 'dist', assetsInlineLimit: 4096, cssCodeSplit: true },
})
