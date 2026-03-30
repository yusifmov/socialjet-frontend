import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],

    build: {
        outDir: 'build',
        rollupOptions: {
            input: {
                app: path.resolve(__dirname, 'socialjet/App/app.tsx'),
                menu: path.resolve(__dirname, 'socialjet/Menu/main.tsx'),
                socialjet: path.resolve(__dirname, 'socialjet/SocialJet.ts'),
            },

            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    if (id.includes('/Types/') || id.includes('/Hooks/')) {
                        return 'shared'
                    }
                },
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },

        emptyOutDir: true,
        sourcemap: false,
        minify: true,
    },

    server: {
        origin: 'https://socialpress.ddev.site',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
})