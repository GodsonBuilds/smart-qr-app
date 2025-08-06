import { useAppContext } from '@/contexts/AppContext';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppContext();

  return (
    <View
      style={{
        paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20),
        paddingBottom: 15,
        paddingHorizontal: 20,
      }}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}
    >
      <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>
      {subtitle && (
        <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};