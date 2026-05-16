import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { colors, radius, shadows, spacing } from '../../theme';

export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.gray[50] }} contentContainerStyle={{ padding: spacing[4], paddingTop: spacing[8], gap: spacing[4] }}>
      {children}
    </ScrollView>
  );
}

export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: radius.card, borderWidth: 1, borderColor: colors.gray[200], padding: spacing[4], ...shadows.card }}>
      {children}
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={{ color: colors.gray[500], fontSize: 11, fontWeight: '700' }}>{children}</Text>;
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={{ color: colors.gray[900], fontSize: 22, fontWeight: '800' }}>{children}</Text>;
}

export function Body({ children }: { children: ReactNode }) {
  return <Text style={{ color: colors.gray[600], fontSize: 13, lineHeight: 19 }}>{children}</Text>;
}

export function Badge({ children, tone = 'emerald' }: { children: ReactNode; tone?: 'emerald' | 'amber' | 'red' | 'blue' }) {
  const palette = {
    emerald: [colors.emerald[50], colors.emerald[800]],
    amber: [colors.amber[50], colors.amber[800]],
    red: [colors.red[50], colors.red[700]],
    blue: [colors.blue[50], colors.blue[800]],
  }[tone];

  return (
    <Text style={{ alignSelf: 'flex-start', backgroundColor: palette[0], borderRadius: radius.badge, color: palette[1], fontSize: 11, fontWeight: '800', paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
      {children}
    </Text>
  );
}
