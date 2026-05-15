import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { dashboardSummary } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function HomeScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>{dashboardSummary.nextMedication}</Eyebrow>
        <Title>Доброе утро, {dashboardSummary.userName}</Title>
        <View style={{ backgroundColor: colors.gray[900], borderRadius: radius.largeCard, marginTop: spacing[4], padding: spacing[5] }}>
          <Text style={{ color: colors.white, fontSize: 44, fontWeight: '900' }}>{dashboardSummary.healthIndex}</Text>
          <Text style={{ color: colors.emerald[100], fontSize: 13, fontWeight: '700' }}>из 100 · {dashboardSummary.status}</Text>
        </View>
      </SectionCard>
      <SectionCard>
        <Badge tone="amber">4 показателя вне нормы</Badge>
        <View style={{ marginTop: spacing[3], gap: spacing[2] }}>
          {dashboardSummary.alerts.map((alert) => (
            <Body key={alert}>{alert}</Body>
          ))}
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
