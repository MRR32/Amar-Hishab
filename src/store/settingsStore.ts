import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../lib/translations';

interface SettingsState {
  language: Language;
  isDarkMode: boolean;
  setLanguage: (lang: Language) => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'bn',
      isDarkMode: false,
      setLanguage: (language) => set({ language }),
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
