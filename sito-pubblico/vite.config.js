import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In sviluppo le API pubbliche e le foto passano dal backend locale (porta 3000).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
})
