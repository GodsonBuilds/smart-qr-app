import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem, AppSettings } from '../types/index';

const HISTORY_KEY = '@smartqr_history';
const SETTINGS_KEY = '@smartqr_settings';

// Gestion de l'historique
export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      // Convertir les dates string en objets Date
      return history.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
};

export const addToHistory = async (item: Omit<HistoryItem, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const history = await getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    // Éviter les doublons
    const exists = history.some(h => h.data === item.data && h.type === item.type);
    if (!exists) {
      const updatedHistory = [newItem, ...history];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout à l\'historique:', error);
  }
};

export const removeFromHistory = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error);
  }
};

// Gestion des paramètres
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    // Paramètres par défaut
    return {
      darkMode: false,
      saveHistory: true,
      language: 'fr'
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return {
      darkMode: false,
      saveHistory: true,
      language: 'fr'
    };
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
  }
};