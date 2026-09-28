import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REPO_NAME = 'arpit-portfolio';
const BASE_PATH = `/${REPO_NAME}/`;

const assetPrefixPlugin = () => ({
  name: 'asset-prefix',
  transform(code: string, id: string) {
    if (
      (id.includes('/src/') || id.includes('\\src\\')) &&
      (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('.css'))
    ) {
      return {
        code: code
          .replace(/(["'])\/assets\//g, `$1${BASE_PATH}assets/`)
          .replace(/`\/assets\//g, `\`${BASE_PATH}assets/`)
          .replace(/url\((['"]?)\/assets\//g, `url($1${BASE_PATH}assets/`),
        map: null,
      };
    }
  },
});

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), assetPrefixPlugin()],
  server: {
    host: true,
    allowedHosts: ['.trycloudflare.com'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
