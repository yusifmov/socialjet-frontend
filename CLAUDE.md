# CLAUDE.md

Frontend (React + TypeScript SPA) for the SocialJet WordPress plugin. The backend and the full project guide live in the plugin repo: `C:\laragon\www\socialpress\wp-content\plugins\socialjet\CLAUDE.md`.

Verify changes with `npx tsc --noEmit -p tsconfig.app.json` and `npm run lint`. Production build: `npm run build`, then copy `build/` into the plugin's `build/` folder.

## Release cycle (branching)

This repo follows the same cycle as the plugin, with the same version number. Full steps: the `release-cycle` skill at `C:\laragon\www\socialpress\wp-content\plugins\socialjet\.claude\skills\release-cycle\SKILL.md` — read it before creating branches, bumping versions or merging.

1. Right after a deploy: from `main`, create `vX.Y.Z` (next version), bump `"version"` in `package.json` (`npm version X.Y.Z --no-git-tag-version`), commit, push.
2. Develop on `feature/<name>` cut from `vX.Y.Z`; commit, push, merge `--no-ff` back into `vX.Y.Z`, delete the feature branch. Cross-repo features use the same branch name in both repos.
3. Before deploy: typecheck, lint, build, hand `build/` to the plugin; merge `vX.Y.Z` into `main`, tag `vX.Y.Z`, push both.
4. Deploy from `main`, delete the old release branch, start the next cycle.

Never commit feature work directly to `main` or the release branch. Merge into `main` only when the user asks to release.
