import { Text, View } from 'react-native';

import { medicalDisclaimer, routeMap, type AppRouteId } from '../navigation/routes';
import { colors, radius, spacing } from '../theme';

type Props = {
  routeId: AppRouteId;
};

export function ScreenPlaceholder({ routeId }: Props) {
  const route = routeMap.find((item) => item.id === routeId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray[50], padding: spacing[4], paddingTop: spacing[8] }}>
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: radius.card,
          padding: spacing[4],
          borderWidth: 1,
          borderColor: colors.gray[200],
        }}
      >
        <Text style={{ color: colors.gray[500], fontSize: 11, fontWeight: '700' }}>
          {route?.path ?? '/app'}
        </Text>
        <Text style={{ color: colors.gray[900], fontSize: 22, fontWeight: '800', marginTop: spacing[2] }}>
          {route?.label ?? 'Экран'}
        </Text>
        <Text style={{ color: colors.gray[500], fontSize: 13, lineHeight: 18, marginTop: spacing[3] }}>
          Этап 1 фиксирует Expo Router каркас, карту маршрутов и дизайн-токены. Перенос UI выполняется по эталону:
          {' '}
          {route?.sourceScreen}
        </Text>
        {route?.requiresMedicalDisclaimer ? (
          <Text style={{ color: colors.amber[800], fontSize: 12, lineHeight: 17, marginTop: spacing[4] }}>
            {medicalDisclaimer}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
