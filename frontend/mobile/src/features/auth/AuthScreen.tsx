import { Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

const authStates = [
  { id: 'entry', title: 'Вход или регистрация', body: 'Supabase Auth принимает email и пароль, а профиль создается после первого входа.' },
  { id: 'login', title: 'Форма входа', body: 'email: anna@example.com' },
  { id: 'loginError', title: 'Ошибка входа', body: 'Неверный пароль или неподтвержденный email показываются без перехода со страницы.' },
  { id: 'recovery', title: 'Восстановление', body: 'Письмо восстановления отправляется через Supabase Auth.' },
];

export function AuthScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>Авторизация</Eyebrow>
        <Title>Доступ к профилю</Title>
      </View>
      {authStates.map((state) => (
        <SectionCard key={state.id}>
          <Eyebrow>{state.id}</Eyebrow>
          <Title>{state.title}</Title>
          <Body>{state.body}</Body>
          <View style={{ backgroundColor: colors.gray[50], borderRadius: radius.badge, marginTop: spacing[3], padding: spacing[3] }}>
            <Text style={{ color: colors.gray[700], fontSize: 12, fontWeight: '800' }}>Состояние готово для подключения к backend.</Text>
          </View>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
