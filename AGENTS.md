# Lightning Locator Agent Guide

Welcome to the Lightning Locator Expo project. This guide helps future AI agents and contributors quickly understand the codebase and expectations.

## Project Overview
- **Platform:** React Native with Expo Router (SDK 51)
- **Purpose:** Helps users estimate where lightning struck by timing the delay between the flash and thunder, combining sensor readings and playful visuals.
- **Key Domains:** Geospatial math, device sensor fusion, strike history persistence, ad delivery, and friendly microcopy.

## Directory Map
- `app/` — Expo Router screens (`(tabs)`, modal routes) written in TypeScript.
- `components/` — Presentational building blocks (buttons, compass, strike cards, overlays).
- `lib/` — Pure logic helpers (bearing projection, distance math, uncertainty modeling, sensor adapters).
- `services/` — Integration layers (storage, analytics, ads, sharing utilities).
- `state/` — Zustand stores for strike data and user settings.
- `constants/` — Theme tokens, copy strings, and configuration defaults.
- `types/` — Shared TypeScript definitions.
- `tests/` — Jest unit tests for `lib/` and utilities (run with `npm test`).

## Coding Standards
- Use TypeScript with explicit types where practical.
- Keep calculations and side-effect-free helpers in `lib/`; screens/components should focus on presentation and user interaction.
- Rely on Zustand selectors to avoid unnecessary re-renders.
- Follow ESLint rules (eslint-config-universe) and keep formatting consistent with Prettier defaults.
- Update documentation (README, this file) when you change the app’s behavior or architecture.

## Testing & Tooling
- Install dependencies via `npm install` (Expo-compatible versions pinned in `package.json`).
- Run the unit test suite with `npm test`.
- Use `npm run lint` and `npm run typecheck` before committing substantial changes.

## Environment Notes
- Environment variables (API keys for maps, ads, analytics) live in `.env`; see `.env.example` when available.
- Expo Router entry point is `expo-router/entry` specified in `package.json`.

## Pull Request Expectations
- Include a summary of changes, testing evidence, and screenshots for UI modifications.
- Mention any dependency upgrades and their impact on Expo compatibility.

Thanks for helping keep Lightning Locator accurate, safe, and fun!
