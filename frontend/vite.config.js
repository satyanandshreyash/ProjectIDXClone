import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/terminal': {
        target: 'ws://localhost:3000',
        ws: true,             // Enable WebSocket proxying
        changeOrigin: true,   // Important for WS handshake
      },
    },
  },
})
