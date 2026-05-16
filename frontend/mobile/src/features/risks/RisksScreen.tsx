import { Text, View } from 'react-native';

import { medicalDisclaimer } from '../../navigation/routes';
import { colors, radius, spacing } from '../../theme';
import { riskAssessments } from '../demoData';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function RisksScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>Оценка рисков</Eyebrow>
        <Title>Последние предупреждения</Title>
      </View>
      {riskAssessments.map((risk) => (
        <SectionCard key={risk.id}>
          <Eyebrow>{risk.level}</Eyebrow>
          <Title>{risk.title}</Title>
          <View style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, height: 8, marginTop: spacing[3], overflow: 'hidden' }}>
            <View style={{ backgroundColor: colors.amber[500], height: 8, width: `${risk.score}%` }} />
          </View>
          <Body>{risk.score} из 100 по текущим анализам и профилю.</Body>
        </SectionCard>
      ))}
      <Text style={{ color: colors.amber[800], fontSize: 12, lineHeight: 17 }}>{medicalDisclaimer}</Text>
    </ScreenShell>
  );
}
