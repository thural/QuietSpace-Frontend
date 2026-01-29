/**
 * Web Platform Build Configuration
 * Optimized for web deployment with maximum tree-shaking
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  return {
    define: {
      global: 'globalThis',
      // Build-time platform definition for maximum tree-shaking
      'process.env.PLATFORM': JSON.stringify('web'),
      'process.env.BUILD_TARGET': JSON.stringify('web'),
      // Web-specific environment variables
      'process.env.VITE_API_URL': process.env.VITE_API_URL || 'https://api.quietspace.com',
      'process.env.VITE_ENABLE_WEBSOCKET': process.env.VITE_ENABLE_WEBSOCKET || 'true',
      'process.env.VITE_ENABLE_PUSH_NOTIFICATIONS': process.env.VITE_ENABLE_PUSH_NOTIFICATIONS || 'true',
      'process.env.VITE_CACHE_STRATEGY': process.env.VITE_CACHE_STRATEGY || 'hybrid',
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@api': path.resolve(__dirname, './src/api'),
        '@features': path.resolve(__dirname, './src/features'),
        '@chat': path.resolve(__dirname, './src/features/chat'),
        '@notification': path.resolve(__dirname, './src/features/notification'),
        '@analytics': path.resolve(__dirname, './src/features/analytics'),
        '@content': path.resolve(__dirname, './src/features/content'),
        '@feed': path.resolve(__dirname, './src/features/feed'),
        '@profile': path.resolve(__dirname, './src/features/profile'),
        '@search': path.resolve(__dirname, './src/features/search'),
        '@settings': path.resolve(__dirname, './src/features/settings'),
        '@core': path.resolve(__dirname, './src/core'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@constants': path.resolve(__dirname, './src/shared/constants'),
        '@shared-types': path.resolve(__dirname, './src/shared/types'),
        '@': path.resolve(__dirname, './src'),
      }
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            'babel-plugin-styled-components',
            // Remove decorator plugin for manual registration
            // ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }]
          ]
        }
      }),
      // Remove console logs in production for smaller bundles
      !isDevelopment && removeConsole({
        exclude: ['error', 'warn']
      })
    ].filter(Boolean),
    server: {
      host: true,
      port: 5000,
      watch: {
        usePolling: true
      }
    },
    build: {
      outDir: './dist/web',
      // Web-specific build optimizations
      target: 'es2020',
      minify: 'terser',
      sourcemap: isDevelopment,
      rollupOptions: {
        output: {
          // Manual chunk splitting for optimal caching
          manualChunks: {
            // React ecosystem
            'react-vendor': [
              'react',
              'react-dom',
              'react-router-dom',
              'react-error-boundary'
            ],
            // DI and core infrastructure
            'di-core': [
              './src/core/di',
              './src/core/config'
            ],
            // UI components
            'ui-components': [
              'styled-components',
              '@emotion/react',
              '@emotion/styled'
            ],
            // Feature modules
            'features-chat': [
              './src/features/chat'
            ],
            'features-feed': [
              './src/features/feed'
            ],
            'features-auth': [
              './src/features/auth'
            ]
          },
          // Optimize chunk names for better debugging
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? 
              chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '') : 
              'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          }
        },
        // Tree-shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        },
        // External dependencies that shouldn't be bundled
        external: []
      },
      // Web-specific build optimizations
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      // Enable dead code elimination
      terserOptions: {
        compress: {
          drop_console: !isDevelopment,
          drop_debugger: !isDevelopment,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        }
      }
    },
    // Web-specific optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'styled-components',
        '@emotion/react',
        '@emotion/styled'
      ],
      exclude: []
    },
    // Environment-specific configuration
    envPrefix: 'VITE_'
  };
});
