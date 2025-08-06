import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import './global.css';

function ThemedLayout() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack 
        initialRouteName='index' 
        screenOptions={{ 
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF'
          }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
}