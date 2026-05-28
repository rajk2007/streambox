import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.', // Ensure root is the folder with index.html
  base: './', // Relative paths for Capacitor
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Force using our new index.html
    }
  }
});
