/**
 * Mobile Platform Build Configuration
 * Optimized for mobile deployment with platform-specific features
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import removeConsole from 'vite-plugin-remove-console';
import { getViteAliases } from './config/paths';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    define: {
      global: 'globalThis',
      // Build-time platform definition for maximum tree-shaking
      'process.env.PLATFORM': JSON.stringify('mobile'),
      'process.env.BUILD_TARGET': JSON.stringify('mobile'),
      // Mobile-specific environment variables
      'process.env.MOBILE_API_URL': process.env.MOBILE_API_URL || 'https://api-mobile.quietspace.com',
      'process.env.VITE_ENABLE_WEBSOCKET': process.env.VITE_ENABLE_WEBSOCKET || 'true',
      'process.env.VITE_ENABLE_PUSH_NOTIFICATIONS': process.env.VITE_ENABLE_PUSH_NOTIFICATIONS || 'true',
      'process.env.VITE_ENABLE_BACKGROUND_SYNC': process.env.VITE_ENABLE_BACKGROUND_SYNC || 'true',
      'process.env.VITE_CACHE_STRATEGY': process.env.VITE_CACHE_STRATEGY || 'persistent',
      'process.env.VITE_ENABLE_OFFLINE_MODE': process.env.VITE_ENABLE_OFFLINE_MODE || 'true',
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
            // Remove decorator plugin for manual registration
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
      port: 5001, // Different port for mobile
      watch: {
        usePolling: true
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
    port: 5001, // Different port for mobile
      watch: {
    usePolling: true
  }
},
build: {
  outDir: './dist/mobile',
    // Mobile-specific build optimizations
    target: 'es2020',
      minify: 'terser',
        sourcemap: isDevelopment,
          rollupOptions: {
    output: {
      // Mobile-specific chunk splitting
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
            // Mobile-specific features
            'mobile-features': [
              './src/core/push',
              './src/core/sync',
              './src/core/offline'
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
    }
  },
  // Mobile-specific build optimizations
  cssCodeSplit: true,
    chunkSizeWarningLimit: 1200, // Higher limit for mobile features
      // Enable dead code elimination
      terserOptions: {
    compress: {
      drop_console: !isDevelopment,
        drop_debugger: !isDevelopment,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
    }
  }
},
// Mobile-specific optimizations
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-router-dom',
    'styled-components',
    '@emotion/react',
    '@emotion/styled'
  ]
},
// Environment-specific configuration
envPrefix: 'VITE_'
  };
});
