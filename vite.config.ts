
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 443, // Standard HTTPS port
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certificates/private-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificates/certificate.pem')),
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));

