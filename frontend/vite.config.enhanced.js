import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@storybook/addon-docs', '@storybook/blocks', 'framer-motion']
  },
  build: {
    rollupOptions: {
      external: ['@storybook/addon-docs', '@storybook/blocks']
    }
  }
});