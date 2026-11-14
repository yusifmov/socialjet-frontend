import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { socialjetSharedExternals } from '@socialjet/sdk/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
    // VITE_WP_ORIGIN in .env.local, e.g. http://socialpress.test (only used by `npm run dev`).
    const env = loadEnv(mode, __dirname, 'VITE_')

    return {
        // React, antd, dayjs come from the plugin as @socialjet/shared/* script modules,
        // shared with third-party add-ons. They're built by vite.shared.config.ts.
        plugins: [socialjetSharedExternals(), react()],

        resolve: {
            // The SDK is linked from ../socialjet-sdk during development; never resolve its own copies.
            dedupe: ['react', 'react-dom', 'antd', '@ant-design/cssinjs', 'dayjs'],
        },

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
            origin: env.VITE_WP_ORIGIN || undefined,
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    }
})
