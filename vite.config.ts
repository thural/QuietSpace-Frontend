import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-remove-console'
import postcssPresetMantine from 'postcss-preset-mantine'
import postcssSimpleVars from 'postcss-simple-vars'

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@': path.resolve(__dirname, './src'),
    }
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
          'mantine': [
            '@mantine/core',
            '@mantine/dates',
            '@mantine/form',
            '@mantine/hooks',
            '@mantine/modals',
            '@mantine/nprogress'
          ],
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
  css: {
    postcss: {
      plugins: [
        postcssPresetMantine(),
        postcssSimpleVars()
      ]
    }
  }
})