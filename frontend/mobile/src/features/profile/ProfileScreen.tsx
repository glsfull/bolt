import { View } from 'react-native';

import { profileSummary } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function ProfileScreen() {
  return (
    <ScreenShell>
      <SectionCard>
        <Eyebrow>Профиль здоровья</Eyebrow>
        <Title>{profileSummary.age} года · ИМТ {profileSummary.bmi}</Title>
        <Badge tone="blue">Группа крови {profileSummary.bloodType}</Badge>
      </SectionCard>
      <SectionCard>
        <Title>Медицинские факторы</Title>
        <View style={{ marginTop: 12 }}>
          <Body>Хронические состояния: {profileSummary.chronic.join(', ')}</Body>
          <Body>Аллергии: {profileSummary.allergies.join(', ')}</Body>
        </View>
      </SectionCard>
    </ScreenShell>
  );
}
