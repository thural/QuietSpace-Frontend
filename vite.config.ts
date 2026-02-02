import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-remove-console'
import { getViteAliases } from './config/paths'

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: getViteAliases()
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          'babel-plugin-styled-components',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-transform-class-properties', { loose: true }]
        ]
      }
    }),
    removeConsole(),
  ],
  server: {
    host: true,
    port: 5000,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: './public',
    rollupOptions: {
      output: {
        manualChunks: {
          'styled-components': [
            'styled-components'
          ],
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-error-boundary'
          ]
        }
      }
    }
  },
})