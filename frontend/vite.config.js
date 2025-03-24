import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    host: true  // Allow connections from IP addresses
  },
  build: {
    target: 'es2015', // Ensure backward compatibility
    modulePreload: {
      polyfill: true
    }
  }
});