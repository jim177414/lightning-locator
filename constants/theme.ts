export const palette = {
  background: '#0D1321',
  surface: '#1D2D44',
  surfaceAlt: '#3E5C76',
  accent: '#F0A500',
  accentSoft: '#F7C873',
  textPrimary: '#F7F9FB',
  textSecondary: '#A4B3C4',
  danger: '#FF6B6B',
  success: '#6FFFE9'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24
};

export const typography = {
  heading: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700' as const
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400' as const
  },
  label: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600' as const
  }
};

export const shadow = {
  default: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  }
};

export const theme = {
  palette,
  spacing,
  radius,
  typography,
  shadow
};

export type Theme = typeof theme;
