import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/intubation-/',
  server: { port: 5175 },
  define: {
    // Baked into the JS bundle at build time — used to detect stale cache
    // In CI: VITE_APP_VERSION = github.sha (same value written to version.json)
    // In dev: 'dev' → version check is skipped entirely
    __APP_BUILD__: JSON.stringify(process.env.VITE_APP_VERSION ?? 'dev'),
  },
})
