import { Tabs } from 'expo-router';
import { Brain, ChartNoAxesColumn, HeartPulse, History, User } from 'lucide-react-native';

import { bottomTabs } from '../../src/navigation/routes';
import { colors, spacing } from '../../src/theme';

const tabIcons = {
  home: HeartPulse,
  analyses: History,
  ai: Brain,
  programs: ChartNoAxesColumn,
  profile: User,
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.emerald[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          height: 64,
          paddingBottom: spacing[2],
          paddingTop: spacing[2],
          borderTopColor: colors.gray[200],
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
        },
      }}
    >
      {bottomTabs.map((tab) => {
        const Icon = tabIcons[tab.id];
        return (
          <Tabs.Screen
            key={tab.id}
            name={tab.segment}
            options={{
              title: tab.label,
              tabBarIcon: ({ color, size }) => <Icon color={color} size={size} />,
            }}
          />
        );
      })}
    </Tabs>
  );
}
