import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://172.16.0.75:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})