import { Text, View } from 'react-native';

import { medicalDisclaimer } from '../../navigation/routes';
import { colors, radius, spacing } from '../../theme';
import { doctorReportPreview } from '../demoData';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function DoctorReportScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>{doctorReportPreview.period}</Eyebrow>
        <Title>Отчет для врача</Title>
        <Body>{doctorReportPreview.patient}</Body>
      </SectionCard>
      <SectionCard>
        <Title>Состав PDF</Title>
        <View style={{ gap: spacing[2], marginTop: spacing[3] }}>
          {doctorReportPreview.sections.map((section) => (
            <Text key={section} style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, color: colors.gray[800], fontSize: 12, fontWeight: '800', padding: spacing[2] }}>
              {section}
            </Text>
          ))}
        </View>
      </SectionCard>
      <SectionCard>
        <Eyebrow>PDF job</Eyebrow>
        <Body>{doctorReportPreview.pdfStatus}</Body>
        <Text style={{ color: colors.amber[800], fontSize: 12, lineHeight: 17, marginTop: spacing[3] }}>{medicalDisclaimer}</Text>
      </SectionCard>
    </ScreenShell>
  );
}
