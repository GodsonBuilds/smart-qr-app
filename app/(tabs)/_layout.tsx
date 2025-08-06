import { Tabs } from 'expo-router';
import { Platform} from 'react-native';
import { QrCode, History, CirclePlus as PlusCircle, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';


export default function TabLayout() {
  const { isDark } = useTheme();
 

  // Couleurs adaptatives basées sur le thème
  const tabBarColors = {
    background: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? '#374151' : '#E5E7EB',
    active: '#3B82F6', // Bleu constant pour les onglets actifs
    inactive: isDark ? '#9CA3AF' : '#6B7280',
  };

  // Configuration responsive pour iOS/Android
  const tabBarConfig = {
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    height: Platform.OS === 'ios' ? 85 : 65,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarColors.background,
          borderTopColor: tabBarColors.border,
          borderTopWidth: 1,
          ...tabBarConfig,
        },
        tabBarActiveTintColor: tabBarColors.active,
        tabBarInactiveTintColor: tabBarColors.inactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 8 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <QrCode color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color }) => <History color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Créer',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}