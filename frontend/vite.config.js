import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/dashboard': { target: 'http://localhost:5000', changeOrigin: true },
      '/transactions': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
