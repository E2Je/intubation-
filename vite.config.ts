import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/intubation-/',
  server: { port: 5175 },
  define: {
    // Baked into the JS bundle at build time — used to detect stale cache
    __APP_BUILD__: JSON.stringify(Date.now().toString()),
  },
})
