# Lightning Locator Agent Guide

Welcome! This document describes how to work inside the Lightning Locator Expo repository. It applies to the entire project unless a nested `AGENTS.md` overrides guidance.

## Mission Overview
- Lightning Locator is an Expo Router application that estimates lightning strike locations using heading + thunder delay and renders the results on a Google map.
- The app emphasises playful, safety-conscious UX. Ads (banner + interstitial) are feature-flagged through environment variables.
- Core logic lives in `lib/`, reusable UI in `components/`, screens in `app/`, state in `state/`, and services/utilities in `services/`.

## Engineering Guidelines
1. **TypeScript first.** Keep types precise. Prefer explicit return types on exported functions and components.
2. **Functional React patterns.** Use hooks and functional components; avoid class components. Keep hooks ordered properly.
3. **State Management.** Global state should flow through existing Zustand stores in `state/`. Local component state via `useState` / `useReducer`.
4. **Sensors & Async APIs.** Encapsulate platform APIs in `lib/` helpers. Do not call Expo APIs directly inside components unless they are view-specific.
5. **Testing.** Add/update Jest tests alongside any math or logic changes. New helper modules require unit coverage in `tests/unit/`.
6. **Styling.** Use the design tokens from `constants/theme.ts`. Extend tokens before hardcoding colors or typography.
7. **Ads & Analytics.** Respect feature flags in `lib/env.ts`; ensure new features degrade gracefully when ads/analytics are disabled.
8. **Safety Copy.** Keep disclaimers intact. If editing copy, ensure tone remains playful yet safety-forward.
9. **Files & Folders.** Follow the existing structure when adding features. Keep screens in `app/`, components in `components/`, etc.
10. **Formatting & Linting.** Run `npm run lint` and `npm run typecheck` before committing when possible.

## Pull Requests & Documentation
- Update `README.md` if developer setup or workflows change.
- Record any new environment variables in `.env.example` and document them.
- When altering UX flows, describe user-facing impacts in the PR summary.

Thank you for keeping Lightning Locator delightful and reliable! ⚡
