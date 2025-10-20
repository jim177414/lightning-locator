# Lightning Locator – GitHub Copilot Guidance

Thanks for helping build Lightning Locator! Use these guardrails when suggesting code:

## Architecture Reminders
- Expo Router drives navigation. Screens live in the `app/` directory and should remain lightweight, delegating logic to hooks/utilities.
- Keep geodesy math in `lib/bearing.ts`, uncertainty modeling in `lib/uncertainty.ts`, and sensor coordination in `lib/sensors.ts`.
- Persisted data (strikes, settings) flows through Zustand stores in `state/` and storage helpers in `services/storage.service.ts`.

## Coding Patterns
- Prefer functional React components with hooks. Avoid classes.
- Reuse tokens from `constants/theme.ts` for colors/typography.
- Gate ads, analytics, and fun-mode behavior behind feature flags exposed in `lib/env.ts`.
- Keep asynchronous Expo API calls wrapped in helpers instead of sprinkling them across UI layers.

## Testing & Quality
- Add Jest unit tests for any new math or stateful helper logic (`tests/unit`).
- Run `npm run lint` and `npm run typecheck` before shipping changes.
- Ensure new environment variables are documented in `.env.example` and described in the README when relevant.

## UX & Safety
- Maintain the playful-yet-safe tone; never remove the safety disclaimer.
- Respect accessibility: ensure tappable targets are large and text is legible.

## Commit Hygiene
- Keep commits focused and include context in messages.
- Update documentation (README, comments) when workflows or setup steps change.

Follow these guidelines to keep Lightning Locator maintainable, friendly, and safe! ⚡
