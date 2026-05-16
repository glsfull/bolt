import { Text, View } from 'react-native';

import { uploadAnalysisFile } from '../../services/supabase/readLayer';
import { colors, radius, spacing } from '../../theme';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const backendJobContract = ['upload-analysis-file', 'analysis_jobs', 'uploaded', 'ocr_processing', 'ai_processing', 'completed'];

void uploadAnalysisFile;

export function UploadAnalysisScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>Загрузка анализа</Eyebrow>
        <Title>PDF, JPG, PNG или HEIC</Title>
        <Body>Файл сохраняется в приватном Supabase Storage bucket, затем создается запись analysis_jobs со статусом uploaded.</Body>
      </SectionCard>
      <SectionCard>
        <Title>Backend job contract</Title>
        <View style={{ gap: spacing[2], marginTop: spacing[3] }}>
          {backendJobContract.map((step, index) => (
            <View key={step} style={{ flexDirection: 'row', gap: spacing[3] }}>
              <Text style={{ backgroundColor: colors.emerald[50], borderRadius: radius.badge, color: colors.emerald[800], fontWeight: '900', paddingHorizontal: spacing[2] }}>{index + 1}</Text>
              <Body>{step}</Body>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
