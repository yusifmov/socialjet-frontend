// Builds build/shared/: one ES module per shared package (React, antd, dayjs...) and
// modules.json, which the plugin registers as @socialjet/shared/* script modules.
// Runs after the main build (`npm run build`).
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineSharedModulesConfig } from '@socialjet/sdk/vite'

export default defineSharedModulesConfig({ root: path.dirname(fileURLToPath(import.meta.url)) })
