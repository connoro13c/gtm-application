import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000
  },
  resolve: {
    alias: {
      // Add any path aliases here if needed
    }
  }
});