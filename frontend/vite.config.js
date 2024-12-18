import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
        "/api": {
          target: "http://192.168.101.11:8000",
          changeOrigin: true,
        },
      }
  },
})
