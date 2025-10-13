import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 10000,
    allowedHosts: ['alimenteplus-dev.onrender.com'],
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 10000,
    allowedHosts: ['alimenteplus-dev.onrender.com'],
  },
});
