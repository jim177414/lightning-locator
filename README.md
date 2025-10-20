# Lightning Locator

Lightning Locator is a React Native app built with Expo that helps you estimate where lightning struck based on the delay between the flash and the thunder. The app leans into playful visuals while keeping safety front and center.

## Key Features

- **Two-tap lightning capture** – Tap “I saw lightning” and “I heard thunder” to record a strike. The app averages your device heading and calculates the target point on a Google map.
- **Uncertainty modeling** – Reaction time, compass error, and GPS accuracy combine into an uncertainty circle that scales with distance.
- **History & sharing** – View all logged strikes, reopen them on the map, and share map snapshots with friends.
- **Ad experience** – Banner ads appear on the home and map screens; an interstitial shows after every Nth strike (configurable via environment variables).
- **Fun mode** – Playful microcopy, streaks, and tiny goat easter eggs when storms get close.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

   Fill in the values for Google Maps, AdMob, and Sentry as needed.

3. Run the Expo dev server:

   ```bash
   npm run start
   ```

## Testing

Run the unit test suite:

```bash
npm test
```

## Project Structure

- `app/` – Expo Router screens (Home, Map, History, Settings)
- `components/` – UI building blocks (buttons, compass, ads, map overlays)
- `lib/` – Core calculations and device integrations (bearing projection, uncertainty, sensors)
- `state/` – Zustand stores for strikes and settings
- `services/` – Local storage, ads, and analytics helpers
- `constants/` – Theme tokens and friendly copy
- `tests/` – Jest unit tests for core math helpers

## Safety Reminder

Lightning is dangerous. Always prioritize shelter and heed guidance from local authorities and meteorological services. This app is for curiosity and education only.
