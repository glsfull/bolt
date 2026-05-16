import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const ocrSteps = ['camera', 'cameraPicker', 'ocr_processing', 'ai_processing', 'analysis_jobs', 'completed'];

export function CameraAnalysisScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>Сканер камеры</Eyebrow>
        <Title>Фото бланка анализа</Title>
        <Body>Экран фиксирует клиентский контракт. OCR и AI остаются backend job contract до реализации Edge Functions.</Body>
      </SectionCard>
      <SectionCard>
        <Title>Поток обработки</Title>
        <View style={{ gap: spacing[2], marginTop: spacing[3] }}>
          {ocrSteps.map((step) => (
            <Text key={step} style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, color: colors.gray[800], fontSize: 12, fontWeight: '800', padding: spacing[2] }}>
              {step}
            </Text>
          ))}
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
