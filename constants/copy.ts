export const copy = {
  appTitle: 'Lightning Locator',
  sawLightningButton: 'I saw lightning ⚡',
  heardThunderButton: 'I heard thunder 🔊',
  distanceHelper: 'Rule of 5: Every 5 seconds ≈ 1 mile. Rule of 3: Every 3 seconds ≈ 1 km.',
  safetyOnboardingTitle: 'Storm Safety First',
  safetyOnboardingBody:
    'This app is for curiosity only. Follow local guidance and NOAA/Met warnings. If thunder is within 30 seconds, seek shelter immediately.',
  safetyOnboardingCta: "I understand — let me track!",
  compassLabel: 'Heading',
  strikeAdCountdown: (remaining: number) =>
    remaining === 0
      ? 'Ad incoming!'
      : `Next full-screen ad in ${remaining} strike${remaining === 1 ? '' : 's'}.`,
  streakLabels: {
    good: 'Pro Listener! Keep that timing tight.',
    great: 'Thor salutes your reflexes.',
    goats: 'RUN, GOATS! ⚡🐐'
  }
};
