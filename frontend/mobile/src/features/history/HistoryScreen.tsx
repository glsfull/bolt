import { View } from 'react-native';

import { analysisHistory } from '../demoData';
import { Badge, Body, Eyebrow, ScreenShell, SectionCard, Title } from '../shared/components';

export function HistoryScreen() {
  return (
    <ScreenShell>
      <View>
        <Eyebrow>История записей и динамика</Eyebrow>
        <Title>Анализы</Title>
      </View>
      {analysisHistory.map((item) => (
        <SectionCard key={item.id}>
          <Eyebrow>{item.date}</Eyebrow>
          <Title>{item.title}</Title>
          <Badge tone={item.status === 'attention' ? 'amber' : 'emerald'}>{item.deviations} отклонения</Badge>
          <Body>Карточка готова для перехода к расшифровке и графикам динамики.</Body>
        </SectionCard>
      ))}
    </ScreenShell>
  );
}
