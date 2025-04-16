import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: ['lucide-react'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  base: '/',
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          ui: ['lucide-react']
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
    host: true,
    port: 3000
  },
  logLevel: 'info',
});