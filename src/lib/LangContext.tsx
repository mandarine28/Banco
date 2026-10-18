import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { isLang, type Lang, pickLang } from './i18n';

const STORAGE_KEY = 'banco.lang';

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

function warn(message: string, error?: unknown) {
  if (__DEV__) console.warn(`[lang] ${message}`, error ?? '');
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Langue de l'appareil (celle que suivent l'App Store / Play Store) tant que l'utilisateur n'a rien choisi
  const [lang, setLangState] = useState<Lang>(() => pickLang(getLocales().map((l) => l.languageCode)));

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (isLang(saved)) setLangState(saved);
      })
      .catch((e) => warn('lecture de la langue impossible', e));
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((e) => warn('sauvegarde de la langue impossible', e));
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
