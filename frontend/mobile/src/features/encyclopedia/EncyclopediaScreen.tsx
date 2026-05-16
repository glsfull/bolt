import { Text, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { analysisMarkers, type AnalysisMarker } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function EncyclopediaScreen() {
  const search = 'гемоглобин, холестерин, crp';

  return (
    <ScreenShell>
      <View>
        <Eyebrow>Справочник показателей</Eyebrow>
        <Title>Каталог анализов</Title>
      </View>
      <SectionCard>
        <Eyebrow>search</Eyebrow>
        <Body>{search}</Body>
      </SectionCard>
      {analysisMarkers.map((marker) => (
        <MarkerCard key={marker.id} marker={marker} />
      ))}
    </ScreenShell>
  );
}

export function MarkerDetailScreen() {
  const markerCard = analysisMarkers[0];

  return (
    <ScreenShell>
      <View>
        <Eyebrow>markerCard</Eyebrow>
        <Title>{markerCard.name}</Title>
      </View>
      <MarkerCard marker={markerCard} expanded />
    </ScreenShell>
  );
}

function MarkerCard({ marker, expanded = false }: { marker: AnalysisMarker; expanded?: boolean }) {
  return (
    <SectionCard>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Eyebrow>{marker.category}</Eyebrow>
          <Title>{marker.name}</Title>
        </View>
        <Badge tone={marker.status === 'normal' ? 'emerald' : marker.status === 'high' ? 'amber' : marker.status === 'critical' ? 'red' : 'blue'}>
          {marker.status}
        </Badge>
      </View>
      <Text style={{ color: colors.gray[900], fontSize: 18, fontWeight: '900', marginTop: spacing[3] }}>
        reference {marker.min}-{marker.max} {marker.unit}
      </Text>
      <Body>{expanded ? `${marker.interpretation} ${marker.recommendation ?? ''}` : marker.interpretation}</Body>
    </SectionCard>
  );
}
