import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        accounts: resolve(__dirname, 'socialjet/Accounts/main.tsx'),
        history: resolve(__dirname, 'socialjet/History/main.tsx'),
        facebook: resolve(__dirname, 'socialjet/Addons/Meta/Facebook/facebook.tsx'),
        menu: resolve(__dirname, 'socialjet/Menu/main.tsx'),
        schedules: resolve(__dirname, 'socialjet/Schedules/main.tsx'),
        settingItems: resolve(__dirname, 'socialjet/SettingItems/main.ts'),
        settings: resolve(__dirname, 'socialjet/Settings/main.tsx'),
        socialjet: resolve(__dirname, 'socialjet/SocialJet.ts'),
      },
      output: {
        manualChunks(id) {
          // Put all code from node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }

          // You can also create a shared chunk for local shared utilities
          if (id.includes('/Types/') || id.includes('/Hooks/')) {
            return 'shared'
          }
        },
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    emptyOutDir: true, // ensure only fresh files appear
    sourcemap: false,
    minify: true,
  },
  server: {
    origin: 'https://socialpress.ddev.site', // match the origin of your WP site
    cors: true, // allow CORS
    headers: {
      'Access-Control-Allow-Origin': '*', // or better: https://socialpress.ddev.site
    },
  },
})