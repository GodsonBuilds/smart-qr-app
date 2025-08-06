import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider, useAppContext } from '@/contexts/AppContext'; 
import './global.css';

function ThemedLayout() {
  const { isDark } = useAppContext(); 
  
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
    <AppProvider> {/* Changé de ThemeProvider à AppProvider */}
      <ThemedLayout />
    </AppProvider>
  );
}