import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, HistoryItem } from '../types';
import { getSettings, saveSettings, getHistory } from '../services/storage';
import { useColorScheme, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  history: HistoryItem[];
  refreshHistory: () => Promise<void>;
  isLoading: boolean;
  isDark: boolean;
  themePreference: 'system' | 'light' | 'dark';
  toggleTheme: (theme?: 'system' | 'light' | 'dark') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>({
    saveHistory: true,
    language: 'fr',
    themePreference: 'system'
  });
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const updateTheme = (preference: 'system' | 'light' | 'dark') => {
    const shouldBeDark = preference === 'system' 
      ? systemTheme === 'dark' 
      : preference === 'dark';
    
    setIsDark(shouldBeDark);
    updateNavigationBar(shouldBeDark);
  };

  const updateNavigationBar = async (darkMode: boolean) => {
    if (Platform.OS === 'android') {
      try {
        await NavigationBar.setBackgroundColorAsync(darkMode ? '#1F2937' : '#FFFFFF');
        await NavigationBar.setButtonStyleAsync(darkMode ? 'light' : 'dark');
      } catch (error) {
        console.error('Error updating navigation bar:', error);
      }
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    updateTheme(settings.themePreference);
  }, [settings.themePreference, systemTheme]);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      const [savedSettings, savedHistory] = await Promise.all([
        getSettings(),
        getHistory()
      ]);
      setSettings(savedSettings);
      setHistory(savedHistory);
      updateTheme(savedSettings.themePreference);
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
    
    if (newSettings.themePreference !== undefined) {
      updateTheme(newSettings.themePreference);
    }
  };

  const toggleTheme = async (theme?: 'system' | 'light' | 'dark') => {
    const newPreference = theme || 
      (settings.themePreference === 'system' ? 'light' :
       settings.themePreference === 'light' ? 'dark' : 'system');
    
    await updateSettings({ themePreference: newPreference });
  };

  const refreshHistory = async () => {
    try {
      const savedHistory = await getHistory();
      setHistory(savedHistory);
    } catch (error) {
      console.error('Error refreshing history:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      history,
      refreshHistory,
      isLoading,
      isDark,
      themePreference: settings.themePreference,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};