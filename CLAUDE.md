# CLAUDE.md

Frontend (React + TypeScript SPA) for the SocialJet WordPress plugin. The backend and the full project guide live in the plugin repo: `C:\laragon\www\socialpress\wp-content\plugins\socialjet\CLAUDE.md`.

Verify changes with `npx tsc --noEmit -p tsconfig.app.json` and `npm run lint`. Production build: `npm run build` (main bundle, then `vite.shared.config.ts` → `build/shared/`), then copy all of `build/` into the plugin's `build/` folder.

## Layout

- `socialjet/` — the host: registry install (`SocialJet.ts`), menu shell (hash-routed: `#/schedules`), pages (Accounts, Schedules, History, Settings), post-text editor.
- `addons/<network>/` — built-in social networks. Code here may import **only** `@socialjet/sdk`, plus antd, React and icon packages; eslint enforces this. They get the same API as third-party add-ons.
- `@socialjet/sdk` — `C:\Users\MSI\WebstormProjects\socialjet-sdk`, linked as `file:../socialjet-sdk` during development. It holds the types, `sj`, `useApi`, `createAccountProvider`, `OAuthAppModal` and the Vite preset. Change shared contracts there, run its `npm run build`, then rebuild here.
- React, react-dom, antd, `@ant-design/cssinjs` and dayjs are **external** (`@socialjet/shared/*`, served by the plugin). Never deep-import `antd/es/...`. Their versions come from the SDK's `shared-deps.json` (`npm run socialjet:update`).
- `npm run dev`: set `VITE_WP_ORIGIN` in `.env.local` (see `.env.example`) and define `SOCIALJET_DEVELOPMENT` in wp-config.

## Release cycle (branching)

This repo follows the same cycle as the plugin, with the same version number. Full steps: the `release-cycle` skill at `C:\laragon\www\socialpress\wp-content\plugins\socialjet\.claude\skills\release-cycle\SKILL.md` — read it before creating branches, bumping versions or merging.

1. Right after a deploy: from `main`, create `vX.Y.Z` (next version), bump `"version"` in `package.json` (`npm version X.Y.Z --no-git-tag-version`), commit, push.
2. Develop on `feature/<name>` cut from `vX.Y.Z`; commit, push, merge `--no-ff` back into `vX.Y.Z`, delete the feature branch. Cross-repo features use the same branch name in both repos.
3. Before deploy: typecheck, lint, build, hand `build/` to the plugin; merge `vX.Y.Z` into `main`, tag `vX.Y.Z`, push both.
4. Deploy from `main`, delete the old release branch, start the next cycle.

Never commit feature work directly to `main` or the release branch. Merge into `main` only when the user asks to release.
