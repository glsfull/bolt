import { Text, View } from 'react-native';

import { medicalDisclaimer } from '../../navigation/routes';
import { colors, radius, spacing } from '../../theme';
import { symptomTags } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function AiScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>ИИ-диагностика</Eyebrow>
        <Title>Опишите симптомы</Title>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[4] }}>
          {symptomTags.map((tag) => (
            <Text key={tag} style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, color: colors.gray[800], fontSize: 12, fontWeight: '700', paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
              {tag}
            </Text>
          ))}
        </View>
      </SectionCard>
      <SectionCard>
        <Badge tone="blue">Предварительная оценка</Badge>
        <Body>Вероятные направления: терапевт, эндокринолог. Сценарий сохраняет обязательный медицинский дисклеймер.</Body>
        <Text style={{ color: colors.amber[800], fontSize: 12, lineHeight: 17, marginTop: spacing[3] }}>{medicalDisclaimer}</Text>
      </SectionCard>
    </ScreenShell>
  );
}
