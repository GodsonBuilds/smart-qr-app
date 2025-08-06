export interface HistoryItem {
  id: string;
  type: 'url' | 'email' | 'phone' | 'text';
  data: string;
  label?: string;
  createdAt: Date;
}

export interface QRResult {
  type: string;
  data: string;
}

export interface AppSettings {
  darkMode: boolean;
  saveHistory: boolean;
  language: 'fr' | 'en';
}

export interface QRGenerationOptions {
  size: number;
  backgroundColor: string;
  color: string;
}

export type TabParamList = {
  scan: undefined;
  history: undefined;
  create: undefined;
  settings: undefined;
};