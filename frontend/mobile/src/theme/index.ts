export const colors = {
  white: '#ffffff',
  black: '#111111',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    800: '#065f46',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    500: '#f59e0b',
    600: '#d97706',
    800: '#92400e',
  },
  red: {
    50: '#fef2f2',
    200: '#fecaca',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    700: '#be123c',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    600: '#2563eb',
    800: '#1e40af',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    600: '#0d9488',
    700: '#0f766e',
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const;

export const radius = {
  badge: 8,
  icon: 10,
  card: 16,
  actionCard: 18,
  largeCard: 24,
  phoneMockup: 50,
} as const;

export const typography = {
  family: {
    system: '-apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, sans-serif',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  size: {
    tab: 9,
    caption: 11,
    body: 14,
    cardTitle: 15,
    metric: 22,
    heroName: 22,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
} as const;
