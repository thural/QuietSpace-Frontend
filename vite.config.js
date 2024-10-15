import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-remove-console'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@shared': path.resolve(__dirname, './src/components/shared'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  },
  plugins: [react(), removeConsole()],
  server: {
    host: true,
    port: 5000,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: './public'
  }
})