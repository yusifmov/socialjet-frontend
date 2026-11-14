/**
 * Built-in social network add-ons. Each folder registers itself through
 * `@socialjet/sdk` only — the same API third-party add-ons use — so they must not
 * import from `socialjet/` (enforced by eslint).
 */
import './meta/index.tsx';
import './linkedin/index.tsx';
import './telegram/index.tsx';
import './pinterest/index.tsx';
