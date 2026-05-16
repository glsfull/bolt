import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { healthPrograms } from '../demoData';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function ProgramDetailScreen() {
  const program = healthPrograms[0];

  return (
    <ScreenShell>
      <View>
        <Eyebrow>Карточка программы</Eyebrow>
        <Title>{program.title}</Title>
      </View>
      <SectionCard>
        <Eyebrow>{program.duration}</Eyebrow>
        <Body>Цель программы: стабилизировать показатели и связать рекомендации с последними анализами.</Body>
        <View style={{ backgroundColor: colors.gray[100], borderRadius: radius.badge, height: 8, marginTop: spacing[3], overflow: 'hidden' }}>
          <View style={{ backgroundColor: colors.emerald[500], height: 8, width: `${program.progress}%` }} />
        </View>
        <Text style={{ color: colors.gray[700], fontSize: 12, fontWeight: '800', marginTop: spacing[2] }}>{program.progress}% выполнено</Text>
      </SectionCard>
      {['Проверить ферритин', 'Добавить питание с железом', 'Повторить анализ через 14 дней'].map((step) => (
        <SectionCard key={step}>
          <Body>{step}</Body>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}

export function ActiveProgramScreen() {
  const program = healthPrograms[1];

  return (
    <ScreenShell>
      <View>
        <Eyebrow>Активная программа</Eyebrow>
        <Title>{program.title}</Title>
      </View>
      <SectionCard>
        <Eyebrow>Следующий шаг</Eyebrow>
        <Title>Запланировать липидограмму</Title>
        <Body>Программа показывает текущую задачу, прогресс и связь с рисками.</Body>
      </SectionCard>
      <SectionCard>
        <Eyebrow>Прогресс</Eyebrow>
        <Text style={{ color: colors.gray[900], fontSize: 30, fontWeight: '900' }}>{program.progress}%</Text>
      </SectionCard>
    </ScreenShell>
  );
}
