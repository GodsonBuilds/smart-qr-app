import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';

interface ThemeContextType {
  isDark: boolean;
  themePreference: 'system' | 'light' | 'dark';
  toggleTheme: (theme?: 'system' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>('system');
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemePreference(savedTheme);
          updateTheme(savedTheme, systemTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Mettre à jour le thème quand la préférence ou le thème système change
  useEffect(() => {
    updateTheme(themePreference, systemTheme);
  }, [themePreference, systemTheme]);

  const updateTheme = async (preference: 'system' | 'light' | 'dark', currentSystemTheme: string | null | undefined) => {
    let newDarkMode = false;
    
    if (preference === 'system') {
      newDarkMode = currentSystemTheme === 'dark';
    } else {
      newDarkMode = preference === 'dark';
    }

    setIsDark(newDarkMode);

    // Mettre à jour la barre de navigation sur Android
    if (Platform.OS === 'android') {
      try {
        await NavigationBar.setBackgroundColorAsync(newDarkMode ? '#1F2937' : '#FFFFFF');
        await NavigationBar.setButtonStyleAsync(newDarkMode ? 'light' : 'dark');
      } catch (error) {
        console.error('Error updating navigation bar:', error);
      }
    }
  };

  const toggleTheme = async (theme?: 'system' | 'light' | 'dark') => {
    let newPreference: 'system' | 'light' | 'dark';
    
    if (theme) {
      newPreference = theme;
    } else {
      // Cycle entre les modes si aucun thème spécifique n'est fourni
      newPreference = themePreference === 'system' 
        ? 'light' 
        : themePreference === 'light' 
          ? 'dark' 
          : 'system';
    }

    setThemePreference(newPreference);

    try {
      await AsyncStorage.setItem('themePreference', newPreference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, themePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};