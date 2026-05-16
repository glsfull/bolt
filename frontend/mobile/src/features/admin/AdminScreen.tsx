import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const adminSections = [
  { id: 'aiOcrSettings', title: 'AI/OCR провайдеры', body: 'Модели, лимиты токенов и серверные ключи отображаются без раскрытия значений.' },
  { id: 'limits', title: 'Лимиты пользователей', body: 'Месячные загрузки, генерация отчетов и частота OCR-задач.' },
  { id: 'disabledFeatures', title: 'Feature flags', body: 'Отключенные возможности показывают причину и дату изменения.' },
];

export function AdminScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>Панель администратора</Eyebrow>
        <Title>Операционные настройки</Title>
      </View>
      {adminSections.map((section) => (
        <SectionCard key={section.id}>
          <Eyebrow>{section.id}</Eyebrow>
          <Title>{section.title}</Title>
          <Body>{section.body}</Body>
        </SectionCard>
      ))}
      <SectionCard>
        <Eyebrow>audit_log</Eyebrow>
        <Body>Изменения настроек пишутся в журнал аудита с user_id, таблицей, операцией и временем события.</Body>
        <View style={{ backgroundColor: colors.amber[50], borderRadius: radius.badge, marginTop: spacing[3], padding: spacing[3] }}>
          <Text style={{ color: colors.amber[800], fontSize: 12, fontWeight: '800' }}>Доступен только роли администратора.</Text>
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
