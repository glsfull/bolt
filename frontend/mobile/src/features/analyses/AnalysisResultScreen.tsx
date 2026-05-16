import { Text, View } from 'react-native';

import type { MarkerStatus } from '../demoData';
import { analysisMarkers } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';
import { colors, radius, spacing } from '../../theme';

const statusTone: Record<MarkerStatus, 'emerald' | 'amber' | 'red' | 'blue'> = {
  low: 'blue',
  normal: 'emerald',
  high: 'amber',
  critical: 'red',
};

const statusLabel: Record<MarkerStatus, string> = {
  low: 'Ниже нормы',
  normal: 'В норме',
  high: 'Выше нормы',
  critical: 'Критично',
};

export function AnalysisResultScreen() {
  const categories = [...new Set(analysisMarkers.map((marker) => marker.category))];

  return (
    <ScreenShell>
      <View>
        <Eyebrow>analysis/result/[id]</Eyebrow>
        <Title>Расшифровка анализа</Title>
      </View>
      {categories.map((category) => (
        <SectionCard key={category}>
          <Eyebrow>{category}</Eyebrow>
          <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
            {analysisMarkers
              .filter((marker) => marker.category === category)
              .map((marker) => {
                const total = marker.max === 0 ? marker.value : marker.max * 1.35;
                const indicator = Math.max(4, Math.min(96, (marker.value / total) * 100));

                return (
                  <View key={marker.id} style={{ borderTopColor: colors.gray[100], borderTopWidth: 1, gap: spacing[2], paddingTop: spacing[3] }}>
                    <View style={{ flexDirection: 'row', gap: spacing[2], justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.gray[900], fontSize: 15, fontWeight: '800' }}>{marker.name}</Text>
                        <Body>{marker.value} {marker.unit} · референс {marker.min}-{marker.max}</Body>
                      </View>
                      <Badge tone={statusTone[marker.status]}>{statusLabel[marker.status]}</Badge>
                    </View>
                    <View style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, height: 10, overflow: 'hidden' }}>
                      <View style={{ backgroundColor: colors.blue[100], height: 10, left: 0, position: 'absolute', width: `${(marker.min / total) * 100}%` }} />
                      <View style={{ backgroundColor: colors.emerald[100], height: 10, left: `${(marker.min / total) * 100}%`, position: 'absolute', width: `${((marker.max - marker.min) / total) * 100}%` }} />
                      <View style={{ backgroundColor: colors.gray[900], height: 10, left: `${indicator}%`, position: 'absolute', width: 3 }} />
                    </View>
                    <Body>{marker.interpretation}</Body>
                    {marker.recommendation ? <Body>{marker.recommendation}</Body> : null}
                  </View>
                );
              })}
          </View>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
