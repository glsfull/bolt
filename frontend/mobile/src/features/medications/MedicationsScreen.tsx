import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const medicationPlan = [
  { id: 'morning-iron', time: '08:30', period: 'morning', title: 'Железо', dose: '1 таблетка после завтрака', status: 'Сегодня принято' },
  { id: 'afternoon-d3', time: '14:00', period: 'afternoon', title: 'Витамин D', dose: '2000 МЕ во время еды', status: 'Ожидает отметки' },
  { id: 'evening-omega', time: '20:30', period: 'evening', title: 'Омега-3', dose: '2 капсулы после ужина', status: 'reminder включен' },
];

export function MedicationsScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>Расписание лекарств</Eyebrow>
        <Title>Приемы на сегодня</Title>
      </View>

      <SectionCard>
        <Eyebrow>adherence</Eyebrow>
        <Text style={{ color: colors.gray[900], fontSize: 34, fontWeight: '900', marginTop: spacing[1] }}>86%</Text>
        <Body>Соблюдение плана за последние 7 дней. Пропущенные приемы подсвечиваются и попадают в отчет врачу.</Body>
      </SectionCard>

      {medicationPlan.map((item) => (
        <SectionCard key={item.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <Eyebrow>{item.period}</Eyebrow>
              <Title>{item.title}</Title>
            </View>
            <Badge tone={item.period === 'morning' ? 'emerald' : item.period === 'afternoon' ? 'blue' : 'amber'}>{item.time}</Badge>
          </View>
          <Body>{item.dose}</Body>
          <View style={{ backgroundColor: colors.gray[50], borderRadius: radius.badge, marginTop: spacing[3], padding: spacing[3] }}>
            <Text style={{ color: colors.gray[700], fontSize: 12, fontWeight: '800' }}>{item.status}</Text>
          </View>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
