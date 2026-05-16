import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { healthPrograms } from '../demoData';
import { Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function ProgramsScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>Персональные рекомендации</Eyebrow>
        <Title>Программы здоровья</Title>
      </View>
      {healthPrograms.map((program) => (
        <SectionCard key={program.id}>
          <Eyebrow>{program.duration}</Eyebrow>
          <Title>{program.title}</Title>
          <View style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, height: 8, marginTop: spacing[3], overflow: 'hidden' }}>
            <View style={{ backgroundColor: colors.emerald[500], height: 8, width: `${program.progress}%` }} />
          </View>
          <Text style={{ color: colors.gray[700], fontSize: 12, fontWeight: '800', marginTop: spacing[2] }}>{program.progress}% выполнено</Text>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
