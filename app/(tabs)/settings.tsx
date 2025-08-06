import {
  ChevronRight,
  Database,
  Globe,
  Info,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
  Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Header } from '@/components/Header';
import { useAppContext } from '../../contexts/AppContext';
import { clearHistory } from '../../services/storage';

export default function SettingsScreen() {
  const { settings, updateSettings, refreshHistory, isDark } = useAppContext();
  const [isClearing, setIsClearing] = useState(false);

  const handleThemeChange = async (preference: 'system' | 'light' | 'dark') => {
    await updateSettings({ themePreference: preference });
    Toast.show({
      type: 'success',
      text1: 'Thème appliqué',
      text2: preference === 'system' ? 'Système' : 
            preference === 'light' ? 'Clair' : 'Sombre'
    });
  };

  const showThemePicker = () => {
    Alert.alert(
      'Sélection du thème',
      'Choisissez votre préférence de thème',
      [
        { 
          text: 'Système', 
          onPress: () => handleThemeChange('system') 
        },
        { 
          text: 'Clair', 
          onPress: () => handleThemeChange('light') 
        },
        { 
          text: 'Sombre', 
          onPress: () => handleThemeChange('dark') 
        },
        { 
          text: 'Annuler', 
          style: 'cancel' 
        }
      ]
    );
  };

  const handleSaveHistoryToggle = async (value: boolean) => {
    await updateSettings({ saveHistory: value });
    Toast.show({
      type: 'success',
      text1: 'Sauvegarde historique',
      text2: value ? 'Activée' : 'Désactivée'
    });
  };

  const handleLanguageChange = async () => {
    const newLanguage = settings.language === 'fr' ? 'en' : 'fr';
    await updateSettings({ language: newLanguage });
    Toast.show({
      type: 'info',
      text1: 'Langue',
      text2: 'Fonctionnalité à venir'
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Vider l\'historique',
      'Voulez-vous supprimer tout l\'historique ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearHistory();
              await refreshHistory();
              Toast.show({
                type: 'success',
                text1: 'Historique vidé',
                text2: 'Tous les éléments ont été supprimés'
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de vider l\'historique'
              });
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  const handleContactPress = () => {
    Linking.openURL('mailto:contact@smartqr.app');
  };

  const handlePrivacyPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Confidentialité',
      text2: 'Vos données restent sur votre appareil'
    });
  };

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightContent?: React.ReactNode;
    showArrow?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightContent, showArrow = false }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl mb-3`}
    >
      <View className="mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent && (
        <View className="ml-4">
          {rightContent}
        </View>
      )}
      {showArrow && (
        <ChevronRight size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
      )}
    </TouchableOpacity>
  );

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <Text className={`text-lg font-semibold mb-4 px-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </Text>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Réglages" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-6">
          {/* Apparence */}
          <View>
            <SectionTitle title="Apparence" />
            <SettingItem
              icon={isDark ? <Moon size={24} color="#3b82f6" /> : <Sun size={24} color="#f59e0b" />}
              title="Thème"
              subtitle={
                settings.themePreference === 'system' ? 'Utiliser le thème système' :
                settings.themePreference === 'light' ? 'Thème clair' : 'Thème sombre'
              }
              onPress={showThemePicker}
              showArrow
            />
          </View>

          {/* Confidentialité et données */}
          <View>
            <SectionTitle title="Confidentialité et données" />
            <SettingItem
              icon={<Database size={24} color="#10b981" />}
              title="Sauvegarder l'historique"
              subtitle="Conserver les codes QR scannés"
              rightContent={
                <View className={`px-2 py-1 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Text className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {settings.saveHistory ? 'Activée' : 'Désactivée'}
                  </Text>
                </View>
              }
              onPress={() => handleSaveHistoryToggle(!settings.saveHistory)}
              showArrow
            />
            
            <SettingItem
              icon={<Trash2 size={24} color="#ef4444" />}
              title="Vider l'historique"
              subtitle="Supprimer tous les éléments sauvegardés"
              onPress={handleClearHistory}
              rightContent={
                isClearing ? (
                  <View className="w-5 h-5 border border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : undefined
              }
            />

            <SettingItem
              icon={<Shield size={24} color="#6366f1" />}
              title="Confidentialité"
              subtitle="Vos données restent sur votre appareil"
              onPress={handlePrivacyPress}
              showArrow
            />
          </View>

          {/* Langues */}
          <View>
            <SectionTitle title="Langue" />
            <SettingItem
              icon={<Globe size={24} color="#8b5cf6" />}
              title="Langue"
              subtitle={`Actuellement: ${settings.language === 'fr' ? 'Français' : 'English'}`}
              onPress={handleLanguageChange}
              showArrow
            />
          </View>

          {/* À propos */}
          <View>
            <SectionTitle title="À propos" />
            <SettingItem
              icon={<Smartphone size={24} color="#3b82f6" />}
              title="SmartQR"
              subtitle="Version 1.0.0"
              rightContent={
                <View className={`px-2 py-1 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Text className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    MVP
                  </Text>
                </View>
              }
            />

            <SettingItem
              icon={<Mail size={24} color="#f59e0b" />}
              title="Contact"
              subtitle="contact@smartqr.app"
              onPress={handleContactPress}
              showArrow
            />

            <SettingItem
              icon={<Info size={24} color="#6b7280" />}
              title="Technologies utilisées"
              subtitle="Expo SDK 53 • TypeScript • NativeWind"
            />
          </View>

          {/* Informations techniques */}
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
              💡 Informations
            </Text>
            <Text className={`text-sm leading-5 ${isDark ? 'text-gray-300' : 'text-blue-800'}`}>
              Cette application fonctionne entièrement hors ligne. Vos données personnelles ne sont jamais envoyées sur internet et restent sécurisées sur votre appareil.
            </Text>
          </View>

          {/* Espace en bas */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}