# GitHub Copilot Usage Guide for Lightning Locator

This repository hosts a React Native app built with Expo Router. Lightning Locator estimates a lightning strike location by combining user input ("I saw lightning" / "I heard thunder") with device heading, GPS coordinates, and timing calculations. The codebase leans on TypeScript, Expo SDK 51, Zustand, and TanStack Query.

## General Expectations
- Prefer TypeScript with strict typing; keep `types/` definitions synchronized with component props and stores.
- Favor functional React components with hooks (`useMemo`, `useCallback`) and Zustand selectors. Avoid class components.
- Respect the theme tokens in `constants/theme.ts` for colors, spacing, and typography.
- Keep business logic for bearing, distance, and uncertainty in `lib/`. UI components in `components/` should stay presentational.
- Avoid reintroducing side effects inside render paths; put async work in `useEffect` or service helpers.
- Persist user data through the storage helpers in `services/storage.ts` and state updates in `state/` stores.
- Test utilities live in `tests/unit/`; add coverage there for new lib helpers.

## File Organization
- Screens live under `app/` using Expo Router conventions (`app/(tabs)/index.tsx`, etc.).
- Reusable UI primitives (buttons, cards, map overlays) live in `components/`.
- Core math lives in `lib/geometry`, `lib/uncertainty`, and `lib/compass`.
- Zustand stores reside in `state/strikeStore.ts` and `state/settingsStore.ts`.
- Services for analytics, ads, and persistence are in `services/`.
- Constants for copy and configuration belong in `constants/`.

## Coding Patterns
- Use `zustand` slices for new state; avoid prop drilling between screens.
- For asynchronous work, prefer TanStack Query or Expo APIs encapsulated in services.
- When introducing new dependencies, update the README, environment templates, and ensure Expo supports them.
- Follow the existing ESLint + Prettier config (eslint-config-universe). Ensure `npm run lint` passes locally.
- Expo Router dynamic routes should follow `[id].tsx` naming and use `useLocalSearchParams` for params.

## Testing Guidance
- Write Jest unit tests for pure functions in `lib/`. Use `tests/unit/*` as the pattern.
- For hooks, leverage React Testing Library with the existing Jest Expo setup.
- Keep snapshot tests for visual components minimal; prefer behavior assertions.

## Pull Request Tips
- Update documentation (README, AGENTS.md) when changing user flows or app purpose.
- Include screenshots for user-facing UI changes when possible.
- Explain how to reproduce bugs and how fixes address them.

Use these notes to keep Copilot suggestions aligned with the project structure and standards.
